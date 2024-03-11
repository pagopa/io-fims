module "resource_groups" {
  source = "../_modules/resource_groups"

  location = local.location
  product  = local.product

  tags = local.tags
}
