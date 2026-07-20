variable "aws_region" {
  description = "AWS region where infrastructure will be created"
  type        = string
  default     = "us-east-2"
}

variable "project_name" {
  description = "Name used to identify project resources"
  type        = string
  default     = "infrastructure-automation-platform"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "development"
}

variable "vpc_cidr" {
  description = "IP address range for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "IP address range for the public subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "instance_type" {
  description = "EC2 instance size"
  type        = string
  default     = "t3.micro"
}

variable "key_name" {
  description = "Existing AWS EC2 key-pair name"
  type        = string
}

variable "allowed_ssh_cidr" {
  description = "IP address allowed to connect through SSH"
  type        = string
}