locals {
  rp_example = {
    common_app_settings = {}
  }
}

module "rp_example" {
  source = "git::https://github.com/pagopa/dx.git//infra/modules/azure_app_service_exposed?ref=fix-app-service-exposed"

  environment = merge(var.environment, {
    app_name        = "rp-example",
    instance_number = "02"
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

  tags = var.tags
}
