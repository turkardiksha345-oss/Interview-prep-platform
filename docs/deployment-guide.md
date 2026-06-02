# Deployment Guide

## Prerequisites

- Docker and Docker Compose
- Node.js 22 for local frontend development
- Python 3.12 for local backend development
- AWS account with IAM permissions for EKS, RDS, S3, IAM, VPC, and CloudWatch
- Terraform 1.7+
- kubectl and awscli
- ArgoCD installed in the target EKS cluster
- GitHub repository with GHCR package permissions

## Local Development

```bash
docker compose -f infra/docker/docker-compose.yml up --build
```

The stack starts PostgreSQL, FastAPI, and React/Nginx. Seed questions and roadmaps are loaded from `database/schema.sql`.

## EC2 Basic Docker Test

Use this before moving to EKS if you want a simple server smoke test.

1. Launch an EC2 instance with Docker and the Docker Compose plugin installed.
2. Allow inbound TCP `80` in the EC2 security group.
3. Clone this repository on the instance.
4. Create an environment file:

```bash
cp infra/docker/ec2.env.example infra/docker/.env
```

5. Edit `infra/docker/.env`:

```env
POSTGRES_PASSWORD=replace-with-a-strong-db-password
JWT_SECRET=replace-with-a-long-random-secret
```

6. Start the stack:

```bash
docker compose --env-file infra/docker/.env -f infra/docker/docker-compose.ec2.yml up --build -d
```

7. Visit `http://YOUR_EC2_PUBLIC_IP`.

The frontend uses same-origin `/api/v1` calls, and Nginx proxies `/api/` to the backend container. You do not need to expose backend port `8000` publicly.

## AWS Infrastructure

1. Configure AWS credentials.

```bash
aws configure
```

2. Create a Terraform variables file.

```hcl
db_password = "replace-with-strong-password"
```

3. Apply infrastructure.

```bash
cd infra/terraform/envs/prod
terraform init
terraform plan -var-file=prod.tfvars
terraform apply -var-file=prod.tfvars
```

4. Configure kubectl.

```bash
aws eks update-kubeconfig --region us-east-1 --name interview-prep-eks
```

## Kubernetes Secrets

Create a production secret from AWS RDS output values. Prefer External Secrets Operator or AWS Secrets Manager in production.

```bash
kubectl create namespace interview-prep
kubectl create secret generic interview-prep-secrets \
  -n interview-prep \
  --from-literal=DATABASE_URL='postgresql+psycopg://app:<password>@<rds-endpoint>:5432/interviewprep' \
  --from-literal=JWT_SECRET='<long-random-secret>'
```

## GitHub Actions

The workflow in `.github/workflows/ci-cd.yml` runs backend tests, builds the frontend, and pushes Docker images to GHCR on pushes to `main`.

Update Kubernetes image references in `infra/k8s/overlays/prod/kustomization.yaml` with your org and release tags.

## ArgoCD GitOps

1. Update `infra/argocd/application.yaml` with your repository URL.
2. Apply the ArgoCD app:

```bash
kubectl apply -f infra/argocd/application.yaml
```

ArgoCD will sync manifests from `infra/k8s/overlays/prod`.

## Monitoring

- Install Prometheus Operator or kube-prometheus-stack.
- Apply `infra/monitoring/prometheus-servicemonitor.yaml`.
- Import `infra/monitoring/grafana-dashboard.json` into Grafana.
- Add `/metrics` instrumentation to the FastAPI service before relying on the provided dashboard in production.

## Production Hardening Checklist

- Use AWS Secrets Manager with External Secrets Operator.
- Put EKS nodes in private subnets with managed ingress through AWS Load Balancer Controller.
- Configure ACM TLS certificates and Route 53 DNS.
- Add Alembic migrations instead of runtime schema creation.
- Add a real code execution sandbox such as Judge0, Firecracker, or isolated Kubernetes jobs.
- Add email delivery through SES.
- Add rate limiting, audit logging, WAF rules, and backup restore drills.
- Replace placeholder AI scoring with a governed LLM provider integration and abuse controls.
