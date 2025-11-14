module "cosno_api_com_admins" {
  source  = "pagopa-dx/azure-role-assignments/azurerm"
  version = "~> 0.0"

  principal_id = var.com_admins_azuread_group.object_id

  cosmos = [
    {
      account_name        = module.azure-cosmos-account.name
      resource_group_name = module.azure-cosmos-account.resource_group_name
      database            = resource.azurerm_cosmosdb_sql_database.op.name
      role                = "reader"
    },
    {
      account_name        = module.azure-cosmos-account.name
      resource_group_name = module.azure-cosmos-account.resource_group_name
      database            = resource.azurerm_cosmosdb_sql_database.user.name
      role                = "reader"
    },
    {
      account_name        = module.azure-cosmos-account.name
      resource_group_name = module.azure-cosmos-account.resource_group_name
      database            = resource.azurerm_cosmosdb_sql_database.op.name
      role                = "writer"
    }
  ]
}
