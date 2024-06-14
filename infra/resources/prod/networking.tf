module "networking" {
  source = "../_modules/networking"

  location = local.location
  project  = local.project

  # inferred from vnet-common with cidr 10.0.0.0/16
  # https://github.com/pagopa/io-infra/blob/2a74355cdf70bf965b0c8900983bfc923c83ebfb/src/core/network.tf#L8
  subnet_fims_cidr = "10.0.18.0/26"

  tags = local.tags
}
