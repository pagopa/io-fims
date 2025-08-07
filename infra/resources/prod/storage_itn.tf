module "storage_itn" {
  source = "../_modules/storage_itn"

  location            = module.itn_resource_group.location
  project             = local.project
  resource_group_name = module.itn_resource_group.name

  subnet_pep_id = data.azurerm_subnet.itn_pep.id

  environment = {
    prefix    = local.prefix
    env_short = local.env_short
    location  = module.itn_resource_group.location
    domain    = local.domain
  }

  tags = local.tags
}
