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
