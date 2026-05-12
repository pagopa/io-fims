module "repo" {
  source  = "pagopa-dx/azure-github-environment-bootstrap/azurerm"
  version = "~> 4.0"

  environment = {
    prefix          = local.prefix
    env_short       = local.env_short
    location        = local.location
    domain          = local.domain
    instance_number = local.instance_number
  }

  additional_resource_group_ids = [
    data.azurerm_resource_group.fims.id,
    data.azurerm_resource_group.com_itn_01.id,
  ]

  entraid_groups = {
    admins_object_id = data.azuread_group.admins.object_id
    devs_object_id   = data.azuread_group.developers.object_id
  }

  terraform_storage_account = {
    name                = local.tf_storage_account.name
    resource_group_name = local.tf_storage_account.resource_group_name
  }

  repository = {
    owner = "pagopa"
    name  = local.repository.name
  }

  github_private_runner = {
    container_app_environment_id = data.azurerm_container_app_environment.runner.id
    use_github_app               = true
    key_vault = {
      name                = local.runner.secret.kv_name
      resource_group_name = local.runner.secret.kv_resource_group_name
    }
  }

  private_dns_zone_resource_group_id = data.azurerm_resource_group.common_weu.id
  opex_resource_group_id             = data.azurerm_resource_group.dashboards.id

  tags = local.tags
}

resource "github_actions_secret" "codecov_token" {
  repository  = local.repository.name
  secret_name = "CODECOV_TOKEN"
  value       = data.azurerm_key_vault_secret.codecov_token.value

  lifecycle {
    ignore_changes = [remote_updated_at]
  }
}

resource "azurerm_key_vault_access_policy" "infra_ci" {
  key_vault_id = data.azurerm_key_vault.fims.id
  object_id    = module.repo.identities.infra.ci.principal_id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  secret_permissions = [
    "Get", "List"
  ]
}

resource "azurerm_key_vault_access_policy" "infra_cd" {
  key_vault_id = data.azurerm_key_vault.fims.id
  object_id    = module.repo.identities.infra.cd.principal_id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  secret_permissions = [
    "Get", "List", "Set"
  ]
}
