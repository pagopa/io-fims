resource "azurerm_role_definition" "cosmos_query" {
  name        = "CosmosDB Data Operator"
  scope       = var.resource_group_id
  description = "Can query CosmosDB containers"

  permissions {
    actions = ["Microsoft.DocumentDB/databaseAccounts/readMetadata", "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/*"]
  }

  assignable_scopes = [
    var.resource_group_id
  ]
}
