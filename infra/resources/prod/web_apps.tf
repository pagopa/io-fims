module "web_apps" {
  source = "../_modules/web_apps"

  # --- start legacy ---
  project_legacy             = local.project_legacy
  product                    = local.common_project
  resource_group_name_legacy = module.resource_groups.resource_group_fims_legacy.name
  subnet_id                  = module.networking.subnet_fims.id
  # --- end legacy ---

  resource_group_name = module.resource_groups.resource_group_fims.name

  environment = {
    prefix    = local.prefix
    env_short = local.env_short
    location  = local.location
    domain    = local.domain
  }

  tags = local.tags

  # networking

  virtual_network = module.networking.virtual_network

  subnet_pep_id = module.networking.subnet_pep.id

  subnet_cidrs = {
    op_app     = "10.0.20.0/26"
    rp_example = "10.0.19.0/28"
  }

  # backing services

  key_vault        = module.key_vaults.fims
  cosmosdb_account = module.cosmos.fims
  redis_cache      = module.redis_cache.fims
}
