locals {
  op_func = {
    common_app_settings = {
      WEBSITE_SWAP_WARMUP_PING_PATH     = "/api/health"
      WEBSITE_SWAP_WARMUP_PING_STATUSES = "200"
      COSMOS_ENDPOINT                   = data.azurerm_cosmosdb_account.fims.endpoint
      COSMOS_DBNAME                     = data.azurerm_cosmosdb_sql_database.fims_op.name,
      FIMS_STORAGE__queueServiceUri     = data.azurerm_storage_account.fims_legacy.primary_queue_endpoint,
      CONFIG_QUEUE_NAME                 = var.storage_legacy.queues.config.name
      AUDIT_EVENT_QUEUE_NAME            = var.storage_legacy.queues.audit_events.name
      AUDIT_EVENT_CONTAINER_NAME        = var.audit_storage.containers.events.name
      AUDIT_STORAGE_URI                 = data.azurerm_storage_account.audit.primary_blob_endpoint
    }
  }
}

module "op_func" {
  source = "git::https://github.com/pagopa/dx.git//infra/modules/azure_function_app?ref=5f795b96d84a866de514ab32199ba3f54286f702"

  environment = merge(var.environment, {
    app_name        = "op",
    instance_number = "01"
  })

  tier = "l"

  # reuse op-app plan
  app_service_plan_id = module.op_app.app_service.plan.id

  resource_group_name = var.resource_group_name

  health_check_path = local.op_func.common_app_settings.WEBSITE_SWAP_WARMUP_PING_PATH

  application_insights_connection_string = var.application_insights.connection_string

  app_settings = merge(local.op_func.common_app_settings, {
    NODE_ENV = "production"
  })

  slot_app_settings = merge(local.op_func.common_app_settings, {
    NODE_ENV = "development"
  })

  sticky_app_setting_names = ["NODE_ENV"]

  private_dns_zone_resource_group_name = var.private_dns_zone_resource_group_name
  virtual_network                      = var.virtual_network

  subnet_cidr   = var.subnet_cidrs.op_func
  subnet_pep_id = var.subnet_pep_id

  tags = var.tags
}

resource "azurerm_role_assignment" "config_queue_op_func" {
  for_each             = toset(["Storage Queue Data Message Processor", "Storage Queue Data Reader"])
  scope                = var.storage_legacy.id
  role_definition_name = each.key
  principal_id         = module.op_func.function_app.function_app.principal_id
}

resource "azurerm_role_assignment" "audit_event_container_op_func" {
  scope                = var.audit_storage.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = module.op_func.function_app.function_app.principal_id
}

resource "azurerm_cosmosdb_sql_role_assignment" "op_func" {
  resource_group_name = data.azurerm_cosmosdb_account.fims.resource_group_name
  account_name        = data.azurerm_cosmosdb_account.fims.name
  role_definition_id  = "${data.azurerm_cosmosdb_account.fims.id}/sqlRoleDefinitions/00000000-0000-0000-0000-000000000002"
  principal_id        = module.op_func.function_app.function_app.principal_id
  scope               = data.azurerm_cosmosdb_account.fims.id
}
