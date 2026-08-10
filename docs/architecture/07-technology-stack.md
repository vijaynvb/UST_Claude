# 7. Technology Stack

## 7.1 Overview

Technology choices favor mature, well-supported tools that satisfy the NFRs (security, performance, maintainability) without overengineering for the current single-user MVP scope.

## 7.2 Frontend

| Concern | Technology | Rationale |
|---|---|---|
| Framework | React + TypeScript | Strong typing (Clean Code standard), large ecosystem, component reuse |
| Build tool | Vite | Fast dev server and builds |
| Routing | React Router | Standard SPA routing |
| Server state / data fetching | TanStack Query | Caching, retries, loading/error states for API calls |
| Local/UI state | Zustand (or React Context for minimal state) | Lightweight, avoids boilerplate |
| Styling | Tailwind CSS | Consistent design system, fast iteration |
| Form validation | React Hook Form + Zod | Client-side validation mirroring backend schema (shared types where possible) |
| Testing | Vitest + React Testing Library | Unit/component test coverage (NFR-07) |

## 7.3 Backend

| Concern | Technology | Rationale |
|---|---|---|
| Runtime | Node.js (LTS) | JS/TS across stack reduces context-switching, strong async I/O fit for REST APIs |
| Language | TypeScript | Strong typing end-to-end (Clean Code standard) |
| Framework | NestJS | Built-in modularity, dependency injection, and decorators map directly onto the modular-monolith design ([Solution Architecture](02-solution-architecture.md)) |
| Validation | class-validator / Zod | Enforces input validation at the DTO boundary (NFR-03) |
| ORM | Prisma | Type-safe queries, migrations, reduces raw-SQL injection surface (NFR-03) |
| Authentication | Passport.js + JWT (access + refresh tokens) | Stateless auth suited to horizontal scaling (NFR-04/05) |
| Password hashing | bcrypt (or argon2id) | Industry-standard adaptive hashing (NFR-01) |
| Background jobs | BullMQ (Redis-backed) | Reliable queue for reminder scheduling/dispatch |
| Testing | Jest + Supertest | Unit + integration test coverage (NFR-07) |

## 7.4 Data & Messaging

| Concern | Technology | Rationale |
|---|---|---|
| Primary database | PostgreSQL | Relational integrity for user/task/reminder ownership constraints |
| Cache / session store | Redis | Token/session cache, job queue backend |
| Migrations | Prisma Migrate | Versioned, repeatable schema changes |

## 7.5 Infrastructure & Platform

| Concern | Technology | Rationale |
|---|---|---|
| Containerization | Docker | Consistent runtime across environments |
| Orchestration | Managed container service (e.g., AWS ECS Fargate / equivalent) | Avoids Kubernetes operational overhead at MVP scale while still supporting autoscaling |
| Load balancing | Managed Application Load Balancer | TLS termination, health checks |
| CDN / static hosting | CloudFront + S3 (or equivalent) | Fast global delivery of SPA assets |
| Secrets management | Cloud-native secrets manager (e.g., AWS Secrets Manager) | No secrets in source or config files (Security Standards) |
| Email delivery | Amazon SES (or equivalent SMTP provider) | Managed, reliable transactional email |
| CI/CD | GitHub Actions | Automated lint/test/build/deploy pipeline |

## 7.6 Observability

| Concern | Technology | Rationale |
|---|---|---|
| Structured logging | Pino (JSON logs) | Machine-parseable, correlation-ID friendly |
| Log aggregation | CloudWatch Logs / ELK (either fits) | Centralized log search (NFR-08) |
| Metrics & dashboards | Prometheus + Grafana (or CloudWatch Metrics) | Latency, error rate, saturation dashboards |
| Alerting | Grafana Alerting / CloudWatch Alarms | Notify on SLO breaches |

## 7.7 Versioning Policy

- All dependencies pinned to specific versions in lockfiles; automated dependency and vulnerability scanning runs in CI (see [Deployment Diagram §4.5](04-deployment-diagram.md#45-cicd-pipeline)).
- Node.js and PostgreSQL major versions tracked against their official LTS/support schedules.
