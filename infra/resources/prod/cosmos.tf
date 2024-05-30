module "cosmos" {
  source = "../_modules/cosmos"

  location            = module.resource_groups.resource_group_fims_legacy.location
  project             = local.project_legacy
  common_project      = local.common_project
  resource_group_name = module.resource_groups.resource_group_fims_legacy.name

  tags = local.tags
}
