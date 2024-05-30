locals {
  rp_example = {
    common_app_settings = {}
  }
}

module "rp_example" {
  source = "git::https://github.com/pagopa/dx.git//infra/modules/azure_app_service?ref=9f553b47f614fa9be4631a81e6f8ca1558b6ae56"

  environment = merge(var.environment, {
    app_name        = "rp-example",
    instance_number = "01"
  })

  tier = "test"

  resource_group_name = var.resource_group_name

  health_check_path = "/health"

  app_settings = merge(local.rp_example.common_app_settings, {
    NODE_ENVIRONMENT = "production"
  })

  slot_app_settings = merge(local.rp_example.common_app_settings, {
    NODE_ENVIRONMENT = "staging"
  })

  sticky_app_setting_names = ["NODE_ENVIRONMENT"]

  virtual_network = var.virtual_network

  subnet_cidr   = var.subnet_cidrs.rp_example
  subnet_pep_id = var.subnet_pep_id

  tags = var.tags
}
