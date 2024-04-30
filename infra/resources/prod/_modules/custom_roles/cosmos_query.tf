resource "azurerm_role_definition" "cosmos_query" {
  name        = "cosmos-query"
  scope       = var.resource_group_id
  description = "A role to make query on cosmos"

  permissions {
    actions = ["Microsoft.DocumentDB/databaseAccounts/readMetadata", "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/*"]
  }

  assignable_scopes = [
    var.resource_group_id
  ]
}
