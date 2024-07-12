resource "azurerm_private_endpoint" "rp_func" {
  name                = "${var.project_legacy}-rp-func-endpoint"
  location            = var.environment.location
  resource_group_name = var.resource_group_name_legacy
  subnet_id           = var.subnet_pep_id

  private_service_connection {
    name                           = "${var.project_legacy}-rp-func-endpoint"
    private_connection_resource_id = module.relying_party_func.id
    is_manual_connection           = false
    subresource_names              = ["sites"]
  }

  private_dns_zone_group {
    name                 = "private-dns-zone-group"
    private_dns_zone_ids = [data.azurerm_private_dns_zone.privatelink_azurewebsites_net.id]
  }

  tags = var.tags
}
