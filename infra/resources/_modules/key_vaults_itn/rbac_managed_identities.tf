resource "azurerm_role_assignment" "identity_fims_ci_secrets" {
  scope                = azurerm_key_vault.fims_itn_key_vault.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = data.azurerm_user_assigned_identity.managed_identity_fims_ci.principal_id
}

resource "azurerm_role_assignment" "identity_fims_ci_certificates" {
  scope                = azurerm_key_vault.fims_itn_key_vault.id
  role_definition_name = "Key Vault Certificates Officer"
  principal_id         = data.azurerm_user_assigned_identity.managed_identity_fims_ci.principal_id
}

resource "azurerm_role_assignment" "identity_fims_cd_secrets" {
  scope                = azurerm_key_vault.fims_itn_key_vault.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = data.azurerm_user_assigned_identity.managed_identity_fims_cd.principal_id
}

resource "azurerm_role_assignment" "identity_fims_cd_certificates" {
  scope                = azurerm_key_vault.fims_itn_key_vault.id
  role_definition_name = "Key Vault Certificates Officer"
  principal_id         = data.azurerm_user_assigned_identity.managed_identity_fims_cd.principal_id
}
