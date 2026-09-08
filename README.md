# ShopCloud — High Availability AWS E-Commerce Project

Full-stack online shopping project designed for AWS CloudFormation deployment.

## Application stack
- React + TypeScript + Vite
- Node.js + Express
- MySQL-compatible RDS
- Redis-compatible ElastiCache
- Docker

## AWS architecture
- VPC across 2 Availability Zones
- Public and private subnets
- Internet Gateway
- NAT Gateways
- Public Application Load Balancer
- EC2 Auto Scaling Group in private application subnets
- Amazon RDS MySQL Multi-AZ in private database subnets
- ElastiCache Redis replication group across AZs in private subnets
- AWS Secrets Manager for database credentials
- CloudWatch logs and alarms
- S3 for the React frontend
- CloudFront distribution
- ECR for backend container images
- CloudFormation infrastructure as code

## Important security design

RDS and ElastiCache are AWS resources, but they are deliberately NOT public.

The backend EC2 instances reach:
- RDS on TCP 3306
- Redis on TCP 6379

using VPC networking and security groups.

Internet users reach the application through CloudFront and the public ALB, not directly through RDS or Redis.

## Database

The backend uses MySQL through `mysql2`.

Tables:
- products
- orders
- order_items

On startup the backend creates the tables if they do not already exist and seeds demo products.

## Local development

### Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

For local MySQL/Redis, edit `.env`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite proxies `/api` to `http://localhost:5000`.

## Docker

```bash
docker compose up --build
```

This starts:
- MySQL
- Redis
- backend
- frontend

Open `http://localhost`.

## AWS deployment order

1. Create an ECR repository and push the backend image.
2. Deploy `infrastructure/01-network.yaml`.
3. Deploy `infrastructure/02-data.yaml` for Secrets Manager, RDS and ElastiCache.
4. Deploy `infrastructure/03-compute.yaml` for ALB, EC2 Auto Scaling and CloudWatch.
5. Build the frontend with the API URL and upload `frontend/dist` to S3.
6. Deploy `infrastructure/04-cloudfront.yaml`.
7. Later add Route 53 and ACM for a custom HTTPS domain.

The templates are separated so failures are easier to understand than with one very large stack.

## Portfolio upgrades

After the core deployment works:
- Cognito authentication
- Admin product management
- S3 product images
- Stripe sandbox payments
- Route 53 + ACM custom domain
- WAF
- CloudWatch dashboards
- GitHub Actions deployment
- Blue/green or rolling deployments
