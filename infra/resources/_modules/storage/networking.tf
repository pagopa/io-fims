resource "azurerm_private_endpoint" "queue" {
  name                = format("%s-queue-endpoint", module.storage_account_fims.name)
  location            = var.location
  resource_group_name = var.resource_group_name
  subnet_id           = var.subnet_pep_id

  private_service_connection {
    name                           = format("%s-queue", module.storage_account_fims.name)
    private_connection_resource_id = module.storage_account_fims.id
    is_manual_connection           = false
    subresource_names              = ["queue"]
  }

  private_dns_zone_group {
    name                 = "private-dns-zone-group"
    private_dns_zone_ids = [data.azurerm_private_dns_zone.privatelink_queue_core_windows_net.id]
  }

  tags = var.tags
}
