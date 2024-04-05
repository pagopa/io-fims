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

variable "prefix" {
  type = string
}

variable "env_short" {
  type        = string
  description = "Short environment"
}

variable "domain" {
  type        = string
  description = "IO domain name"
}
