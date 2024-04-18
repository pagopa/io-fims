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
