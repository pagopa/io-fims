# resource "azurerm_key_vault_access_policy" "adgroup_admin" {
#   key_vault_id = module.key_vault.id

#   tenant_id = data.azurerm_client_config.current.tenant_id
#   object_id = data.azuread_group.adgroup_admin.object_id

#   key_permissions         = ["Get", "List", "Update", "Create", "Import", "Delete", "GetRotationPolicy", ]
#   secret_permissions      = ["Get", "List", "Set", "Delete", "Restore", "Recover", ]
#   storage_permissions     = []
#   certificate_permissions = ["Get", "List", "Update", "Create", "Import", "Delete", "Restore", "Recover", ]
# }

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

## adgroup_developers group policy ##
# resource "azurerm_key_vault_access_policy" "adgroup_developers" {
#   key_vault_id = module.key_vault.id

#   tenant_id = data.azurerm_client_config.current.tenant_id
#   object_id = data.azuread_group.adgroup_developers.object_id

#   key_permissions         = ["Get", "List", "Update", "Create", "Import", "Delete", ]
#   secret_permissions      = ["Get", "List", "Set", "Delete", "Restore", "Recover", ]
#   storage_permissions     = []
#   certificate_permissions = ["Get", "List", "Update", "Create", "Import", "Delete", "Restore", "Recover", ]
# }

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
