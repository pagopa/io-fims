locals {
  user_func = {
    common_app_settings = {
      WEBSITE_WARMUP_PATH               = "/api/v1/fims/health"
      WEBSITE_SWAP_WARMUP_PING_STATUSES = "200"
      COSMOS_ENDPOINT                   = data.azurerm_cosmosdb_account.fims.endpoint
      COSMOS_DBNAME                     = data.azurerm_cosmosdb_sql_database.fims_user.name,
      ACCESS_QUEUE_NAME                 = var.storage.queues.access.name,
      EXPORT_QUEUE_NAME                 = var.storage.queues.export.name,
      FIMS_STORAGE__queueServiceUri     = data.azurerm_storage_account.fims.primary_queue_endpoint,
      MAIL_FROM                         = "IO - l'app dei servizi pubblici <no-reply@io.italia.it>"
    }
  }
}

module "user_func" {
  source = "git::https://github.com/pagopa/dx.git//infra/modules/azure_function_app?ref=5f795b96d84a866de514ab32199ba3f54286f702"

  environment = merge(var.environment, {
    app_name        = "user",
    instance_number = "01"
  })

  tier = "m"

  resource_group_name = var.resource_group_name

  health_check_path = local.user_func.common_app_settings.WEBSITE_WARMUP_PATH

  application_insights_connection_string = var.application_insights.connection_string

  app_settings = merge(local.user_func.common_app_settings, {
    NODE_ENV        = "production",
    MAILUP_SECRET   = "@Microsoft.KeyVault(VaultName=${var.key_vault.name};SecretName=mailup-secret)",
    MAILUP_USERNAME = "@Microsoft.KeyVault(VaultName=${var.key_vault.name};SecretName=mailup-username)",
  })

  slot_app_settings = merge(local.user_func.common_app_settings, {
    NODE_ENV         = "development",
    MAILHOG_HOSTNAME = "localhost",
  })

  sticky_app_setting_names = ["NODE_ENV"]

  virtual_network = var.virtual_network

  private_dns_zone_resource_group_name = var.private_dns_zone_resource_group_name

  subnet_cidr   = var.subnet_cidrs.user_func
  subnet_pep_id = var.subnet_pep_id

  tags = var.tags
}

resource "azurerm_role_assignment" "storage_user_func" {
  for_each             = toset(["Storage Queue Data Message Processor", "Storage Queue Data Reader", "Storage Queue Data Message Sender"])
  scope                = var.storage.id
  role_definition_name = each.key
  principal_id         = module.user_func.function_app.function_app.principal_id
}

resource "azurerm_cosmosdb_sql_role_assignment" "user_func" {
  resource_group_name = data.azurerm_cosmosdb_account.fims.resource_group_name
  account_name        = data.azurerm_cosmosdb_account.fims.name
  role_definition_id  = "${data.azurerm_cosmosdb_account.fims.id}/sqlRoleDefinitions/00000000-0000-0000-0000-000000000002"
  principal_id        = module.user_func.function_app.function_app.principal_id
  scope               = data.azurerm_cosmosdb_account.fims.id
}

resource "azurerm_key_vault_access_policy" "user_func" {
  key_vault_id = var.key_vault.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = module.user_func.function_app.function_app.principal_id

  secret_permissions = [
    "Get",
  ]
}
