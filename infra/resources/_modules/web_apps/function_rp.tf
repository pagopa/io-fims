locals {
  rp_func = {
    common_app_settings = {}
  }
}

module "relying_party_func" {
  source = "github.com/pagopa/terraform-azurerm-v3.git//function_app?ref=v8.15.0"

  name                = "${var.project_legacy}-rp-func"
  location            = var.environment.location
  resource_group_name = var.resource_group_name_legacy

  health_check_path = "/health"

  app_settings = local.rp_func.common_app_settings

  node_version    = "20"
  runtime_version = "~4"
  always_on       = true

  app_service_plan_info = {
    kind                         = "Linux"
    sku_size                     = "S1"
    maximum_elastic_worker_count = 0
    worker_count                 = 1
    zone_balancing_enabled       = false
  }

  subnet_id = var.subnet_id

  application_insights_instrumentation_key = data.azurerm_application_insights.common.instrumentation_key
  system_identity_enabled                  = true

  tags = var.tags
}

module "rp_func_roles" {
  source       = "github.com/pagopa/dx//infra/modules/azure_role_assignments?ref=main"
  principal_id = module.relying_party_func.system_identity_principal

  cosmos = [
    {
      account_name        = data.azurerm_cosmosdb_account.fims.name
      resource_group_name = data.azurerm_cosmosdb_account.fims.resource_group_name
      role                = "writer"
    }
  ]

  key_vault = [
    {
      name                = var.key_vault.name
      resource_group_name = var.key_vault.resource_group_name
      roles = {
        secrets = "reader"
      }
    }
  ]
}

module "relying_party_func_staging_slot" {
  source = "github.com/pagopa/terraform-azurerm-v3.git//function_app_slot?ref=v8.15.0"

  name                = "staging"
  location            = var.environment.location
  resource_group_name = var.resource_group_name_legacy

  function_app_id     = module.relying_party_func.id
  app_service_plan_id = module.relying_party_func.app_service_plan_id

  health_check_path = "/health"

  storage_account_name       = module.relying_party_func.storage_account.name
  storage_account_access_key = module.relying_party_func.storage_account.primary_access_key

  node_version                             = "20"
  runtime_version                          = "~4"
  always_on                                = true
  application_insights_instrumentation_key = data.azurerm_application_insights.common.instrumentation_key

  app_settings = local.rp_func.common_app_settings

  subnet_id = var.subnet_id

  allowed_subnets = [
    # TODO
  ]

  tags = var.tags
}
