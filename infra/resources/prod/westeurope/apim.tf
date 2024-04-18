module "apim" {
  source = "../_modules/apim"

  location = module.resource_groups.resource_group_fims.location
  project  = local.project

  app_service_oicd_provider_hostname = module.web_apps.app_service_opendid_provider.hostname
}
