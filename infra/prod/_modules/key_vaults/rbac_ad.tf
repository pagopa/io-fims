resource "azurerm_role_assignment" "adgroup_admin_secrets" {
  scope                = module.key_vault.id
  role_definition_name = "Key Vault Secrets Officer"
  principal_id         = data.azuread_group.adgroup_admin.object_id
}

resource "azurerm_role_assignment" "adgroup_admin_keys" {
  scope                = module.key_vault.id
  role_definition_name = "Key Vault Crypto Officer"
  principal_id         = data.azuread_group.adgroup_admin.object_id
}

resource "azurerm_role_assignment" "adgroup_admin_certificates" {
  scope                = module.key_vault.id
  role_definition_name = "Key Vault Certificates Officer"
  principal_id         = data.azuread_group.adgroup_admin.object_id
}

resource "azurerm_role_assignment" "adgroup_developers_secrets" {
  scope                = module.key_vault.id
  role_definition_name = "Key Vault Secrets Officer"
  principal_id         = data.azuread_group.adgroup_developers.object_id
}

resource "azurerm_role_assignment" "adgroup_developers_keys" {
  scope                = module.key_vault.id
  role_definition_name = "Key Vault Crypto Officer"
  principal_id         = data.azuread_group.adgroup_developers.object_id
}

resource "azurerm_role_assignment" "adgroup_developers_certificates" {
  scope                = module.key_vault.id
  role_definition_name = "Key Vault Certificates Officer"
  principal_id         = data.azuread_group.adgroup_developers.object_id
}

resource "azurerm_role_assignment" "adgroup_externals_secrets" {
  scope                = module.key_vault.id
  role_definition_name = "Key Vault Secrets Officer"
  principal_id         = data.azuread_group.adgroup_externals.object_id
}

resource "azurerm_role_assignment" "adgroup_externals_keys" {
  scope                = module.key_vault.id
  role_definition_name = "Key Vault Crypto Officer"
  principal_id         = data.azuread_group.adgroup_externals.object_id
}

resource "azurerm_role_assignment" "adgroup_externals_certificates" {
  scope                = module.key_vault.id
  role_definition_name = "Key Vault Certificates Officer"
  principal_id         = data.azuread_group.adgroup_externals.object_id
}
