variable "location" {
  type        = string
  description = "Azure region"
}

variable "tags" {
  type = map(any)
}

variable "common_project" {
  type = string
}

variable "subnet_fims_cidr" {
  type = string
}
