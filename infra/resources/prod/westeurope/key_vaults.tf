module "key_vaults" {
  source = "../_modules/key_vaults"

  resource_group_name = module.resource_groups.resource_group_fims.name
  location            = module.resource_groups.resource_group_fims.location
  project             = local.project
  product             = local.product

  tags = local.tags
}
