import { httpAzureFunction } from "@pagopa/handler-kit-azure-func";
import Health from "io-fims-common/adapters/handlers/health";

export default httpAzureFunction(Health);
