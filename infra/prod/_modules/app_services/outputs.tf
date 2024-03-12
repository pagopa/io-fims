output "app_service_plan_oidc_provider_common" {
  value = {
    id                  = module.appservice_fims.plan_id
    name                = module.appservice_fims.plan_name
    resource_group_name = module.appservice_fims.resource_group_name
  }
}

output "app_service_oidc_provider_common" {
  value = {
    id                  = module.appservice_fims.id
    name                = module.appservice_fims.name
    resource_group_name = module.appservice_fims.resource_group_name
  }
}
