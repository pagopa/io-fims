module "storage" {
  source = "../_modules/storage"

  location            = module.resource_groups.resource_group_fims.location
  product             = local.product
  resource_group_name = module.resource_groups.resource_group_fims.name

  private_endpoints_subnet_id = module.networking.subnet_private_endpoints.id

  private_dns_zones = {
    privatelink_queue_core_windows_net = {
      id = module.networking.dns_zone_privatelink_queue_core_windows_net.id
    }
  }

  tags = local.tags
}
