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

output "account_name" {
  value = module.cosmosdb_account_fims.name
}
