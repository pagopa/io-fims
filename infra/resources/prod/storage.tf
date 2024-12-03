module "storage" {
  source = "../_modules/storage"

  location                   = azurerm_resource_group.fims.location
  project                    = local.project_legacy
  resource_group_name        = module.itn_resource_group.name
  resource_group_name_legacy = azurerm_resource_group.fims.name

  virtual_network = data.azurerm_virtual_network.vnet_common
  subnet_pep_id   = data.azurerm_subnet.pendpoints.id

  environment = {
    prefix    = local.prefix
    env_short = local.env_short
    location  = local.location
    domain    = local.domain
  }

  tags = local.tags
}
