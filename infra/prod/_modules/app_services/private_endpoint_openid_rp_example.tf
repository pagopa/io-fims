resource "azurerm_private_endpoint" "openid_rp_example" {
  name                = "${var.product}-openid-rp-example-app-endpoint"
  location            = var.location
  resource_group_name = var.resource_group_name
  subnet_id           = data.azurerm_subnet.private_endpoints_subnet.id

  private_service_connection {
    name                           = "${var.product}-openid-rp-example-app-endpoint"
    private_connection_resource_id = module.appservice_openid_rp_example.id
    is_manual_connection           = false
    subresource_names              = ["sites"]
  }

  private_dns_zone_group {
    name                 = "private-dns-zone-group"
    private_dns_zone_ids = [data.azurerm_private_dns_zone.privatelink_azurewebsites_net.id]
  }

  tags = var.tags
}
