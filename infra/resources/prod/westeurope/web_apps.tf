module "web_apps" {
  source = "../_modules/web_apps"

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

  cosmosdb_account = {
    name                = module.cosmos.account_name
    resource_group_name = module.resource_groups.resource_group_fims.name
  }

  key_vault_id = module.key_vaults.key_vault_fims.id

  tags = local.tags
}
