<!-- markdownlint-disable -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_azuread"></a> [azuread](#requirement\_azuread) | <= 2.47.0 |
| <a name="requirement_azurerm"></a> [azurerm](#requirement\_azurerm) | <= 3.112.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_azurerm"></a> [azurerm](#provider\_azurerm) | 3.112.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_cosmos"></a> [cosmos](#module\_cosmos) | ../_modules/cosmos | n/a |
| <a name="module_itn_resource_group"></a> [itn\_resource\_group](#module\_itn\_resource\_group) | ../_modules/resource_group | n/a |
| <a name="module_key_vaults"></a> [key\_vaults](#module\_key\_vaults) | ../_modules/key_vaults | n/a |
| <a name="module_redis_cache"></a> [redis\_cache](#module\_redis\_cache) | ../_modules/redis_cache | n/a |
| <a name="module_storage"></a> [storage](#module\_storage) | ../_modules/storage | n/a |
| <a name="module_web_apps"></a> [web\_apps](#module\_web\_apps) | ../_modules/web_apps | n/a |
| <a name="module_web_apps_itn"></a> [web\_apps\_itn](#module\_web\_apps\_itn) | ../_modules/web_apps_itn | n/a |
| <a name="module_weu_resource_group"></a> [weu\_resource\_group](#module\_weu\_resource\_group) | ../_modules/resource_group | n/a |

## Resources

| Name | Type |
|------|------|
| [azurerm_resource_group.fims](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group) | resource |
| [azurerm_application_insights.common](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/application_insights) | data source |
| [azurerm_nat_gateway.itn](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/nat_gateway) | data source |
| [azurerm_nat_gateway.nat_gateway](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/nat_gateway) | data source |
| [azurerm_subnet.itn_pep](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/subnet) | data source |
| [azurerm_subnet.pendpoints](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/subnet) | data source |
| [azurerm_virtual_network.itn_common](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/virtual_network) | data source |
| [azurerm_virtual_network.vnet_common](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/virtual_network) | data source |

## Inputs

No inputs.

## Outputs

No outputs.
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
