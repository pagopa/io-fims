module "apim" {
  source = "../_modules/apim"

  location = module.resource_groups.resource_group_fims.location
  project  = local.project

  app_service_oicd_provider_hostname = module.app_services.app_service_opendid_provider.hostname
}
