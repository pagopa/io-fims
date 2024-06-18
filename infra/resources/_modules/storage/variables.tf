variable "project" {
  type = string
}

variable "resource_group_name" {
  type = string
}

variable "location" {
  type        = string
  description = "Azure region"
}

variable "tags" {
  type = map(any)
}

variable "virtual_network" {
  type = object({
    name                = string
    resource_group_name = string
  })
}

variable "subnet_pep_id" {
  type = string
}
