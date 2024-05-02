module "web_apps" {
  source = "../_modules/web_apps"

  cosmos_account_id               = module.cosmos.cosmos_account_fims_id
  cosmos_query_role_definition_id = module.cosmos.cosmos_query_role_definition_id

  rp_func = {
    autoscale_default = 1
    autoscale_minimum = 1
    autoscale_maximum = 3
    app_settings = [
      {
        name  = "NODE_ENV",
        value = "production"
      }
    ]
  }

  op_func = {
    autoscale_default = 1
    autoscale_minimum = 1
    autoscale_maximum = 3
    app_settings = [
      {
        name  = "NODE_ENV",
        value = "production"
      }
    ]
  }

  user_func = {
    autoscale_default = 1
    autoscale_minimum = 1
    autoscale_maximum = 3
    app_settings = [
      {
        name  = "NODE_ENV",
        value = "production"
      }
    ]
  }

  location            = module.resource_groups.resource_group_fims.location
  project             = local.project
  product             = local.product
  resource_group_name = module.resource_groups.resource_group_fims.name
  subnet_id           = module.networking.subnet_fims.id

  cosmos_db = {
    endpoint    = module.cosmos.cosmos_account_fims_endpoint
    primary_key = module.cosmos.cosmos_account_fims_primary_key
  }

  key_vault_id = module.key_vaults.key_vault_fims.id

  tags = local.tags
}
