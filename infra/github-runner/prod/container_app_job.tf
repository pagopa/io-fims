module "container_app_job_selfhosted_runner" {
  source  = "pagopa-dx/github-selfhosted-runner-on-container-app-jobs/azurerm"
  version = "~> 0.0"

  prefix    = local.prefix
  env_short = local.env_short

  repo_name = "io-fims"

  container_app_environment = {
    name                = "${local.prefix}-${local.env_short}-github-runner-cae"
    resource_group_name = "${local.prefix}-${local.env_short}-github-runner-rg"
  }

  key_vault = {
    name                = "${local.prefix}-${local.env_short}-kv-common"
    resource_group_name = "${local.prefix}-${local.env_short}-rg-common"
  }

  tags = local.tags
}
