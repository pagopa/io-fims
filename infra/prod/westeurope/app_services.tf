module "app_services" {
  source = "../_modules/app_services"

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
