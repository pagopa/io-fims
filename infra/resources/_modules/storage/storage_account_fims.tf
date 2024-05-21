module "storage_account_fims" {
  source = "github.com/pagopa/terraform-azurerm-v3//storage_account?ref=v8.13.0"

  name                          = replace("${var.product}st", "-", "")
  account_kind                  = "StorageV2"
  account_tier                  = "Standard"
  access_tier                   = "Hot"
  account_replication_type      = "ZRS"
  resource_group_name           = var.resource_group_name
  location                      = var.location
  advanced_threat_protection    = true
  public_network_access_enabled = false

  tags = var.tags
}

resource "azurerm_private_endpoint" "queue" {
  name                = format("%s-queue-endpoint", module.storage_account_fims.name)
  location            = var.location
  resource_group_name = var.resource_group_name
  subnet_id           = var.private_endpoints_subnet_id

  private_service_connection {
    name                           = format("%s-queue", module.storage_account_fims.name)
    private_connection_resource_id = module.storage_account_fims.id
    is_manual_connection           = false
    subresource_names              = ["queue"]
  }

  private_dns_zone_group {
    name                 = "private-dns-zone-group"
    private_dns_zone_ids = [var.private_dns_zones.privatelink_queue_core_windows_net.id]
  }

  tags = var.tags
}
