resource "azurerm_role_assignment" "apim_key_vault_secrets_reader" {
  description          = "Allow ${data.azurerm_api_management.apim_itn_platform_api.name} to read secrets"
  principal_id         = data.azurerm_api_management.apim_itn_platform_api.identity[0].principal_id
  role_definition_name = "Key Vault Secrets User"
  scope                = var.key_vault.id
}
