
module "redis_cache" {
  source = "../_modules/redis_cache"

  resource_group_name = module.resource_groups.resource_group_fims.name

  environment = {
    prefix    = local.prefix
    domain    = local.domain
    env_short = local.env_short
    location  = local.location
  }

  virtual_network = {
    name                = module.networking.virtual_network.name
    resource_group_name = module.networking.virtual_network.resource_group_name
  }

  subnet_pep_id = module.networking.subnet_pep.id

  tags = local.tags
}
