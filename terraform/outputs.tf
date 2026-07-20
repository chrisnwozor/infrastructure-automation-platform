output "vpc_id" {
  description = "ID of the created VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_id" {
  description = "ID of the public subnet"
  value       = aws_subnet.public.id
}

output "security_group_id" {
  description = "ID of the API security group"
  value       = aws_security_group.api.id
}

output "ec2_instance_id" {
  description = "ID of the API EC2 instance"
  value       = aws_instance.api.id
}

output "elastic_ip" {
  description = "Static public IP of the API server"
  value       = aws_eip.api.public_ip
}

output "health_endpoint" {
  description = "API health-check URL"
  value       = "http://${aws_eip.api.public_ip}/api/v1/health"
}