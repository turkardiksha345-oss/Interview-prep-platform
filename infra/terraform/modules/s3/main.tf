resource "aws_s3_bucket" "resume_assets" {
  bucket = "${var.project_name}-resume-assets"
}

resource "aws_s3_bucket_public_access_block" "resume_assets" {
  bucket                  = aws_s3_bucket.resume_assets.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "resume_assets" {
  bucket = aws_s3_bucket.resume_assets.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
