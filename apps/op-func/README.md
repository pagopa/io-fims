# openid-provider function app

## Setup

1. Install the dependencies:

   ```sh
   yarn install --frozen-lockfile
   ```

2. Copy the example environment file:

   ```sh
   cp local.settings.json.example local.settings.json
   ```

3. Build the project:

   ```sh
   yarn build
   ```

4. Start the project:

   ```sh
   yarn start
   ```

## Test locally with bruno

Prerequisites:

1. Start the `op-app` locally.
2. Start the `rp-example-app` locally.
3. Perform an `Authentication Request`.
   > [!NOTE]
   > Verify that the provider has pushed a new message to the audit-events-queue
   > following this request.
4. Perform a GET request on the consent URL.
   > [!NOTE]
   > Verify that the provider has pushed a second message to the
   > audit-events-queue following this request.

### Execution

Run the `op-func` and ensure that it executes twice with a success status.
