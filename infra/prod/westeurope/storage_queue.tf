module "storage_queue" {
  source = "../_modules/storage_queue"

  prefix    = local.prefix
  env_short = local.env_short
  domain    = local.domain
}
