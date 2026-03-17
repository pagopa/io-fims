resource "azurerm_api_management_named_value" "app_backend_key" {
  name                = "io-fims-app-backend-key"
  api_management_name = data.azurerm_api_management.apim_itn_platform_api.name
  resource_group_name = data.azurerm_api_management.apim_itn_platform_api.resource_group_name
  display_name        = "io-fims-app-backend-key"
  secret              = true
  value_from_key_vault {
    secret_id = "${var.key_vault.vault_uri}secrets/appbackend-APP-BACKEND-PRIMARY-KEY"
  }
}

