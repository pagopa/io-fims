output "managed_identity_github_ci" {
  value = {
    name                = module.managed_identities.github_identity_ci.name
    resource_group_name = module.managed_identities.github_identity_ci.resource_group_name
  }
}

output "managed_identity_github_cd" {
  value = {
    name                = module.managed_identities.github_identity_cd.name
    resource_group_name = module.managed_identities.github_identity_cd.resource_group_name
  }
}
