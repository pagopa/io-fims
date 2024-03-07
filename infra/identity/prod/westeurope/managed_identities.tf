module "managed_identities" {
  source = "../../_modules/managed_identities"

  env_short = local.env_short
  domain    = local.domain
  prefix    = local.prefix

  tags = local.tags
}
