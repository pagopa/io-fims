import type {
  EventRepository,
  SessionRepository,
} from "@/domain/session.js";
import type * as oidc from "oidc-provider";

import {
  type IdentityProvider,
  type Scope,
  metadataForConsentFromScopes,
} from "@/domain/user-metadata.js";
import { AuditUseCase } from "@/use-cases/audit.js";
import { HealthUseCase } from "@/use-cases/health.js";
import { LoginUseCase } from "@/use-cases/login.js";
import { faker } from "@faker-js/faker/locale/it";
import { ClientMetadata } from "io-fims-common/domain/client-metadata";
import * as jose from "jose";
import * as crypto from "node:crypto";
import { pino } from "pino";
import request, { Agent, Response } from "supertest";
import { ulid } from "ulid";
import { Mocked, describe, expect, test, vi } from "vitest";
import { z } from "zod";

import { schemas } from "../express/api-models.js";
import { createApplication } from "../express/application.js";
import { createProvider } from "../oidc/provider.js";
import { UserMetadata, userMetadataSchema } from "../io/user-metadata.js";
import { StorageQueueClient } from "@/domain/storage.js";

const logger = pino();

const health = new HealthUseCase([]);

const createClient = (): ClientMetadata => ({
  client_id: ulid(),
  client_id_issued_at: 1715695157510,
  client_secret: "my-secret",
  grant_types: ["authorization_code", "implicit"],
  redirect_display_names: {
    "https://rp.localhost": {
      en: "Manage your appointments",
      it: "Gestisci i tuoi appuntamenti",
    },
  },
  redirect_uris: ["https://rp.localhost"],
  response_types: ["code", "id_token"],
  token_endpoint_auth_method: "client_secret_basic",
});

const createUserMetadata = (): {
  metadata: UserMetadata;
  token: string;
} => ({
  metadata: {
    assertion: "<some-xml></some-xml>",
    assertionRef: "sha256-k8YQcM9wlvc1Zb3o7l88htasPda3dYiZ3Xt17ulY6fE",
    firstName: faker.person.firstName(),
    fiscalCode: faker.string.alphanumeric({ casing: "upper", length: 16 }),
    lastName: faker.person.lastName(),
    publicKey:
      "eyJrdHkiOiJFQyIsImNydiI6IlAtMjU2IiwieCI6IlJhVlJ5US1pVk5CR1NxbFFnbmNtdmRUcEZSZFJnN0dweHIzVVBqamtTOU0iLCJ5IjoiWWlHZ2lyNG9Scm4yVkZnNjV0NVJoQjdUU3dyTXJlWUI0XzBQLTZ6LURWayJ9",
  },
  token: faker.string.alpha({ length: 10 }),
});

const store = new Map<string, unknown>();
const eventStore = new Map<string, unknown>();
const eventQueue = [];

const sessionRepository: Mocked<SessionRepository> = {
  get: vi
    .fn()
    .mockImplementation(async (id) => store.get(`user-session:${id}`)),
  upsert: vi.fn().mockImplementation(async (session) => {
    store.set(`user-session:${session.id}`, session);
  }),
};

const eventRepository: Mocked<EventRepository> = {
  get: vi
    .fn()
    .mockImplementation(async (clientId, fiscalCode) =>
      eventStore.get(`audit:${clientId}:${fiscalCode}`),
    ),
  upsert: vi.fn().mockImplementation(async (event) => {
    eventStore.set(`audit:${event.clientId}:${event.fiscalCode}`, event);
  }),
};

const queueClient: Mocked<StorageQueueClient> = {
  sendMessage: vi
    .fn()
    .mockImplementation(async (auditEvent) => eventQueue.push(auditEvent)),
};

const adapter = (name: string): Mocked<oidc.Adapter> => ({
  consume: vi.fn().mockImplementation(async (id) => {
    const value = store.get(`${name}:${id}`);
    if (typeof value === "object") {
      store.set(`${name}:${id}`, { ...value, consumed: true });
    }
  }),
  destroy: vi.fn(),
  find: vi.fn().mockImplementation(async (id) => store.get(`${name}:${id}`)),
  findByUid: vi.fn().mockImplementation(async (uid) => {
    const k = store.get(`Session-byuid:${uid}`);
    if (typeof k === "string") {
      return store.get(k);
    }
  }),
  findByUserCode: vi.fn(),
  revokeByGrantId: vi.fn(),
  upsert: vi.fn().mockImplementation(async (id, payload) => {
    store.set(`${name}:${id}`, payload);
    if (name === "Session") {
      store.set(`${name}-byuid:${payload.uid}`, `${name}:${id}`);
    }
  }),
});

const identityProvider: IdentityProvider = {
  getUserMetadata: async (token) => {
    const metadata = store.get(`user-metadata:${token}`);
    return userMetadataSchema.parse(metadata);
  },
};

async function followLocalRedirect(agent: Agent, response: Response) {
  let res = response;

  const isAbsolute = (location: string) =>
    z.string().url().safeParse(location).success;

  const isLocal = (location: string) =>
    (isAbsolute(location) && location.includes("http://127.0.0.1")) ||
    !isAbsolute(location);

  while (
    res.status >= 300 &&
    res.status <= 399 &&
    isLocal(res.header.location)
  ) {
    const redirectUrl = isAbsolute(res.header.location)
      ? new URL(res.header.location).pathname
      : res.header.location;

    res = await agent.get(redirectUrl);
  }

  return res;
}

async function authenticationRequest(
  agent: Agent,
  responseType: string,
  scopes: Scope[],
) {
  // create and register a new client
  const client = createClient();
  store.set(`Client:${client.client_id}`, client);

  // this state is unique to the entire transaction
  const state = crypto.randomBytes(10).toString("hex");

  const scope = scopes.join(" ");

  const redirectUri = client.redirect_uris[0];

  // call the authentication endpoint and follow the redirects until the consent screen
  let response = await agent.get(
    `/authorize?client_id=${client.client_id}&response_type=${responseType}&scope=${scope}&state=${state}&nonce=${state}&redirect_uri=${redirectUri}`,
  );

  response = await followLocalRedirect(agent, response);

  return { client, redirectUri, response, state };
}

async function giveConsentRequest(
  agent: Agent,
  authenticationResponse: Response,
) {
  // parse the consent screen response
  const consent = schemas.Consent.parse(authenticationResponse.body);

  // extract the pathname from the consent action since supertest does not accept absolute urls
  const consentUrl = new URL(consent._links.consent.href).pathname;

  // consent (share info with rp)
  const response = await agent.post(consentUrl);

  if (response.status !== 303) {
    return response;
  }

  // on success, the consent screen is a redirect to the authentication endpoint
  // so parse the location header
  const parsedHeaders = z
    .object({
      location: z
        .string()
        .url()
        .transform((url) => new URL(url).pathname),
    })
    .parse(response.header);

  // redirect to location
  return agent.get(parsedHeaders.location);
}

async function tokenRequest(
  agent: Agent,
  code: string,
  redirectUri: string,
  clientId: string,
  clientSecret: string,
) {
  const Authorization =
    "Basic " +
    Buffer.from(
      `${encodeURIComponent(clientId)}:${encodeURIComponent(clientSecret)}`,
    ).toString("base64");

  return agent
    .post("/token")
    .type("form")
    .set({
      Authorization,
    })
    .send({
      client_id: clientId,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    });
}

async function userInfoRequest(agent: Agent, accessToken: string) {
  return agent
    .post("/userinfo")
    .set({ Authorization: `Bearer ${accessToken}` });
}

async function parseAuthenticationResponse(
  response: Response,
): Promise<Record<string, string>> {
  const location = response.header.location.replace("#", "?").replace(";", "&");
  const callback = new URL(location);
  const params = Object.fromEntries(callback.searchParams.entries());
  return params;
}

type OIDCFlow = "authorization_code" | "implicit";

const responseTypeFromFlow = (flow: OIDCFlow): "code" | "id_token" => {
  switch (flow) {
    case "authorization_code":
      return "code";
    case "implicit":
      return "id_token";
  }
};

describe("Consent screen", () => {
  test.each<{
    flow: OIDCFlow;
    scopes: Scope[];
  }>([
    {
      flow: "authorization_code",
      scopes: ["openid"],
    },
    {
      flow: "implicit",
      scopes: ["openid"],
    },
    {
      flow: "authorization_code",
      scopes: ["openid", "profile"],
    },
    {
      flow: "implicit",
      scopes: ["openid", "profile"],
    },
  ])(
    "List the right metadata for $scopes scopes on $flow flow",
    async ({ flow, scopes }) => {
      const user = createUserMetadata();
      store.set(`user-metadata:${user.token}`, user.metadata);

      const provider = createProvider(
        "http://localhost",
        sessionRepository,
        adapter,
      );

      const login = new LoginUseCase({
        identityProvider,
        sessionRepository,
      });

      const audit = new AuditUseCase({
        eventRepository,
        queueClient,
        sessionRepository,
      });

      const app = createApplication(provider, login, audit, health, logger);

      const expected = metadataForConsentFromScopes(scopes);

      // setup agent with _io_fims_token
      const agent = request.agent(app).set({
        Cookie: `_io_fims_token=${user.token}`,
      });

      const { response } = await authenticationRequest(
        agent,
        responseTypeFromFlow(flow),
        scopes,
      );

      expect.assertions(3);

      expect(response.status).toBe(200);

      const consent = schemas.Consent.safeParse(response.body);

      expect(consent.success).toBe(true);

      const metadata = consent.success
        ? consent.data.user_metadata.map(({ name }) => name)
        : [];

      expect(metadata).toStrictEqual(expected);
    },
  );

  test.each(["it", "en", "jp"])("Localization (%s lang)", async (lang) => {
    const user = createUserMetadata();
    store.set(`user-metadata:${user.token}`, user.metadata);

    const provider = createProvider(
      "http://localhost",
      sessionRepository,
      adapter,
    );

    const login = new LoginUseCase({
      identityProvider,
      sessionRepository,
    });

    const audit = new AuditUseCase({
      eventRepository,
      queueClient,
      sessionRepository,
    });

    const app = createApplication(provider, login, audit, health, logger);

    // setup agent with _io_fims_token
    const agent = request.agent(app).set({
      "Accept-Language": lang,
      Cookie: `_io_fims_token=${user.token}`,
    });

    const { client, response } = await authenticationRequest(
      agent,
      "id_token",
      ["openid"],
    );

    const redirectDisplayNames =
      client.redirect_display_names[client.redirect_uris[0]];

    const expected = {
      redirect_display_name: Object.hasOwn(redirectDisplayNames, lang)
        ? redirectDisplayNames[lang]
        : redirectDisplayNames.it,
      user_metadata: [
        {
          display_name:
            lang === "it" || lang === "jp" ? "Codice fiscale" : "Fiscal code",
          name: "fiscalCode",
        },
      ],
    };

    expect.assertions(3);

    expect(response.status).toBe(200);

    const consent = schemas.Consent.safeParse(response.body);

    if (consent.success) {
      expect(consent.data.redirect.display_name).toBe(
        expected.redirect_display_name,
      );
      expect(consent.data.user_metadata).toStrictEqual(expected.user_metadata);
    }
  });
});
describe("Login", () => {
  describe("Recoverable errors", () => {
    test("500 error on login error", async () => {
      const provider = createProvider(
        "http://localhost",
        sessionRepository,
        adapter,
      );

      const login = new LoginUseCase({
        identityProvider,
        sessionRepository,
      });

      const audit = new AuditUseCase({
        eventRepository,
        queueClient,
        sessionRepository,
      });

      const app = createApplication(provider, login, audit, health, logger);

      // setup agent with _io_fims_token
      const agent = request.agent(app).set({
        Cookie: "_io_fims_token=no-user-for-this-token",
      });

      const authentication = await authenticationRequest(agent, "id_token", [
        "openid",
      ]);

      expect(authentication.response.statusCode).toBe(500);
    });

    test("400 error on invalid _io_fims_token", async () => {
      const provider = createProvider(
        "http://localhost",
        sessionRepository,
        adapter,
      );

      const login = new LoginUseCase({
        identityProvider,
        sessionRepository,
      });

      const audit = new AuditUseCase({
        eventRepository,
        queueClient,
        sessionRepository,
      });

      const app = createApplication(provider, login, audit, health, logger);

      // setup agent WITHOUT _io_fims_token
      const agent = request.agent(app);

      const { response } = await authenticationRequest(agent, "id_token", [
        "openid",
      ]);

      expect(response.statusCode).toBe(400);

      expect(response.body).toHaveProperty(
        "detail",
        expect.stringContaining("_io_fims_token"),
      );
    });
  });
});
describe("Consent", () => {
  test("500 error on consent action error", async () => {
    const user = createUserMetadata();
    store.set(`user-metadata:${user.token}`, user.metadata);

    const provider = createProvider(
      "http://localhost",
      sessionRepository,
      adapter,
    );

    const login = new LoginUseCase({
      identityProvider,
      sessionRepository,
    });

    const audit = new AuditUseCase({
      eventRepository,
      queueClient,
      sessionRepository,
    });

    const app = createApplication(provider, login, audit, health, logger);

    // setup agent with _io_fims_token
    const agent = request.agent(app).set({
      Cookie: `_io_fims_token=${user.token}`,
    });

    const { response } = await authenticationRequest(agent, "id_token", [
      "openid",
    ]);

    const links = schemas.Consent.shape._links.safeParse(response.body._links);

    expect.assertions(1);

    if (links.success) {
      const interactionId = links.data.consent.href.split("/").at(-2);
      store.delete(`Interaction:${interactionId}`);
      const consentResponse = await giveConsentRequest(agent, response);
      expect(consentResponse.statusCode).toBe(500);
    }
  });
});
describe("Abort", () => {
  test("Redirect to RP on access_denied", async () => {
    const user = createUserMetadata();
    store.set(`user-metadata:${user.token}`, user.metadata);

    const provider = createProvider(
      "http://localhost",
      sessionRepository,
      adapter,
    );

    const login = new LoginUseCase({
      identityProvider,
      sessionRepository,
    });

    const audit = new AuditUseCase({
      eventRepository,
      queueClient,
      sessionRepository,
    });

    const app = createApplication(provider, login, audit, health, logger);

    // setup agent with _io_fims_token
    const agent = request.agent(app).set({
      Cookie: `_io_fims_token=${user.token}`,
    });

    const { redirectUri, response } = await authenticationRequest(
      agent,
      "id_token",
      ["openid"],
    );

    const result = schemas.Consent.shape._links.safeParse(response.body._links);

    expect.assertions(5);

    if (result.success) {
      const abortUrl = new URL(result.data.abort.href).pathname;
      const abortResponse = await agent.post(abortUrl);

      expect(abortResponse.statusCode).toBe(303);
      expect(abortResponse.header).toHaveProperty(
        "location",
        expect.any(String),
      );

      const redirectionUrl = new URL(abortResponse.header.location).pathname;
      const authResponse = await agent.get(redirectionUrl);

      expect(authResponse.statusCode).toBe(303);
      expect(authResponse.header).toHaveProperty(
        "location",
        expect.stringContaining(redirectUri),
      );
      expect(authResponse.header).toHaveProperty(
        "location",
        expect.stringContaining("access_denied"),
      );
    }
  });
});

test.each<OIDCFlow>(["implicit", "authorization_code"])(
  "Successful authentication (%s flow)",
  async (flow) => {
    const responseType = responseTypeFromFlow(flow);

    const user = createUserMetadata();
    store.set(`user-metadata:${user.token}`, user.metadata);

    const provider = createProvider(
      "http://localhost",
      sessionRepository,
      adapter,
    );

    const login = new LoginUseCase({
      identityProvider,
      sessionRepository,
    });

    const audit = new AuditUseCase({
      eventRepository,
      queueClient,
      sessionRepository,
    });

    const app = createApplication(provider, login, audit, health, logger);

    // setup agent with _io_fims_token
    const agent = request.agent(app).set({
      Cookie: `_io_fims_token=${user.token}`,
    });

    const scopes: Scope[] = ["openid", "profile"];

    const { client, redirectUri, response, state } =
      await authenticationRequest(agent, responseType, scopes);

    const consentResponse = await giveConsentRequest(agent, response);

    expect(consentResponse.statusCode).toBe(303);

    const params = await parseAuthenticationResponse(consentResponse);

    expect(params).toHaveProperty("state", state);

    if (flow === "implicit") {
      expect(params).toHaveProperty("id_token");

      const payload = jose.decodeJwt(params.id_token);

      expect(payload).toEqual(
        expect.objectContaining({
          family_name: user.metadata.lastName,
          fiscal_code: user.metadata.fiscalCode,
          given_name: user.metadata.firstName,
          sub: user.metadata.fiscalCode,
        }),
      );
    } else if (flow === "authorization_code") {
      expect(params).toHaveProperty("code");

      const tokenResponse = await tokenRequest(
        agent,
        params.code,
        redirectUri,
        client.client_id,
        client.client_secret,
      );

      expect(tokenResponse.statusCode).toBe(200);

      expect(tokenResponse.body).toEqual(
        expect.objectContaining({
          access_token: expect.any(String),
          id_token: expect.any(String),
          scope: scopes.join(" "),
        }),
      );

      const payload = jose.decodeJwt(tokenResponse.body.id_token);

      expect(payload).toEqual(
        expect.objectContaining({
          sub: user.metadata.fiscalCode,
        }),
      );

      const userInfoResponse = await userInfoRequest(
        agent,
        tokenResponse.body.access_token,
      );

      expect(userInfoResponse.body).toEqual(
        expect.objectContaining({
          family_name: user.metadata.lastName,
          fiscal_code: user.metadata.fiscalCode,
          given_name: user.metadata.firstName,
          sub: user.metadata.fiscalCode,
        }),
      );
    }
  },
);

describe("Authentication Error Response", () => {
  describe("On invalid client (so we don't redirect to RP", () => {
    test("400 error on invalid_client", async () => {
      const provider = createProvider(
        "http://localhost",
        sessionRepository,
        adapter,
      );

      const login = new LoginUseCase({
        identityProvider,
        sessionRepository,
      });

      const audit = new AuditUseCase({
        eventRepository,
        queueClient,
        sessionRepository,
      });

      const app = createApplication(provider, login, audit, health, logger);

      const agent = request.agent(app);

      const response = await agent.get(
        "/authorize?client_id=NOT_EXISTING&scope=openid&redirect_uri=https://rp.localhost&response_type=code",
      );

      expect(response.statusCode).toBe(400);
      expect(response.header).toHaveProperty(
        "content-type",
        expect.stringContaining("application/json"),
      );
      expect(response.body).toHaveProperty("error", "invalid_client");
    });

    test("400 error on invalid_redirect_uri", async () => {
      const provider = createProvider(
        "http://localhost",
        sessionRepository,
        adapter,
      );

      const login = new LoginUseCase({
        identityProvider,
        sessionRepository,
      });

      const audit = new AuditUseCase({
        eventRepository,
        queueClient,
        sessionRepository,
      });

      const app = createApplication(provider, login, audit, health, logger);

      const agent = request.agent(app);

      const client = createClient();
      store.set(`Client:${client.client_id}`, client);

      const response = await agent.get(
        `/authorize?client_id=${client.client_id}&scope=openid&redirect_uri=https://unregistered-url.rp.localhost&response_type=code`,
      );

      expect(response.statusCode).toBe(400);
      expect(response.header).toHaveProperty(
        "content-type",
        expect.stringContaining("application/json"),
      );
      expect(response.body).toHaveProperty("error", "invalid_redirect_uri");
    });

    test("400 error on invalid_client_metadata", async () => {
      const provider = createProvider(
        "http://localhost",
        sessionRepository,
        adapter,
      );

      const login = new LoginUseCase({
        identityProvider,
        sessionRepository,
      });

      const audit = new AuditUseCase({
        eventRepository,
        queueClient,
        sessionRepository,
      });

      const app = createApplication(provider, login, audit, health, logger);

      const agent = request.agent(app);

      const client = createClient();

      store.set(`Client:${client.client_id}`, {
        client_id: client.client_id,
      });

      const response = await agent.get(
        `/authorize?client_id=${client.client_id}&scope=openid&response_type=code`,
      );

      expect(response.statusCode).toBe(400);
      expect(response.header).toHaveProperty(
        "content-type",
        expect.stringContaining("application/json"),
      );
      expect(response.body).toHaveProperty("error", "invalid_client_metadata");
    });
  });

  describe("On valid client", () => {
    test("Redirect to RP on unsupported response_type", async () => {
      const provider = createProvider(
        "http://localhost",
        sessionRepository,
        adapter,
      );

      const login = new LoginUseCase({
        identityProvider,
        sessionRepository,
      });

      const audit = new AuditUseCase({
        eventRepository,
        queueClient,
        sessionRepository,
      });

      const app = createApplication(provider, login, audit, health, logger);

      const agent = request.agent(app);

      const { redirectUri, response } = await authenticationRequest(
        agent,
        "unsupported-response-type",
        ["openid"],
      );

      expect(response.statusCode).toBe(303);
      expect(response.header).toHaveProperty(
        "location",
        expect.stringContaining(redirectUri),
      );
      expect(response.header).toHaveProperty(
        "location",
        expect.stringContaining("unsupported_response_type"),
      );
    });
  });
});
