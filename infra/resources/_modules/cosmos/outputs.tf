output "fims_itn" {
  value = {
    name                = module.azure-cosmos-account.name
    resource_group_name = var.itn_resource_group_name
  }
}
