resource "azurerm_redis_cache" "fims_redis" {

  name = provider::dx::resource_name({
    prefix          = local.prefix
    name            = "fims",
    resource_type   = "redis_cache",
    environment     = local.env_short,
    location        = local.location
    instance_number = 1
  })

  resource_group_name = module.itn_resource_group.name
  location            = module.itn_resource_group.location

  public_network_access_enabled = false

  capacity            = 2
  family              = "C"
  sku_name            = "Standard"
  minimum_tls_version = "1.2"

  identity {
    type = "SystemAssigned"
  }

  redis_configuration {
    active_directory_authentication_enabled = true
  }

  tags = local.tags
}

resource "azurerm_private_endpoint" "fims_redis_pep" {

  name = provider::dx::resource_name({
    prefix          = local.prefix
    name            = "fims",
    resource_type   = "private_endpoint",
    environment     = local.env_short,
    location        = local.location
    instance_number = 1
  })

  resource_group_name = module.itn_resource_group.name
  location            = module.itn_resource_group.location
  subnet_id           = data.azurerm_subnet.itn_pep.id

  private_dns_zone_group {
    name                 = "${azurerm_redis_cache.fims_redis.name}-private-dns-zone-group"
    private_dns_zone_ids = [data.azurerm_private_dns_zone.privatelink_redis_cache.id]
  }

  private_service_connection {
    name                           = "${azurerm_redis_cache.fims_redis.name}-private-service-connection"
    private_connection_resource_id = azurerm_redis_cache.fims_redis.id
    is_manual_connection           = false
    subresource_names              = ["redisCache"]
  }

  tags = local.tags
}

