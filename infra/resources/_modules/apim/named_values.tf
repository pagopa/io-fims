resource "azurerm_api_management_named_value" "app_backend_key" {
  name                = "io-fims-app-backend-key"
  api_management_name = data.azurerm_api_management.apim_itn_platform_api.name
  resource_group_name = data.azurerm_api_management.apim_itn_platform_api.resource_group_name
  display_name        = "io-fims-app-backend-key"
  value               = data.azurerm_key_vault_secret.app_backend_api_key_secret.value
  secret              = true
}

