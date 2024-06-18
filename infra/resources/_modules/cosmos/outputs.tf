output "fims" {
  value = {
    name                = module.cosmosdb_account_fims.name
    resource_group_name = var.resource_group_name
  }
}
