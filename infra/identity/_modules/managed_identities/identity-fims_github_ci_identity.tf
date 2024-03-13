module "managed_identity_ci" {
  source = "github.com/pagopa/terraform-azurerm-v3//github_federated_identity?ref=v7.65.0"

  prefix    = var.prefix
  env_short = var.env_short
  domain    = var.domain

  identity_role = "ci"

  github_federations = local.ci_github_federations

  ci_rbac_roles = {
    subscription_roles = local.environment_ci_roles.subscription
    resource_groups    = local.environment_ci_roles.resource_groups
  }

  tags = var.tags
}

resource "azurerm_key_vault_access_policy" "key_vault_access_policy_identity_ci" {
  key_vault_id = data.azurerm_key_vault.kv_citizen.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = module.managed_identity_ci.identity_principal_id

  secret_permissions = [
    "Get",
    "List",
  ]
}
