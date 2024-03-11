resource "azurerm_cosmosdb_sql_container" "fims_interaction" {

  name                = "interaction"
  resource_group_name = var.resource_group_name
  account_name        = module.cosmosdb_account_fims.name
  database_name       = module.cosmosdb_sql_database_fims.name

  partition_key_path    = "/id"
  partition_key_version = 2

  autoscale_settings {
    max_throughput = 1000
  }

  default_ttl = -1

  indexing_policy {
    indexing_mode = "consistent"

    included_path {
      path = "/*"
    }

    excluded_path {
      path = "/\"_etag\"/?"
    }
  }
}
