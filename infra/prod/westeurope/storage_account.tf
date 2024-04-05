module "storage_account" {
  source = "../_modules/storage_account"

  prefix              = local.prefix
  env_short           = local.env_short
  domain              = local.domain
  location            = module.resource_groups.resource_group_fims.location
  product             = local.product
  resource_group_name = module.resource_groups.resource_group_fims.name

  tags = local.tags
}
