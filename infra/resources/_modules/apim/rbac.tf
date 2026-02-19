module "apim_roles" {
  source          = "pagopa-dx/azure-role-assignments/azurerm"
  version         = "~> 1"
  principal_id    = data.azurerm_api_management.apim_itn_platform_api.identity[0].principal_id
  subscription_id = data.azurerm_client_config.current.subscription_id

  key_vault = [
    {
      name                = var.key_vault.name
      resource_group_name = var.key_vault.resource_group_name
      description         = "Allow ${data.azurerm_api_management.apim_itn_platform_api.name} to read secrets"
      roles = {
        secrets = "reader"
      }
    }
  ]
}
