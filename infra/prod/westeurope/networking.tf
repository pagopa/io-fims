module "networking" {
  source = "../_modules/networking"

  location = local.location
  project  = local.project

  subnet_fims_cidr = "10.0.18.0/26"

  tags = local.tags
}
