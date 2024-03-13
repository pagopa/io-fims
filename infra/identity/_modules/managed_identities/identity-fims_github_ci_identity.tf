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
