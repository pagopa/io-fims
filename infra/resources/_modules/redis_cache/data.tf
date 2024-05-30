data "azurerm_private_dns_zone" "privatelink_redis_cache_windows_net" {
  name                = "privatelink.redis.cache.windows.net"
  resource_group_name = var.virtual_network.resource_group_name
}

