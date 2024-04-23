output "resource_group_fims" {
  value = {
    id   = module.resource_groups.resource_group_fims.id
    name = module.resource_groups.resource_group_fims.name
  }
}

output "cosmos_fims" {
  value = {
    account = {
      id   = module.cosmos.cosmos_fims.account.id
      name = module.cosmos.cosmos_fims.account.name
    }
    database = {
      id   = module.cosmos.cosmos_fims.database.id
      name = module.cosmos.cosmos_fims.database.name
    }
  }
}

output "app_service_openid_provider" {
  value = {
    id   = module.web_apps.app_service_opendid_provider.id
    name = module.web_apps.app_service_opendid_provider.name
  }
}

output "apim" {
  value = {
    id   = module.apim.apim.id
    name = module.apim.apim.name
  }
}
