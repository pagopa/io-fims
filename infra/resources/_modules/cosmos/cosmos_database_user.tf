module "cosmosdb_database_user" {
  source = "github.com/pagopa/terraform-azurerm-v3//cosmosdb_sql_database?ref=v8.28.2"

  name                = "user"
  resource_group_name = var.resource_group_name
  account_name        = module.cosmosdb_account_fims.name
}

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

module "comsosdb_sql_container_user_export_requests" {
  source = "github.com/pagopa/terraform-azurerm-v3//cosmosdb_sql_container?ref=v8.28.2"

  name                = "export-requests"
  resource_group_name = var.resource_group_name

  account_name  = module.cosmosdb_account_fims.name
  database_name = module.cosmosdb_database_user.name

  partition_key_path = "/fiscalCode"
  default_ttl        = "-1"
}

module "comsosdb_sql_container_user_accesses" {
  source = "github.com/pagopa/terraform-azurerm-v3//cosmosdb_sql_container?ref=v8.28.2"

  name                = "accesses"
  resource_group_name = var.resource_group_name

  account_name  = module.cosmosdb_account_fims.name
  database_name = module.cosmosdb_database_user.name

  partition_key_path = "/fiscalCode"
  default_ttl        = "-1"
}
