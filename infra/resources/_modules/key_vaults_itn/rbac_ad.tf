resource "azurerm_role_assignment" "adgroup_admin_secrets" {
  scope                = azurerm_key_vault.fims_itn_key_vault.id
  role_definition_name = "Key Vault Secrets Officer"
  principal_id         = data.azuread_group.adgroup_admin.object_id
}

resource "azurerm_role_assignment" "adgroup_admin_keys" {
  scope                = azurerm_key_vault.fims_itn_key_vault.id
  role_definition_name = "Key Vault Crypto Officer"
  principal_id         = data.azuread_group.adgroup_admin.object_id
}

resource "azurerm_role_assignment" "adgroup_admin_certificates" {
  scope                = azurerm_key_vault.fims_itn_key_vault.id
  role_definition_name = "Key Vault Certificates Officer"
  principal_id         = data.azuread_group.adgroup_admin.object_id
}

resource "azurerm_role_assignment" "adgroup_developers_secrets" {
  scope                = azurerm_key_vault.fims_itn_key_vault.id
  role_definition_name = "Key Vault Secrets Officer"
  principal_id         = data.azuread_group.adgroup_developers.object_id
}

resource "azurerm_role_assignment" "adgroup_developers_keys" {
  scope                = azurerm_key_vault.fims_itn_key_vault.id
  role_definition_name = "Key Vault Crypto Officer"
  principal_id         = data.azuread_group.adgroup_developers.object_id
}

resource "azurerm_role_assignment" "adgroup_developers_certificates" {
  scope                = azurerm_key_vault.fims_itn_key_vault.id
  role_definition_name = "Key Vault Certificates Officer"
  principal_id         = data.azuread_group.adgroup_developers.object_id
}

resource "azurerm_role_assignment" "adgroup_externals_secrets" {
  scope                = azurerm_key_vault.fims_itn_key_vault.id
  role_definition_name = "Key Vault Secrets Officer"
  principal_id         = data.azuread_group.adgroup_externals.object_id
}

resource "azurerm_role_assignment" "adgroup_externals_keys" {
  scope                = azurerm_key_vault.fims_itn_key_vault.id
  role_definition_name = "Key Vault Crypto Officer"
  principal_id         = data.azuread_group.adgroup_externals.object_id
}

resource "azurerm_role_assignment" "adgroup_externals_certificates" {
  scope                = azurerm_key_vault.fims_itn_key_vault.id
  role_definition_name = "Key Vault Certificates Officer"
  principal_id         = data.azuread_group.adgroup_externals.object_id
}
