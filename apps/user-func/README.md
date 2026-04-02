# user-func

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
4. Perform a GET request on the consent URL.
   > [!NOTE]
   > Verify that the provider has pushed a second message to the
   > access-queue following this request.

> [!TIP]
> If you intend to test the ProcessExport request, ensure you have a MailHog
> container running locally.

### Execution

#### CreateAccess

Once the `op-app` has pushed the message into the access-queue, run the `user-func`.
Verify that the `CreateAccess` function executes successfully exactly once.

#### GetAccessHistory

You can test the `GetAccessHistory` by simply call it with bruno.

#### RequestExport & ProcessExport

To test `RequestExport`, call the endpoint in Bruno. This will automatically
trigger the `ProcessExport` function. You can then verify the results using the
MailHog UI.
