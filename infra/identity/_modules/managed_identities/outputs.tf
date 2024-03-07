output "github_identity_ci" {
  value = {
    name                = module.managed_identity_ci.identity_app_name
    resource_group_name = module.managed_identity_ci.identity_resource_group
  }
}

output "github_identity_cd" {
  value = {
    name                = module.managed_identity_cd.identity_app_name
    resource_group_name = module.managed_identity_cd.identity_resource_group
  }
}
