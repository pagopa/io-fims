module "networking" {
  source = "../_modules/networking"

  location = local.location
  project  = local.project

  subnet_fims_cidr = "10.0.18.0/26" # inferred from vnet-common with cidr 10.0.0.0/16

  tags = local.tags
}
