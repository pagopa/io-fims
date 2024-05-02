output "cosmos_fims" {
  value = {
    account = {
      id   = module.cosmosdb_account_fims.id
      name = module.cosmosdb_account_fims.name
    }
    database = {
      id   = module.cosmosdb_database_fims.id
      name = module.cosmosdb_database_fims.name
    }
  }
}

output "cosmos_account_fims_endpoint" {
  value     = module.cosmosdb_account_fims.endpoint
  sensitive = true
}

output "cosmos_account_fims_primary_key" {
  value     = module.cosmosdb_account_fims.primary_key
  sensitive = true
}

output "cosmos_account_fims_id" {
  value     = module.cosmosdb_account_fims.id
  sensitive = true
}

output "cosmos_query_role_definition_id" {
  value     = resource.azurerm_role_definition.cosmos_query.role_definition_id
  sensitive = false
}
