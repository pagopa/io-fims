data "azurerm_client_config" "current" {}

data "azurerm_application_insights" "common" {
  name                = "${local.common_project}-ai-common"
  resource_group_name = local.resource_group_name_common
}

data "azurerm_cosmosdb_account" "fims" {
  name                = var.cosmosdb_account.name
  resource_group_name = var.cosmosdb_account.resource_group_name
}

data "azurerm_cosmosdb_sql_database" "fims_op" {
  name                = "op"
  resource_group_name = var.cosmosdb_account.resource_group_name
  account_name        = var.cosmosdb_account.name
}

data "azurerm_private_dns_zone" "privatelink_azurewebsites_net" {
  name                = "privatelink.azurewebsites.net"
  resource_group_name = var.virtual_network.resource_group_name
}
