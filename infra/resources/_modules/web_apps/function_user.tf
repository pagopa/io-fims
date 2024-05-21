locals {
  user_func_settings = {
    for s in var.user_func.app_settings :
    s.name => s.key_vault_secret_name != null ? "@Microsoft.KeyVault(VaultName=${var.product}-kv;SecretName=${s.key_vault_secret_name})" : s.value
  }
}

module "user_func" {
  source = "github.com/pagopa/terraform-azurerm-v3.git//function_app?ref=v8.13.0"

  name                = "${var.product}-user-func"
  location            = var.location
  resource_group_name = var.resource_group_name

  health_check_path = "/health"

  app_settings = local.user_func_settings

  node_version    = "18"
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

  application_insights_instrumentation_key = data.azurerm_application_insights.application_insights.instrumentation_key
  system_identity_enabled                  = true

  tags = var.tags
}

resource "azurerm_key_vault_access_policy" "user_func_key_vault_access_policy" {
  key_vault_id = var.key_vault_id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = module.user_func.system_identity_principal

  secret_permissions      = ["Get"]
  storage_permissions     = []
  certificate_permissions = []
}

resource "azurerm_cosmosdb_sql_role_assignment" "user_func_sql_role" {
  resource_group_name = data.azurerm_cosmosdb_account.fims.resource_group_name
  account_name        = data.azurerm_cosmosdb_account.fims.name
  role_definition_id  = "${data.azurerm_cosmosdb_account.fims.id}/sqlRoleDefinitions/00000000-0000-0000-0000-000000000002"
  principal_id        = module.user_func.system_identity_principal
  scope               = data.azurerm_cosmosdb_account.fims.id
}

module "user_func_staging_slot" {
  source = "github.com/pagopa/terraform-azurerm-v3.git//function_app_slot?ref=v8.13.0"

  name                = "staging"
  location            = var.location
  resource_group_name = var.resource_group_name

  function_app_id     = module.user_func.id
  app_service_plan_id = module.user_func.app_service_plan_id

  health_check_path = "/health"

  storage_account_name       = module.user_func.storage_account.name
  storage_account_access_key = module.user_func.storage_account.primary_access_key

  node_version                             = "18"
  runtime_version                          = "~4"
  always_on                                = true
  application_insights_instrumentation_key = data.azurerm_application_insights.application_insights.instrumentation_key

  app_settings = merge(
    local.user_func_settings,
    {
      # Disabled functions on slot triggered by queue and timer
      for to_disable in local.user_func.staging_disabled :
      format("AzureWebJobs.%s.Disabled", to_disable) => "true"
    }
  )

  subnet_id = var.subnet_id

  allowed_subnets = [
    # TODO
  ]

  tags = var.tags
}
