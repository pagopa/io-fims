data "azurerm_api_management" "apim_itn_platform_api" {
  name                = local.apim_itn_platform_name
  resource_group_name = local.apim_itn_platform_resource_group_name
}

data "azurerm_api_management_product" "apim_itn_product_io_auth" {
  product_id          = "io-auth"
  api_management_name = data.azurerm_api_management.apim_itn_platform_api.name
  resource_group_name = data.azurerm_api_management.apim_itn_platform_api.resource_group_name
}

data "azurerm_resource_group" "weu_common" {
  name = "io-p-rg-common"
}

data "azurerm_key_vault" "weu_common" {
  name                = "io-p-kv-common"
  resource_group_name = data.azurerm_resource_group.weu_common.name
}

data "azurerm_key_vault_secret" "app_backend_api_key_secret" {
  name         = "appbackend-APP-BACKEND-PRIMARY-KEY"
  key_vault_id = data.azurerm_key_vault.weu_common.id
}

