module "apim" {
  prefix    = local.prefix
  env_short = local.env_short

  source = "../_modules/apim"
}
