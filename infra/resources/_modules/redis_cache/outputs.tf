output "fims" {
  value = {
    id           = azurerm_redis_cache.fims.id
    hostname     = azurerm_redis_cache.fims.hostname
    principal_id = azurerm_redis_cache.fims.identity[0].principal_id
  }
}
