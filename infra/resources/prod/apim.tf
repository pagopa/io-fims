module "apim" {
  prefix    = local.prefix
  env_short = local.env_short
  key_vault = module.key_vaults_itn.fims

  source = "../_modules/apim"
}
