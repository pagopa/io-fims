###Italy North
locals {
  prefix    = "io"
  env_short = "p"
  app_name  = "fims"
  # domain          = "fims"
  instance_number = "01"
  itn_environment = {
    prefix    = local.prefix
    env_short = local.env_short
    app_name  = local.app_name
    location  = var.location
    # domain          = local.domain
    instance_number = local.instance_number
  }
}
