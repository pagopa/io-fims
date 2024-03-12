resource "azurerm_cosmosdb_sql_container" "fims_grant" {

  name                = "Grant"
  resource_group_name = var.resource_group_name
  account_name        = module.cosmosdb_account_fims.name
  database_name       = module.cosmosdb_database_fims.name

  partition_key_path    = "/identityId"
  partition_key_version = 2
  default_ttl           = -1

  indexing_policy {
    indexing_mode = "consistent"

    included_path {
      path = "/*"
    }

    excluded_path {
      path = "/\"_etag\"/?"
    }

    composite_index {
      index {
        path  = "/id"
        order = "Descending"
      }
      index {
        path  = "/identityId"
        order = "Ascending"
      }
    }
  }
}
