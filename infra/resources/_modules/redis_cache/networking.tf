resource "azurerm_private_endpoint" "fims" {
  name                = "${azurerm_redis_cache.fims.name}-pep-01"
  location            = var.environment.location
  resource_group_name = var.resource_group_name
  subnet_id           = var.subnet_pep_id

  private_service_connection {
    name                           = "${azurerm_redis_cache.fims.name}-pep-01"
    private_connection_resource_id = azurerm_redis_cache.fims.id
    is_manual_connection           = false
    subresource_names              = ["redisCache"]
  }

  private_dns_zone_group {
    name                 = "private-dns-zone-group"
    private_dns_zone_ids = [data.azurerm_private_dns_zone.privatelink_redis_cache_windows_net.id]
  }

  tags = var.tags
}
