module "cosmosdb_database_op" {
  source = "github.com/pagopa/terraform-azurerm-v3//cosmosdb_sql_database?ref=v8.13.0"

  name                = "op"
  resource_group_name = var.resource_group_name
  account_name        = module.cosmosdb_account_fims.name
}

module "comsosdb_sql_container_op_clients" {
  source = "github.com/pagopa/terraform-azurerm-v3//cosmosdb_sql_container?ref=v8.13.0"

  name                = "clients"
  resource_group_name = var.resource_group_name

  account_name  = module.cosmosdb_account_fims.name
  database_name = module.cosmosdb_database_op.name

  partition_key_path = "/id"
  default_ttl        = "-1"
}

module "comsosdb_sql_container_op_grants" {
  source = "github.com/pagopa/terraform-azurerm-v3//cosmosdb_sql_container?ref=v8.13.0"

  name                = "grants"
  resource_group_name = var.resource_group_name

  account_name  = module.cosmosdb_account_fims.name
  database_name = module.cosmosdb_database_op.name

  partition_key_path = "/id"
  default_ttl        = "-1"
}

module "comsosdb_sql_container_op_sessions" {
  source = "github.com/pagopa/terraform-azurerm-v3//cosmosdb_sql_container?ref=v8.13.0"

  name                = "sessions"
  resource_group_name = var.resource_group_name

  account_name  = module.cosmosdb_account_fims.name
  database_name = module.cosmosdb_database_op.name

  partition_key_path = "/id"
  default_ttl        = "-1"
}

module "comsosdb_sql_container_op_sessions_by_id" {
  source = "github.com/pagopa/terraform-azurerm-v3//cosmosdb_sql_container?ref=v8.13.0"

  name                = "sessions-by-uid"
  resource_group_name = var.resource_group_name

  account_name  = module.cosmosdb_account_fims.name
  database_name = module.cosmosdb_database_op.name

  partition_key_path = "/id"
  default_ttl        = "-1"
}

module "comsosdb_sql_container_op_interactions" {
  source = "github.com/pagopa/terraform-azurerm-v3//cosmosdb_sql_container?ref=v8.13.0"

  name                = "interactions"
  resource_group_name = var.resource_group_name

  account_name  = module.cosmosdb_account_fims.name
  database_name = module.cosmosdb_database_op.name

  partition_key_path = "/id"
  default_ttl        = "-1"
}

module "comsosdb_sql_container_op_access_tokens" {
  source = "github.com/pagopa/terraform-azurerm-v3//cosmosdb_sql_container?ref=v8.13.0"

  name                = "access-tokens"
  resource_group_name = var.resource_group_name

  account_name  = module.cosmosdb_account_fims.name
  database_name = module.cosmosdb_database_op.name

  partition_key_path = "/id"
  default_ttl        = "-1"
}

module "comsosdb_sql_container_op_authorization_codes" {
  source = "github.com/pagopa/terraform-azurerm-v3//cosmosdb_sql_container?ref=v8.13.0"

  name                = "authorization-codes"
  resource_group_name = var.resource_group_name

  account_name  = module.cosmosdb_account_fims.name
  database_name = module.cosmosdb_database_op.name

  partition_key_path = "/id"
  default_ttl        = "-1"
}

module "comsosdb_sql_container_op_authorization_codes_by_id" {
  source = "github.com/pagopa/terraform-azurerm-v3//cosmosdb_sql_container?ref=v8.13.0"

  name                = "granteds-by-grant-id"
  resource_group_name = var.resource_group_name

  account_name  = module.cosmosdb_account_fims.name
  database_name = module.cosmosdb_database_op.name

  partition_key_path = "/id"
  default_ttl        = "-1"
}


