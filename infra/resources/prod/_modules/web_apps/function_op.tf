module "op_func" {
  source = "github.com/pagopa/terraform-azurerm-v3.git//function_app?ref=v7.72.2"

  name                = "${var.product}-op-func"
  location            = var.location
  resource_group_name = var.resource_group_name

  health_check_path = "/health"

  app_settings = local.openid_provider_func.app_settings

  node_version    = "18"
  runtime_version = "~4"
  always_on       = true

  app_service_plan_id = module.appservice_openid_provider.plan_id

  subnet_id = var.subnet_id

  application_insights_instrumentation_key = data.azurerm_application_insights.application_insights.instrumentation_key
  system_identity_enabled                  = true

  tags = var.tags
}

resource "azurerm_key_vault_access_policy" "openid_provider_func_key_vault_access_policy" {
  key_vault_id = var.key_vault_id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = module.op_func.system_identity_principal

  secret_permissions      = ["Get"]
  storage_permissions     = []
  certificate_permissions = []
}

module "op_func_staging_slot" {
  source = "github.com/pagopa/terraform-azurerm-v3.git//function_app_slot?ref=v7.72.2"

  name                = "staging"
  location            = var.location
  resource_group_name = var.resource_group_name

  function_app_id     = module.op_func.id
  app_service_plan_id = module.op_func.app_service_plan_id

  health_check_path = "/health"

  storage_account_name       = module.op_func.storage_account.name
  storage_account_access_key = module.op_func.storage_account.primary_access_key

  node_version                             = "18"
  runtime_version                          = "~4"
  always_on                                = true
  application_insights_instrumentation_key = data.azurerm_application_insights.application_insights.instrumentation_key

  app_settings = merge(
    local.openid_provider_func.app_settings,
    {
      # Disabled functions on slot triggered by queue and timer
      for to_disable in local.openid_provider_func.staging_disabled :
      format("AzureWebJobs.%s.Disabled", to_disable) => "true"
    }
  )

  subnet_id = var.subnet_id

  allowed_subnets = []

  tags = var.tags
}
