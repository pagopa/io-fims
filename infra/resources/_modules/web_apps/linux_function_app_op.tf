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

  health_check_path = "/health"

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

module "op_func_roles" {
  source       = "github.com/pagopa/dx//infra/modules/azure_role_assignments?ref=main"
  principal_id = module.op_func.function_app.function_app.principal_id

  cosmos = [
    {
      account_name        = data.azurerm_cosmosdb_account.fims.name
      resource_group_name = data.azurerm_cosmosdb_account.fims.resource_group_name
      role                = "writer"
    }
  ]

  storage_queue = [
    {
      storage_account_name = var.storage_account.name
      resource_group_name  = var.storage_account.resource_group_name
      queue_name           = var.storage_account.queues.config.name
      role                 = "reader"
    }
  ]
}
