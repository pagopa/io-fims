output "fims" {
  value = {
    id                  = module.key_vault.id
    name                = module.key_vault.name
    resource_group_name = module.key_vault.resource_group_name
    vault_uri           = module.key_vault.vault_uri
  }
}

output "common" {
  value = {
    id                  = data.azurerm_key_vault.common.id
    name                = data.azurerm_key_vault.common.name
    resource_group_name = data.azurerm_key_vault.common.resource_group_name
  }
}
