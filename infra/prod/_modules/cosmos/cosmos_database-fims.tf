module "cosmosdb_database_fims" {
  source = "github.com/pagopa/terraform-azurerm-v3//cosmosdb_sql_database?ref=v7.67.1"

  name                = "fims"
  resource_group_name = var.resource_group_name
  account_name        = module.cosmosdb_account_fims.name
}
