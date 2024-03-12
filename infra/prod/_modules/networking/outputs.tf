output "subnet_fims" {
  value = {
    id   = module.fims_snet.id
    name = module.fims_snet.name
  }
}
