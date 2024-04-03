# io-openid-rp-example
This project takes inspiration from the [express-openid-connect](https://github.com/auth0/express-openid-connect) repository.

The goal is to create an example of a Third Party client (also called Relying Party or RP) that receives an access request
to a protected resource.
If the user who requested the resource is not authenticated, then during the login phase the RP starts
the [Implicit Flow](https://openid.net/specs/openid-connect-implicit-1_0.html#ImplicitFlow) to authenticate the user.  
Once the user has been authenticated, it will be possible to access to the protected resource.

## Prerequisites

### IO OpenID Provider
To test locally, you have to run the [IO OpenID Provider](https://github.com/pagopa/io-openid-provider) and make sure
that the client you are going to simulate has been added with its configuration parameters (e.g. `client_id`, `redirect_uri`
 and so on). Make sure that those configurations are the same set within the `.env.default` file (or in your environment).

## Environment variables

Those are all Environment variables needed by the application:

| Variable name               | Description                                                                                                                                            | type    |
|-----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|---------|
| SERVER_HOSTNAME             | The HOSTNAME the Express server is listening to                                                                                                        | string  |
| PORT                        | The HTTP port the Express server is listening to                                                                                                       | string  |
| LOG_LEVEL                   | The level of the logger                                                                                                                                | string  |
| APPLICATION_NAME            | The name of the application, used as prefix for the logger                                                                                             | string  |
| BASE_URL                    | The base URL of the RP                                                                                                                                 | string  |
| CLIENT_ID                   | The `client_id` obtained during client registration                                                                                                    | string  |
| ISSUER_BASE_URL             | The base URL of the OpenID Provider                                                                                                                    | string  |
| SECRET                      | The secret(s) used to derive an encryption key for the user identity in a session cookie and to sign the transient cookies used by the login callback. | string  |
| OIDC_SCOPES                 | The scopes to use during authentication phase                                                                                                          | string  |
| RELYING_PARTY_NAME          | Custom name for the RP                                                                                                                                 | string  |
| SILENT_LOGIN_ENABLED        | Attempt silent login on the first unauthenticated route the user visits                                                                                | boolean |
| AUTH_REQUIRED_ON_ALL_ROUTES | If true, require authentication for all routes                                                                                                         | boolean |


## Take a tour
When both the Provider and the RP are up and running, you can try to access a protected resource (e.g. `http://localhost:3000/profile`)
and receive an error.  
Then you can start the authentication process (`http://localhost:3000/login`) and the client will interact with the provider
in order to authenticate the user using the Implicit Flow.  
If there is a Cookie set with the domain name of the provider, then you will see the consent page and then the authentication
is completed.  
Otherwise, if you don't have the Cookie set, you receive an error.  
In order to complete the tour, just visit a page of the Provider (e.g. `http://localhost:3001`, assuming you are running 
it on port 3001) and set the Cookie manually.

When you are done, try again and then you will be authenticated and able to access the protected resource.

## Tips
Since the callback URI must use HTTPS protocol and cannot start with localhost, a possible solution to avoid 
issues is to use [ngrok](https://ngrok.com). This tool will secure URL to your localhost server through any NAT or firewall.

Another useful tool is [localtunnel](https://www.npmjs.com/package/localtunnel), which works similarly to ngrok and it is
used in this project; indeed the default environment variables for the `BASE_URL` and `ISSUER_BASE_URL` are set using 
an URL provided by localtunnel.

An example of a command you can launch is:
```shell
lt --subdomain io-openid-rp --port 3000
```
which exposes your `localhost:3000` to `https://io-openid-rp.loca.lt`.
