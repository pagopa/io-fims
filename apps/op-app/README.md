# openid-provider

## Setup

1. Install the dependencies:

   ```sh
   yarn install
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
