output "fims" {
  value = {
    id         = azurerm_redis_cache.fims.id
    name       = azurerm_redis_cache.fims.name
    url        = "rediss://${azurerm_redis_cache.fims.hostname}:${azurerm_redis_cache.fims.ssl_port}"
    access_key = azurerm_redis_cache.fims.primary_access_key
  }
}
