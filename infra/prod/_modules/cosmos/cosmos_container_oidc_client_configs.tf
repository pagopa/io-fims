resource "azurerm_cosmosdb_sql_container" "relying_party_oidc_client_configs" {
  name                = "oidc-client-configs"
  resource_group_name = var.resource_group_name
  account_name        = module.cosmosdb_account_fims.name
  database_name       = module.cosmosdb_database_relying_party.name

  partition_key_path    = "/serviceId"
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
  }
}
