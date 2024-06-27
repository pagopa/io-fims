locals {
  op_func = {
    common_app_settings = {
      COSMOS_ENDPOINT               = data.azurerm_cosmosdb_account.fims.endpoint
      COSMOS_DBNAME                 = data.azurerm_cosmosdb_sql_database.fims_op.name,
      CONFIG_QUEUE__queueServiceUri = "https://${var.storage_account.name}.queue.core.windows.net"
      CONFIG_QUEUE__name            = var.storage_account.queues.config.name
    }
  }
}

module "op_func" {
  source = "git::https://github.com/pagopa/dx.git//infra/modules/azure_function_app?ref=main"

  environment = merge(var.environment, {
    app_name        = "op",
    instance_number = "01"
  })

  tier = "test"

  # reuse op-app plan
  app_service_plan_id = module.op_app.app_service.plan.id

  resource_group_name = var.resource_group_name

  health_check_path = "/api/health"

  application_insights_connection_string = var.application_insights.connection_string

  app_settings = merge(local.op_func.common_app_settings, {
    NODE_ENVIRONMENT = "production"
  })

  slot_app_settings = merge(local.op_func.common_app_settings, {
    NODE_ENVIRONMENT = "staging"
  })

  sticky_app_setting_names = ["NODE_ENVIRONMENT"]

  virtual_network = var.virtual_network

  subnet_cidr   = var.subnet_cidrs.op_func
  subnet_pep_id = var.subnet_pep_id

  tags = var.tags
}

resource "azurerm_role_assignment" "config_queue_op_func" {
  for_each             = toset(["Storage Queue Data Message Processor", "Storage Queue Data Reader"])
  scope                = var.storage_account.id
  role_definition_name = each.key
  principal_id         = module.op_func.function_app.function_app.principal_id
}

resource "azurerm_cosmosdb_sql_role_assignment" "op_func" {
  resource_group_name = data.azurerm_cosmosdb_account.fims.resource_group_name
  account_name        = data.azurerm_cosmosdb_account.fims.name
  role_definition_id  = "${data.azurerm_cosmosdb_account.fims.id}/sqlRoleDefinitions/00000000-0000-0000-0000-000000000002"
  principal_id        = module.op_func.function_app.function_app.principal_id
  scope               = data.azurerm_cosmosdb_account.fims.id
}
