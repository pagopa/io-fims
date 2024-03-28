output "app_service_plan_opendid_provider" {
  value = {
    id                  = module.appservice_openid_provider.plan_id
    name                = module.appservice_openid_provider.plan_name
    resource_group_name = module.appservice_openid_provider.resource_group_name
  }
}

output "app_service_opendid_provider" {
  value = {
    id                  = module.appservice_openid_provider.id
    name                = module.appservice_openid_provider.name
    resource_group_name = module.appservice_openid_provider.resource_group_name
    hostname            = module.appservice_openid_provider.default_site_hostname
    staging = {
      id                  = module.appservice_openid_provider_staging.id
      name                = module.appservice_openid_provider_staging.name
      resource_group_name = module.appservice_openid_provider.resource_group_name
    }
  }
}
