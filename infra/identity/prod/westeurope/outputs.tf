output "managed_identity_github_ci" {
  value = {
    name                = module.managed_identities.github_identity_ci.name
    resource_group_name = module.managed_identities.github_identity_ci.resource_group_name
  }
}

output "managed_identity_github_cd_name" {
  value = {
    name                = module.managed_identities.github_identity_ci.name
    resource_group_name = module.managed_identities.github_identity_ci.resource_group_name
  }
}
