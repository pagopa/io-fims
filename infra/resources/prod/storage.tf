module "storage" {
  source = "../_modules/storage"

  location            = module.resource_groups.resource_group_fims_legacy.location
  project             = local.project_legacy
  resource_group_name = module.resource_groups.resource_group_fims_legacy.name

  subnet_pep_id = module.networking.subnet_pep.id

  virtual_network = module.networking.virtual_network

  tags = local.tags
}
