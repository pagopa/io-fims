resource "azurerm_redis_cache" "fims" {
  name                          = "${local.project}-redis-01"
  location                      = var.environment.location
  resource_group_name           = var.resource_group_name
  capacity                      = 2
  family                        = "C"
  sku_name                      = "Basic"
  enable_non_ssl_port           = false
  minimum_tls_version           = "1.2"
  public_network_access_enabled = false


  identity {
    type = "SystemAssigned"
  }

  redis_configuration {
    enable_authentication                   = true
    active_directory_authentication_enabled = true
  }

  tags = var.tags
}

