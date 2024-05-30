variable "resource_group_name" {
  type = string
}

variable "environment" {
  type = object({
    prefix    = string
    env_short = string
    location  = string
    domain    = string
  })
  description = "Values which are used to generate resource names and location short names."
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


