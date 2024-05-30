module "resource_groups" {
  source = "../_modules/resource_groups"

  location       = local.location
  project        = local.project
  project_legacy = local.project_legacy

  tags = local.tags
}
