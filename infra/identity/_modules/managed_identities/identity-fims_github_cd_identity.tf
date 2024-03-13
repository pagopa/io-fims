module "managed_identity_cd" {
  source = "github.com/pagopa/terraform-azurerm-v3//github_federated_identity?ref=v7.65.0"

  prefix    = var.prefix
  env_short = var.env_short
  domain    = var.domain

  identity_role = "cd"

  github_federations = local.cd_github_federations

  cd_rbac_roles = {
    subscription_roles = local.environment_cd_roles.subscription
    resource_groups    = local.environment_cd_roles.resource_groups
  }

  tags = var.tags
}

resource "azurerm_key_vault_access_policy" "key_vault_access_policy_identity_cd" {
  key_vault_id = data.azurerm_key_vault.kv_citizen.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = module.managed_identity_cd.identity_principal_id

  secret_permissions = [
    "Get",
    "List",
  ]
}
