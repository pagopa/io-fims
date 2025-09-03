module "key_vaults" {
  source = "../_modules/key_vaults"

  resource_group_name = module.itn_resource_group.name
  location            = module.itn_resource_group.location
  prefix              = local.prefix
  env_short           = local.env_short
  project             = local.project_legacy
  common_project      = local.common_project
  tags                = local.tags
}
