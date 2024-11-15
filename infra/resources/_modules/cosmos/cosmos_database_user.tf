module "cosmosdb_database_user" {
  source = "github.com/pagopa/terraform-azurerm-v3//cosmosdb_sql_database?ref=v8.28.2"

  name                = "user"
  resource_group_name = var.resource_group_name
  account_name        = module.cosmosdb_account_fims.name
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
