module "cosmos" {
  source = "../_modules/cosmos"

  location            = module.resource_groups.resource_group_fims.location
  project             = local.project
  product             = local.product
  resource_group_name = module.resource_groups.resource_group_fims.name
  resource_group_id   = module.resource_groups.resource_group_fims.id

  tags = local.tags
}
