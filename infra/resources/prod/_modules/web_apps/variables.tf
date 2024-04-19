variable "location" {
  type        = string
  description = "Azure region"
}

variable "tags" {
  type = map(any)
}

variable "project" {
  type = string
}

variable "product" {
  type = string
}

variable "resource_group_name" {
  type = string
}

variable "subnet_id" {
  type = string
}

variable "cosmos_db" {
  type = object({
    endpoint    = string
    primary_key = string
  })

  sensitive = true
}

variable "key_vault_id" {
  type = string
}

variable "rp_func" {
  type = object({
    autoscale_default = number
    autoscale_minimum = number
    autoscale_maximum = number
    app_settings = list(object({
      name                  = string
      value                 = optional(string, "")
      key_vault_secret_name = optional(string)
    }))
  })
  description = "Configuration of the rp-func"
}

variable "op_func" {
  type = object({
    autoscale_default = number
    autoscale_minimum = number
    autoscale_maximum = number
    app_settings = list(object({
      name                  = string
      value                 = optional(string, "")
      key_vault_secret_name = optional(string)
    }))
  })
  description = "Configuration of the op-func"
}
