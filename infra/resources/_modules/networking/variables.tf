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

variable "subnet_fims_cidr" {
  type = string
}
