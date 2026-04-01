# openid-provider

## Setup

1. Install the dependencies:

   ```sh
   yarn install --frozen-lockfile
   ```

2. Copy the example environment file:

   ```sh
   cp .env.example .env
   ```

3. Build the project:

   ```sh
   yarn build
   ```

4. Start the project:

   ```sh
   yarn start:dev
   ```

## Test locally with bruno

Prerequisites:

1. Start the `rp-example-app` locally.
2. Perform a lollipop login and obtain a FIMS token via the `get session` call.
3. Add a new cookie inside bruno as follows:

| Domain      | Path | Key              | Value                               |
| ----------- | ---- | ---------------- | ----------------------------------- |
| `localhost` | `/`  | `_io_fims_token` | The FIMS token obtained after login |

[!IMPORTANT]
Clear all cookies from previous calls before starting; otherwise, the flow will
fail with a 500 Internal Server Error.

### Execution

1. Call the Authentication Request endpoint. You will receive a consent URL in
   the response payload.
2. Open a new tab in Bruno to call the consent URL.
3. Perform a GET request to this URL.
   > [!NOTE]
   > Ensure that all cookies set by the Authentication Request are included in this call.

## FAQ

### I can't connect to the test CosmosDB account

1. Login to Azure

   ```sh
   az login
   ```

2. Set `DEV-IO` as current subscription

   ```sh
   az account set --subscription DEV-IO
   ```

3. Get your Microsoft Entra `objectId`

   ```sh
   az ad user show --id YOUR-EMAIL
   ```

4. Create the role assigment using your `objectId` as `PRINCIPAL_ID`

   ```sh
   az cosmosdb sql role assignment create --account-name io-d-itn-common-cosno-01 --resource-group io-d-itn-common-rg-01 --scope "/" --principal-id PRINCIPAL_ID --role-definition-id 00000000-0000-0000-0000-000000000002
   ```
