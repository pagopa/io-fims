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
  source = "github.com/pagopa/dx//infra/modules/azure_app_service?ref=main"

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

module "op_app_roles" {
  source       = "github.com/pagopa/dx//infra/modules/azure_role_assignments?ref=main"
  principal_id = module.op_app.app_service.app_service.principal_id

  cosmos = [
    {
      account_name        = data.azurerm_cosmosdb_account.fims.name
      resource_group_name = data.azurerm_cosmosdb_account.fims.resource_group_name
      role                = "writer"
    }
  ]

  redis = [
    {
      cache_name          = var.redis_cache.name
      resource_group_name = var.resource_group_name
      role                = "writer"
      username            = "ServicePrincipal"
    }
  ]

  key_vault = [
    {
      name                = var.key_vault.name
      resource_group_name = var.key_vault.resource_group_name
      roles = {
        secrets      = "reader"
        certificates = "reader"
        keys         = "reader"
      }
    }
  ]
}
