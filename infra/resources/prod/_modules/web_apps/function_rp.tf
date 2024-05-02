resource "azurerm_role_assignment" "rp_func_cosmos_query" {
  scope              = var.cosmos_account_id
  role_definition_id = var.cosmos_query_role_definition_id
  principal_id       = module.relying_party_func.system_identity_principal
}

module "relying_party_func" {
  source = "github.com/pagopa/terraform-azurerm-v3.git//function_app?ref=v7.72.2"

  name                = "${var.product}-rp-func"
  location            = var.location
  resource_group_name = var.resource_group_name

  health_check_path = "/health"

  app_settings = local.relying_party_func.app_settings

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

resource "azurerm_key_vault_access_policy" "relying_party_func_key_vault_access_policy" {
  key_vault_id = var.key_vault_id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = module.relying_party_func.system_identity_principal

  secret_permissions      = ["Get"]
  storage_permissions     = []
  certificate_permissions = []
}

resource "azurerm_role_assignment" "rp_func_staging_cosmos_query" {
  scope              = var.cosmos_account_id
  role_definition_id = var.cosmos_query_role_definition_id
  principal_id       = module.relying_party_func_staging_slot.system_identity_principal
}

module "relying_party_func_staging_slot" {
  source = "github.com/pagopa/terraform-azurerm-v3.git//function_app_slot?ref=v7.72.2"

  name                = "staging"
  location            = var.location
  resource_group_name = var.resource_group_name

  function_app_id     = module.relying_party_func.id
  app_service_plan_id = module.relying_party_func.app_service_plan_id

  health_check_path = "/health"

  storage_account_name       = module.relying_party_func.storage_account.name
  storage_account_access_key = module.relying_party_func.storage_account.primary_access_key

  node_version                             = "18"
  runtime_version                          = "~4"
  always_on                                = true
  application_insights_instrumentation_key = data.azurerm_application_insights.application_insights.instrumentation_key

  app_settings = merge(
    local.relying_party_func.app_settings,
    {
      # Disabled functions on slot triggered by queue and timer
      for to_disable in local.relying_party_func.staging_disabled :
      format("AzureWebJobs.%s.Disabled", to_disable) => "true"
    }
  )

  subnet_id = var.subnet_id

  allowed_subnets = [
    # TODO
  ]

  tags = var.tags
}
