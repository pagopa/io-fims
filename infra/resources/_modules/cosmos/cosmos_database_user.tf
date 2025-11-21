resource "azurerm_cosmosdb_sql_database" "user" {
  name                = "user"
  resource_group_name = var.itn_resource_group_name
  account_name        = module.azure-cosmos-account.name

  autoscale_settings {
    max_throughput = 10000
  }
}

resource "azurerm_cosmosdb_sql_container" "accesses" {
  name                = "accesses"
  resource_group_name = var.itn_resource_group_name

  account_name          = module.azure-cosmos-account.name
  database_name         = azurerm_cosmosdb_sql_database.user.name
  partition_key_paths   = ["/fiscalCode"]
  partition_key_version = 2

  autoscale_settings {
    max_throughput = 20000
  }
}

resource "azurerm_cosmosdb_sql_container" "export_requests" {
  name                = "export-requests"
  resource_group_name = var.itn_resource_group_name

  account_name          = module.azure-cosmos-account.name
  database_name         = azurerm_cosmosdb_sql_database.user.name
  partition_key_paths   = ["/fiscalCode"]
  partition_key_version = 2

  autoscale_settings {
    max_throughput = 20000
  }
}
