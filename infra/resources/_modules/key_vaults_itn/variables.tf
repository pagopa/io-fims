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

variable "prefix" {
  type = string
}

variable "env_short" {
  type = string
}
