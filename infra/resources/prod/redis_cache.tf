
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


resource "azurerm_redis_cache" "fims_redis_itn" {

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

  capacity            = 2
  family              = "C"
  sku_name            = "Basic"
  minimum_tls_version = "1.2"

  identity {
    type = "SystemAssigned"
  }

  redis_configuration {
    active_directory_authentication_enabled = true
  }

  tags = local.tags
}

resource "azurerm_private_endpoint" "fims_redis_pep_itn" {

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
    name                 = "${azurerm_redis_cache.fims_redis_itn.name}-private-dns-zone-group"
    private_dns_zone_ids = [data.azurerm_private_dns_zone.privatelink_redis_cache.id]
  }

  private_service_connection {
    name                           = "${azurerm_redis_cache.fims_redis_itn.name}-private-service-connection"
    private_connection_resource_id = azurerm_redis_cache.fims_redis_itn.id
    is_manual_connection           = false
    subresource_names              = ["redisCache"]
  }

  tags = local.tags
}

