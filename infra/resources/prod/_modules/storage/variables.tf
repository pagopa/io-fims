variable "product" {
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

variable "private_endpoints_subnet_id" {
  type = string
}

variable "private_dns_zones" {
  type = object({
    privatelink_queue_core_windows_net = object({
      id = string
    })
  })
}
