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
