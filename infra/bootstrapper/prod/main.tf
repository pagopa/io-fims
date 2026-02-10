module "repo" {
  source  = "pagopa-dx/azure-github-environment-bootstrap/azurerm"
  version = "~> 3.0"

  environment = {
    prefix          = local.prefix
    env_short       = local.env_short
    location        = local.location
    domain          = local.domain
    instance_number = local.instance_number
  }

  additional_resource_group_ids = [
    data.azurerm_resource_group.fims_weu_01.id,
    data.azurerm_resource_group.fims.id,
    data.azurerm_resource_group.com_itn_01.id,
  ]

  subscription_id = data.azurerm_subscription.current.id
  tenant_id       = data.azurerm_client_config.current.tenant_id

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
    container_app_environment_id       = data.azurerm_container_app_environment.runner.id
    container_app_environment_location = data.azurerm_container_app_environment.runner.location
    key_vault = {
      name                = local.runner.secret.kv_name
      resource_group_name = local.runner.secret.kv_resource_group_name
    }
  }

  pep_vnet_id                        = data.azurerm_virtual_network.common.id
  private_dns_zone_resource_group_id = data.azurerm_resource_group.common_weu.id
  nat_gateway_resource_group_id      = data.azurerm_resource_group.common_itn_01.id
  opex_resource_group_id             = data.azurerm_resource_group.dashboards.id

  keyvault_common_ids = [
    data.azurerm_key_vault.fims.id
  ]

  tags = local.tags
}

resource "github_actions_secret" "codecov_token" {
  repository      = local.repository.name
  secret_name     = "CODECOV_TOKEN"
  plaintext_value = data.azurerm_key_vault_secret.codecov_token.value
}
