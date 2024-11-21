data "azurerm_client_config" "current" {}

data "azurerm_cosmosdb_account" "fims" {
  name                = var.cosmosdb_account.name
  resource_group_name = var.cosmosdb_account.resource_group_name
}

data "azurerm_cosmosdb_sql_database" "fims_user" {
  name                = "user"
  resource_group_name = var.cosmosdb_account.resource_group_name
  account_name        = var.cosmosdb_account.name
}

data "azurerm_storage_account" "fims" {
  name                = var.storage.name
  resource_group_name = var.storage.resource_group_name
}
