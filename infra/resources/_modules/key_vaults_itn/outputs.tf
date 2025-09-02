
output "fims" {
  value = {
    id                  = azurerm_key_vault.fims_itn_key_vault.id
    name                = azurerm_key_vault.fims_itn_key_vault.name
    resource_group_name = azurerm_key_vault.fims_itn_key_vault.resource_group_name
    vault_uri           = azurerm_key_vault.fims_itn_key_vault.vault_uri
  }
}
