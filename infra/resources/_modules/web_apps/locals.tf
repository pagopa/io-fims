locals {
  common_project             = "${var.environment.prefix}-${var.environment.env_short}"
  resource_group_name_common = "${local.common_project}-rg-common"
}
