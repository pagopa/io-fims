locals {
  op_app = {
    common_app_settings = {
      WEBSITE_SWAP_WARMUP_PING_PATH     = "/health"
      WEBSITE_SWAP_WARMUP_PING_STATUSES = "200"
      COSMOS_ENDPOINT                   = data.azurerm_cosmosdb_account.fims.endpoint
      COSMOS_DBNAME                     = data.azurerm_cosmosdb_sql_database.fims_op.name
      REDIS_URL                         = var.redis_cache.url
      REDIS_PASSWORD                    = var.redis_cache.access_key
      # https://learn.microsoft.com/en-us/azure/azure-cache-for-redis/cache-best-practices-connection#idle-timeout
      REDIS_PING_INTERVAL      = 1000 * 60 * 9
      OIDC_ISSUER              = "@Microsoft.KeyVault(VaultName=${var.key_vault.name};SecretName=op-app-base-url)"
      SESSION_MANAGER_BASE_URL = "@Microsoft.KeyVault(VaultName=${var.key_vault.name};SecretName=op-app-session-manager-base-url)"
      LOLLIPOP_BASE_URL        = "@Microsoft.KeyVault(VaultName=${var.key_vault.name};SecretName=op-app-lollipop-base-url)"
      LOLLIPOP_API_KEY         = "@Microsoft.KeyVault(VaultName=${var.key_vault.name};SecretName=op-app-lollipop-api-key)"
      ACCESS_QUEUE_URL         = "${data.azurerm_storage_account.fims.primary_queue_endpoint}${var.storage.queues.access.name}"
      AUDIT_EVENT_QUEUE_URL    = "${data.azurerm_storage_account.fims.primary_queue_endpoint}${var.storage.queues.audit_events.name}"
      KEY_VAULT_URL            = var.key_vault.vault_uri
      KEY_VAULT_KEY_NAME       = "op-app-key"
      COOKIE_KEY               = "@Microsoft.KeyVault(VaultName=${var.key_vault.name};SecretName=op-app-cookie-secret)"
    }
  }
}

module "op_app" {
  source = "git::https://github.com/pagopa/dx.git//infra/modules/azure_app_service?ref=main"

  environment = merge(var.environment, {
    app_name        = "op",
    instance_number = "01"
  })

  tier = "l"

  resource_group_name = var.resource_group_name

  health_check_path = local.op_app.common_app_settings.WEBSITE_SWAP_WARMUP_PING_PATH

  application_insights_connection_string = var.application_insights.connection_string

  app_settings = merge(local.op_app.common_app_settings, {
    NODE_ENV = "production"
  })

  slot_app_settings = merge(local.op_app.common_app_settings, {
    NODE_ENV = "development"
  })

  sticky_app_setting_names = ["NODE_ENV"]

  private_dns_zone_resource_group_name = var.private_dns_zone_resource_group_name
  virtual_network                      = var.virtual_network

  subnet_cidr   = var.subnet_cidrs.op_app
  subnet_pep_id = var.subnet_pep_id

  tags = var.tags
}

resource "azurerm_role_assignment" "key_vault_op_app" {
  for_each             = toset(["Key Vault Secrets User", "Key Vault Crypto User"])
  scope                = var.key_vault.id
  role_definition_name = each.key
  principal_id         = module.op_app.app_service.app_service.principal_id
}

resource "azurerm_role_assignment" "key_vault_op_app_slot" {
  for_each             = toset(["Key Vault Secrets User", "Key Vault Crypto User"])
  scope                = var.key_vault.id
  role_definition_name = each.key
  principal_id         = module.op_app.app_service.app_service.slot.principal_id
}

resource "azurerm_role_assignment" "storage_op_app" {
  for_each             = toset(["Storage Queue Data Message Processor", "Storage Queue Data Message Sender"])
  scope                = var.storage.id
  role_definition_name = each.key
  principal_id         = module.op_app.app_service.app_service.principal_id
}

resource "azurerm_role_assignment" "storage_op_app_slot" {
  for_each             = toset(["Storage Queue Data Message Processor", "Storage Queue Data Message Sender"])
  scope                = var.storage.id
  role_definition_name = each.key
  principal_id         = module.op_app.app_service.app_service.slot.principal_id
}

resource "azurerm_redis_cache_access_policy_assignment" "op_app" {
  name               = "op"
  redis_cache_id     = var.redis_cache.id
  access_policy_name = "Data Contributor"
  object_id          = module.op_app.app_service.app_service.principal_id
  object_id_alias    = "ServicePrincipal"
}

resource "azurerm_redis_cache_access_policy_assignment" "op_app_slot" {
  name               = "op-slot"
  redis_cache_id     = var.redis_cache.id
  access_policy_name = "Data Contributor"
  object_id          = module.op_app.app_service.app_service.slot.principal_id
  object_id_alias    = "ServicePrincipal"
}

resource "azurerm_cosmosdb_sql_role_assignment" "op_app" {
  resource_group_name = data.azurerm_cosmosdb_account.fims.resource_group_name
  account_name        = data.azurerm_cosmosdb_account.fims.name
  role_definition_id  = "${data.azurerm_cosmosdb_account.fims.id}/sqlRoleDefinitions/00000000-0000-0000-0000-000000000002"
  principal_id        = module.op_app.app_service.app_service.principal_id
  scope               = data.azurerm_cosmosdb_account.fims.id
}

resource "azurerm_cosmosdb_sql_role_assignment" "op_app_slot" {
  resource_group_name = data.azurerm_cosmosdb_account.fims.resource_group_name
  account_name        = data.azurerm_cosmosdb_account.fims.name
  role_definition_id  = "${data.azurerm_cosmosdb_account.fims.id}/sqlRoleDefinitions/00000000-0000-0000-0000-000000000002"
  principal_id        = module.op_app.app_service.app_service.slot.principal_id
  scope               = data.azurerm_cosmosdb_account.fims.id
}

module "op_app_autoscaler" {
  source  = "pagopa-dx/azure-app-service-plan-autoscaler/azurerm"
  version = "~> 1.0"

  resource_group_name = var.resource_group_name
  location            = var.environment.location

  app_service_plan_id = module.op_app.app_service.plan.id

  target_service = {
    app_service = {
      id = module.op_app.app_service.app_service.id
    }
  }

  tags = var.tags
}
