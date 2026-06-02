module "eks" {
  source       = "../../modules/eks"
  project_name = var.project_name
  aws_region   = var.aws_region
}

module "rds" {
  source             = "../../modules/rds"
  project_name       = var.project_name
  db_username        = var.db_username
  db_password        = var.db_password
  vpc_id             = module.eks.vpc_id
  subnet_ids         = module.eks.private_subnet_ids
  allowed_cidr_block = module.eks.vpc_cidr_block
}

module "s3" {
  source       = "../../modules/s3"
  project_name = var.project_name
}
