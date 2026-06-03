# Interview Preparation Platform

Production-oriented three-tier interview preparation platform built with React, FastAPI, PostgreSQL, Docker, Kubernetes, Terraform, GitHub Actions, ArgoCD, Prometheus, and Grafana.

## Tiers

- Frontend: React + Vite served by Nginx
- Backend: FastAPI REST API with JWT authentication
- Database: PostgreSQL on local Docker or AWS RDS

## Local Quick Start

```bash
docker compose -f infra/docker/docker-compose.yml up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8000/api/v1/health
- Code Evaluator: http://localhost:9000/health
- OpenAPI: http://localhost:8000/docs

See `docs/deployment-guide.md` for AWS, EKS, Terraform, GitHub Actions, and ArgoCD deployment.

## App Flow

1. Create an account or login from `/login`.
2. Open Practice and submit a coding solution.
3. The backend sends the submission to the `code-evaluator` microservice.
4. Open Scorecard to review average score, best score, accuracy, feedback, and recommendations.

If you already started Docker before this scorecard update, recreate the database volume so PostgreSQL picks up the new `feedback` column:

```bash
docker compose -f infra/docker/docker-compose.yml down -v
docker compose -f infra/docker/docker-compose.yml up --build
```

## Frontend Editor Setup

If VS Code shows red errors for imports such as `lucide-react`, `react-router-dom`, JSX tags, or `import.meta.env`, install the frontend dependencies:

```bash
cd frontend
npm install
```

If `npm` is not recognized, install Node.js 22 LTS first, then reopen VS Code.

## EC2 Basic Docker Test

On an EC2 instance with Docker installed, open inbound port `80` in the security group and run:

```bash
cp infra/docker/ec2.env.example infra/docker/.env
# edit infra/docker/.env and set strong secrets
docker compose --env-file infra/docker/.env -f infra/docker/docker-compose.ec2.yml up --build -d
```

Then open:

```text
http://YOUR_EC2_PUBLIC_IP
```
