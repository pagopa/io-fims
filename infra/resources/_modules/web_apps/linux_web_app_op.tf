locals {
  op_app = {
    common_app_settings = {
      COSMOS_ENDPOINT = data.azurerm_cosmosdb_account.fims.endpoint
      COSMOS_DBNAME   = data.azurerm_cosmosdb_sql_database.fims_op.name
      REDIS_URL       = var.redis_cache.url
      REDIS_PASSWORD  = var.redis_cache.access_key
      OIDC_ISSUER     = "@Microsoft.KeyVault(VaultName=${var.key_vault.name};SecretName=op-oidc-issuer)"
      IO_BASE_URL     = "@Microsoft.KeyVault(VaultName=${var.key_vault.name};SecretName=io-be-base-url)"
    }
  }
}

module "op_app" {
  source = "git::https://github.com/pagopa/dx.git//infra/modules/azure_app_service?ref=9f553b47f614fa9be4631a81e6f8ca1558b6ae56"

  environment = merge(var.environment, {
    app_name        = "op",
    instance_number = "01"
  })

  tier = "test"

  resource_group_name = var.resource_group_name

  health_check_path = "/health"

  app_settings = merge(local.op_app.common_app_settings, {
    NODE_ENVIRONMENT = "production"
  })

  slot_app_settings = merge(local.op_app.common_app_settings, {
    NODE_ENVIRONMENT = "staging"
  })

  sticky_app_setting_names = ["NODE_ENVIRONMENT"]

  virtual_network = var.virtual_network

  subnet_cidr   = var.subnet_cidrs.op_app
  subnet_pep_id = var.subnet_pep_id

  tags = var.tags
}

resource "azurerm_role_assignment" "key_vault_fims_op_app" {
  scope                = var.key_vault.id
  role_definition_name = "Key Vault Reader"
  principal_id         = module.op_app.app_service.app_service.principal_id
}

resource "azurerm_redis_cache_access_policy_assignment" "op_app" {
  name               = "op_app"
  redis_cache_id     = var.redis_cache.id
  access_policy_name = "Data Contributor"
  object_id          = module.op_app.app_service.app_service.principal_id
  object_id_alias    = "ServicePrincipal"
}

resource "azurerm_cosmosdb_sql_role_assignment" "op_app" {
  resource_group_name = data.azurerm_cosmosdb_account.fims.resource_group_name
  account_name        = data.azurerm_cosmosdb_account.fims.name
  role_definition_id  = "${data.azurerm_cosmosdb_account.fims.id}/sqlRoleDefinitions/00000000-0000-0000-0000-000000000002"
  principal_id        = module.op_app.app_service.app_service.principal_id
  scope               = data.azurerm_cosmosdb_account.fims.id
}
