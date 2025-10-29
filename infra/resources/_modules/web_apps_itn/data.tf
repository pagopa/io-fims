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

data "azurerm_cosmosdb_sql_database" "fims_op" {
  name                = "op"
  resource_group_name = var.cosmosdb_account.resource_group_name
  account_name        = var.cosmosdb_account.name
}

data "azurerm_storage_account" "fims" {
  name                = var.storage.name
  resource_group_name = var.storage.resource_group_name
}

data "azurerm_storage_account" "fims_legacy" {
  name                = var.storage_legacy.name
  resource_group_name = var.storage_legacy.resource_group_name
}

data "azurerm_storage_account" "audit" {
  name                = var.audit_storage.name
  resource_group_name = var.audit_storage.resource_group_name
}
