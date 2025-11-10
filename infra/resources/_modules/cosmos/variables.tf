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

variable "common_project" {
  type = string
}

variable "resource_group_name" {
  type = string
}

variable "itn_resource_group_name" {
  type = string
}

variable "environment" {
  type = object({
    prefix          = string
    env_short       = string
    location        = string
    app_name        = string
    instance_number = string
  })
}

variable "com_admins_azuread_group" {
  type = object({
    object_id = string
  })
}

variable "com_devs_azuread_group" {
  type = object({
    object_id = string
  })
}
