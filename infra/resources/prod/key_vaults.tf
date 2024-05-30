module "key_vaults" {
  source = "../_modules/key_vaults"

  resource_group_name = module.resource_groups.resource_group_fims_legacy.name
  location            = module.resource_groups.resource_group_fims_legacy.location
  project             = local.project_legacy
  common_project      = local.common_project

  tags = local.tags
}
