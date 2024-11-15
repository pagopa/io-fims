
module "redis_cache" {
  source = "../_modules/redis_cache"

  resource_group_name = module.weu_resource_group.name

  environment = {
    prefix    = local.prefix
    domain    = local.domain
    env_short = local.env_short
    location  = module.weu_resource_group.location
  }

  virtual_network = data.azurerm_virtual_network.vnet_common
  subnet_pep_id   = data.azurerm_subnet.pendpoints.id

  tags = local.tags
}
