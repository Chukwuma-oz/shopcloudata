# ShopCloud — High-Availability AWS E-Commerce Platform

ShopCloud is a full-stack e-commerce application deployed on AWS using a highly available and scalable cloud architecture.

The project demonstrates how to deploy a containerized Node.js backend and React frontend using AWS services including EC2, Auto Scaling, Application Load Balancer, RDS MySQL, ElastiCache Redis, S3, CloudFront, ECR, Secrets Manager, and CloudFormation.

---

## 🚀 Live Demo

**ShopCloud:**  
https://YOUR-CLOUDFRONT-DOMAIN

> The application is delivered through Amazon CloudFront and communicates with the backend through an Application Load Balancer.

---

## 🏗️ Architecture

```text
                         Internet
                            │
                            ▼
                    ┌───────────────┐
                    │  CloudFront   │
                    └───────┬───────┘
                            │
               ┌────────────┴────────────┐
               │                         │
               ▼                         ▼
        ┌─────────────┐          ┌─────────────┐
        │      S3     │          │     ALB     │
        │   Frontend  │          │  HTTP :80   │
        └─────────────┘          └──────┬──────┘
                                        │
                              ┌─────────┴─────────┐
                              │                   │
                              ▼                   ▼
                         ┌─────────┐         ┌─────────┐
                         │  EC2    │         │  EC2    │
                         │  App    │         │  App    │
                         └────┬────┘         └────┬────┘
                              │                   │
                    ┌─────────┴───────────────────┴─────────┐
                    │                                       │
                    ▼                                       ▼
             ┌──────────────┐                       ┌──────────────┐
             │  RDS MySQL   │                       │ ElastiCache  │
             │   Multi-AZ   │                       │    Redis     │
             └──────────────┘                       └──────────────┘

                     AWS Secrets Manager
                              │
                              ▼
                       Database Credentials

🛠️ Technology Stack
Frontend
React
TypeScript
Vite
Backend
Node.js
Express
MySQL2
Redis
REST API
Containers
Docker
Docker Compose
Amazon ECR
AWS
Amazon VPC
EC2
Application Load Balancer
Auto Scaling
Amazon RDS MySQL
Amazon ElastiCache Redis
Amazon S3
Amazon CloudFront
AWS Secrets Manager
Amazon CloudWatch
AWS CloudFormation
CI
GitHub Actions
Git
GitHub
☁️ AWS Infrastructure

The infrastructure is deployed across multiple Availability Zones.

Network
1 VPC
2 Availability Zones
Public subnets
Private application subnets
Private database subnets
Internet Gateway
NAT Gateways
Route tables
Compute
EC2 instances running in private application subnets
Application Load Balancer
EC2 Auto Scaling Group
Minimum of 2 application instances
Automatic health checks
Rolling instance refresh
CloudWatch CPU monitoring
Database

Amazon RDS MySQL is deployed as a Multi-AZ database in private database subnets.

The application stores:

Products
Orders
Order items

Database credentials are stored in AWS Secrets Manager rather than hard-coded in the application.

Caching

Amazon ElastiCache for Redis provides application caching and is deployed with replication and automatic failover.

Redis traffic is restricted to the application security group.

Frontend

The React frontend is hosted in Amazon S3 and distributed globally through Amazon CloudFront.

CloudFront also routes /api/* requests to the Application Load Balancer.

🔐 Security Design

Security groups are used to restrict communication between application layers.

Internet
   │
   ▼
ALB Security Group
   │
   ▼
Application Security Group
   │
   ├── TCP 3306 ──► RDS
   │
   └── TCP 6379 ──► Redis

RDS and Redis are not publicly accessible.

The EC2 application instances communicate with these services through private VPC networking.

Database credentials are retrieved from AWS Secrets Manager during application startup.

📦 Database

The backend uses MySQL through the mysql2 package.

The application creates the required tables during startup if they do not already exist.

Current tables:

products
orders
order_items

Demo products are automatically seeded into the database.

⚡ Redis Caching

Redis is used as the application's caching layer.

The backend connects to ElastiCache Redis using TLS when deployed in AWS.

This reduces unnecessary database queries and demonstrates the use of a distributed cache in a scalable application architecture.

🔌 API
Health Check
GET /api/health

Example response:

{
  "status": "ok",
  "service": "shopcloud-api",
  "database": "mysql",
  "cache": "redis"
}
Products
GET /api/products

Returns the products available in the ShopCloud database.

🐳 Docker

The backend is containerized and published to Amazon ECR.

Run the complete application locally with:

docker compose up --build

This starts:

MySQL
Redis
Backend API
Frontend

The local application is available at:

http://localhost
💻 Local Development
Backend
cd backend
npm install
npm run dev

For local development, create an environment file from the example:

copy .env.example .env

Then configure the local MySQL and Redis connection values.

Frontend
cd frontend
npm install
npm run dev

The Vite development server proxies /api requests to the backend.

🚀 AWS Deployment

The AWS infrastructure is separated into four CloudFormation templates.

1. Network
infrastructure/01-network.yaml

Creates:

VPC
Availability Zones
Public subnets
Private application subnets
Private database subnets
NAT Gateways
Route tables
2. Data
infrastructure/02-data.yaml

Creates:

RDS MySQL
ElastiCache Redis
Database security groups
Redis security groups
Secrets Manager database secret
3. Compute
infrastructure/03-compute.yaml

Creates:

Application Load Balancer
EC2 Launch Template
EC2 Auto Scaling Group
Application security groups
Target Group
CloudWatch alarms
4. CloudFront
infrastructure/04-cloudfront.yaml

Creates:

S3 frontend bucket
CloudFront distribution
Origin Access Control
CloudFront routing to S3 and ALB
🔄 CI Pipeline

GitHub Actions validates the application whenever changes are pushed to the repository.

The CI pipeline performs:

Checkout repository
Configure Node.js
Install backend dependencies
Validate backend syntax
Install frontend dependencies
Build the React frontend

This helps catch application problems before deployment.

📁 Project Structure
shopcloudata/
│
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── cache.js
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── infrastructure/
│   ├── 01-network.yaml
│   ├── 02-data.yaml
│   ├── 03-compute.yaml
│   └── 04-cloudfront.yaml
│
├── scripts/
│   └── build-and-push-ecr.sh
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── docker-compose.yml
├── .env.example
└── README.md
📊 High Availability

The application is designed to avoid relying on a single application server.

Key availability features include:

Multiple Availability Zones
EC2 Auto Scaling Group
Minimum of two application instances
Application Load Balancer
Health checks
Automatic replacement of unhealthy instances
RDS Multi-AZ
Redis replication
CloudFront distribution

This architecture allows the application layer to continue operating if an individual EC2 instance becomes unavailable.

🧪 Deployment Verification

The deployed application was verified using:

ALB health endpoint
ALB products endpoint
EC2 application health endpoint
RDS database connectivity
Redis connectivity
CloudFront frontend delivery
Auto Scaling instance refresh
GitHub Actions CI pipeline

Example health response:

{
  "status": "ok",
  "service": "shopcloud-api",
  "database": "mysql",
  "cache": "redis"
}
🎯 Skills Demonstrated

This project demonstrates practical experience with:

Full-stack web development
React and TypeScript
Node.js and Express
REST APIs
MySQL
Redis
Docker
AWS networking
VPC design
EC2
Auto Scaling
Application Load Balancer
RDS
ElastiCache
S3
CloudFront
ECR
Secrets Manager
CloudWatch
Infrastructure as Code
AWS CloudFormation
GitHub Actions
Git and GitHub
🔮 Future Improvements

Planned improvements include:

Amazon Cognito authentication
Admin product management
Product image storage in S3
Stripe sandbox payments
Route 53 custom domain
AWS Certificate Manager custom HTTPS certificate
AWS WAF
CloudWatch dashboards
Automated AWS deployment through GitHub Actions
Blue/green deployment strategy
👨‍💻 Project

ShopCloud

A practical full-stack AWS project built to demonstrate cloud architecture, infrastructure as code, containerization, high availability, security, caching, and CI workflows.


### After you paste it

**Don't push yet.** First replace:

```text
https://d1agq1lu49v0iq.cloudfront.net/                   