output "fims" {
  value = {
    id                  = module.key_vault.id
    name                = module.key_vault.name
    resource_group_name = module.key_vault.resource_group_name
  }
}
