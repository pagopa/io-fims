module "functions" {
  source = "../_modules/functions/"

  rp_func = {
    autoscale_default = 1
    autoscale_minimum = 1
    autoscale_maximum = 3
    app_settings = [
      {
        name  = "NODE_ENV",
        value = "production"
      },
      {
        name  = "COSMOS_DB_CONNECTION_STRING",
        value = module.cosmos.cosmos_account_fims_primary_connection_string
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

  key_vault_id = module.key_vaults.key_vault_fims.id

  tags = local.tags
}
