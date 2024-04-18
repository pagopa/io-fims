output "subnet_fims" {
  value = {
    id   = module.fims_snet.id
    name = module.fims_snet.name
  }
}

output "subnet_private_endpoints" {
  value = {
    id   = data.azurerm_subnet.private_endpoints_subnet.id
    name = data.azurerm_subnet.private_endpoints_subnet.name
  }
}

output "dns_zone_privatelink_queue_core_windows_net" {
  value = {
    id = data.azurerm_private_dns_zone.privatelink_queue_core_windows_net.id
  }
}
