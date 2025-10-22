module "cosmosdb_database_op" {
  source = "github.com/pagopa/terraform-azurerm-v3//cosmosdb_sql_database?ref=v8.28.2"

  name                = "op"
  resource_group_name = var.resource_group_name
  account_name        = module.cosmosdb_account_fims.name
}

module "comsosdb_sql_container_op_clients" {
  source = "github.com/pagopa/terraform-azurerm-v3//cosmosdb_sql_container?ref=v8.28.2"

  name                = "clients"
  resource_group_name = var.resource_group_name

  account_name  = module.cosmosdb_account_fims.name
  database_name = module.cosmosdb_database_op.name

  partition_key_path = "/id"
  default_ttl        = "-1"
}

module "comsosdb_sql_container_op_grants" {
  source = "github.com/pagopa/terraform-azurerm-v3//cosmosdb_sql_container?ref=v8.28.2"

  name                = "grants"
  resource_group_name = var.resource_group_name

  account_name  = module.cosmosdb_account_fims.name
  database_name = module.cosmosdb_database_op.name

  partition_key_path = "/id"
  default_ttl        = "-1"
}

module "comsosdb_sql_container_op_sessions" {
  source = "github.com/pagopa/terraform-azurerm-v3//cosmosdb_sql_container?ref=v8.28.2"

  name                = "sessions"
  resource_group_name = var.resource_group_name

  account_name  = module.cosmosdb_account_fims.name
  database_name = module.cosmosdb_database_op.name

  partition_key_path = "/id"
  default_ttl        = "-1"
}

module "comsosdb_sql_container_op_sessions_by_id" {
  source = "github.com/pagopa/terraform-azurerm-v3//cosmosdb_sql_container?ref=v8.28.2"

  name                = "sessions-by-uid"
  resource_group_name = var.resource_group_name

  account_name  = module.cosmosdb_account_fims.name
  database_name = module.cosmosdb_database_op.name

  partition_key_path = "/id"
  default_ttl        = "-1"
}

module "comsosdb_sql_container_op_interactions" {
  source = "github.com/pagopa/terraform-azurerm-v3//cosmosdb_sql_container?ref=v8.28.2"

  name                = "interactions"
  resource_group_name = var.resource_group_name

  account_name  = module.cosmosdb_account_fims.name
  database_name = module.cosmosdb_database_op.name

  partition_key_path = "/id"
  default_ttl        = "-1"
}

module "comsosdb_sql_container_op_access_tokens" {
  source = "github.com/pagopa/terraform-azurerm-v3//cosmosdb_sql_container?ref=v8.28.2"

  name                = "access-tokens"
  resource_group_name = var.resource_group_name

  account_name  = module.cosmosdb_account_fims.name
  database_name = module.cosmosdb_database_op.name

  partition_key_path = "/id"
  default_ttl        = "-1"
}

module "comsosdb_sql_container_op_authorization_codes" {
  source = "github.com/pagopa/terraform-azurerm-v3//cosmosdb_sql_container?ref=v8.28.2"

  name                = "authorization-codes"
  resource_group_name = var.resource_group_name

  account_name  = module.cosmosdb_account_fims.name
  database_name = module.cosmosdb_database_op.name

  partition_key_path = "/id"
  default_ttl        = "-1"
}

module "comsosdb_sql_container_op_authorization_codes_by_id" {
  source = "github.com/pagopa/terraform-azurerm-v3//cosmosdb_sql_container?ref=v8.28.2"

  name                = "granteds-by-grant-id"
  resource_group_name = var.resource_group_name

  account_name  = module.cosmosdb_account_fims.name
  database_name = module.cosmosdb_database_op.name

  partition_key_path = "/id"
  default_ttl        = "-1"
}

resource "azurerm_cosmosdb_sql_database" "op" {
  name                = "op"
  resource_group_name = var.itn_resource_group_name
  account_name        = module.azure-cosmos-account.name

  autoscale_settings {
    max_throughput = 10000
  }
}

resource "azurerm_cosmosdb_sql_container" "op_clients" {
  name                = "clients"
  resource_group_name = var.itn_resource_group_name

  account_name          = module.azure-cosmos-account.name
  database_name         = azurerm_cosmosdb_sql_database.op.name
  partition_key_paths   = ["/id"]
  partition_key_version = 2

  autoscale_settings {
    max_throughput = 20000
  }
}

resource "azurerm_cosmosdb_sql_container" "op_grants" {
  name                = "grants"
  resource_group_name = var.itn_resource_group_name

  account_name          = module.azure-cosmos-account.name
  database_name         = azurerm_cosmosdb_sql_database.op.name
  partition_key_paths   = ["/id"]
  partition_key_version = 2

  autoscale_settings {
    max_throughput = 20000
  }
}

resource "azurerm_cosmosdb_sql_container" "op_sessions" {
  name                = "sessions"
  resource_group_name = var.itn_resource_group_name

  account_name          = module.azure-cosmos-account.name
  database_name         = azurerm_cosmosdb_sql_database.op.name
  partition_key_paths   = ["/id"]
  partition_key_version = 2

  autoscale_settings {
    max_throughput = 15000
  }
}

resource "azurerm_cosmosdb_sql_container" "op_sessions_by_id" {
  name                = "sessions-by-uid"
  resource_group_name = var.itn_resource_group_name

  account_name          = module.azure-cosmos-account.name
  database_name         = azurerm_cosmosdb_sql_database.op.name
  partition_key_paths   = ["/id"]
  partition_key_version = 2

  autoscale_settings {
    max_throughput = 15000
  }
}

resource "azurerm_cosmosdb_sql_container" "op_interactions" {
  name                = "interactions"
  resource_group_name = var.itn_resource_group_name

  account_name          = module.azure-cosmos-account.name
  database_name         = azurerm_cosmosdb_sql_database.op.name
  partition_key_paths   = ["/id"]
  partition_key_version = 2

  autoscale_settings {
    max_throughput = 80000
  }
}

resource "azurerm_cosmosdb_sql_container" "op_access_tokens" {
  name                = "access-tokens"
  resource_group_name = var.itn_resource_group_name

  account_name          = module.azure-cosmos-account.name
  database_name         = azurerm_cosmosdb_sql_database.op.name
  partition_key_paths   = ["/id"]
  partition_key_version = 2

  autoscale_settings {
    max_throughput = 10000
  }
}

resource "azurerm_cosmosdb_sql_container" "op_authorization_codes" {
  name                = "authorization-codes"
  resource_group_name = var.itn_resource_group_name

  account_name          = module.azure-cosmos-account.name
  database_name         = azurerm_cosmosdb_sql_database.op.name
  partition_key_paths   = ["/id"]
  partition_key_version = 2
}

resource "azurerm_cosmosdb_sql_container" "op_authorization_codes_by_id" {
  name                = "granteds-by-grant-id"
  resource_group_name = var.itn_resource_group_name

  account_name          = module.azure-cosmos-account.name
  database_name         = azurerm_cosmosdb_sql_database.op.name
  partition_key_paths   = ["/id"]
  partition_key_version = 2

  autoscale_settings {
    max_throughput = 10000
  }
}
