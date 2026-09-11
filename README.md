# ShopCloud

### High-Availability AWS E-Commerce Platform

ShopCloud is a full-stack e-commerce application deployed on Amazon Web Services (AWS).

The project demonstrates a production-style cloud architecture using containerized backend services, managed databases, caching, load balancing, auto scaling, CDN delivery, infrastructure as code, security controls, and continuous integration.

---

## 🚀 Live Demo

**Live Application:**  
https://d1agq1lu49v0iq.cloudfront.net/

The frontend is delivered through Amazon CloudFront, while API requests are routed to the backend through an Application Load Balancer.

---

## 🖥️ Application

ShopCloud provides an online shopping application with:

- Product listing
- Product data stored in MySQL
- REST API backend
- Redis caching
- React frontend
- Containerized backend
- Highly available AWS infrastructure

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | Node.js, Express |
| Database | Amazon RDS MySQL |
| Cache | Amazon ElastiCache Redis |
| Containers | Docker, Docker Compose |
| Container Registry | Amazon ECR |
| Infrastructure | AWS CloudFormation |
| Load Balancing | Application Load Balancer |
| Compute | Amazon EC2 |
| Scaling | EC2 Auto Scaling |
| Frontend Hosting | Amazon S3 |
| CDN | Amazon CloudFront |
| Secrets | AWS Secrets Manager |
| Monitoring | Amazon CloudWatch |
| CI | GitHub Actions |
| Version Control | Git, GitHub |

---

## ☁️ AWS Architecture

```text
                         INTERNET
                             |
                             v
                     +----------------+
                     |   CloudFront   |
                     +-------+--------+
                             |
                  +----------+----------+
                  |                     |
                  v                     v
           +-------------+       +-------------+
           |     S3      |       |     ALB     |
           |  Frontend   |       |   HTTP :80  |
           +-------------+       +------+------+
                                        |
                               +--------+--------+
                               |                 |
                               v                 v
                         +-----------+     +-----------+
                         |   EC2     |     |   EC2     |
                         |   App     |     |   App     |
                         +-----+-----+     +-----+-----+
                               |                 |
                               +--------+--------+
                                        |
                          +-------------+-------------+
                          |                           |
                          v                           v
                   +-------------+             +-------------+
                   | RDS MySQL   |             | ElastiCache |
                   |  Multi-AZ   |             |    Redis    |
                   +-------------+             +-------------+

                         AWS Secrets Manager
                                  |
                                  v
                         Database Credentials

https://d1agq1lu49v0iq.cloudfront.net/