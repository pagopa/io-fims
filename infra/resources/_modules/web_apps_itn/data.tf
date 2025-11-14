data "azurerm_cosmosdb_account" "fims_itn" {
  name                = var.cosmosdb_account_itn.name
  resource_group_name = var.cosmosdb_account_itn.resource_group_name
}

data "azurerm_cosmosdb_sql_database" "fims_user" {
  name                = "user"
  resource_group_name = var.cosmosdb_account_itn.resource_group_name
  account_name        = var.cosmosdb_account_itn.name
}

data "azurerm_cosmosdb_sql_database" "fims_op" {
  name                = "op"
  resource_group_name = var.cosmosdb_account_itn.resource_group_name
  account_name        = var.cosmosdb_account_itn.name
}

data "azurerm_storage_account" "fims_itn" {
  name                = var.storage_itn.name
  resource_group_name = var.storage_itn.resource_group_name
}

data "azurerm_storage_account" "audit" {
  name                = var.audit_storage.name
  resource_group_name = var.audit_storage.resource_group_name
}
