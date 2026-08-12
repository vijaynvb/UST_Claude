# Backend Development Guidelines

## Project Overview

This folder contains the backend services for the Task Management System.

The backend exposes REST APIs used by the frontend application and is responsible for authentication, business logic, task management, reporting, and database access.

---

# Technology Stack

- Node.js
- Express.js
- TypeScript
- SQLite (In-Memory)
- Prisma ORM (or repository layer)
- JWT Authentication

---

# Architecture

Follow a layered architecture.

```
Routes
    ↓
Controllers
    ↓
Services
    ↓
Repositories
    ↓
Database
```

Business logic must reside in the Service layer.

Controllers should only:

- Validate requests
- Call services
- Return responses

Repositories should only:

- Perform database operations

---

# Folder Structure

```
src/
dtos/
controllers/
routes/
services/
repositories/
middleware/
models/
validators/
utils/
config/
```

---

# API Standards

Always:

- Follow REST conventions.
- Use nouns for resources.
- Return proper HTTP status codes.
- Validate every request.
- Return JSON responses.

Example response:

```json
{
  "success": true,
  "message": "",
  "data": {}
}
```

---

# Database Rules

Task Entity

- id
- title
- description
- priority
- status
- dueDate
- assigneeId
- createdAt
- updatedAt

User Entity

- id
- name
- email
- role

---

# Business Rules

Always enforce:

- Title is mandatory.
- Due date cannot be in the past.
- Managers can reassign tasks.
- Employees manage only their own tasks.
- Completed tasks are read-only unless reopened by a manager.
- Overdue tasks are automatically flagged.

---

# Authentication

Use JWT authentication.

Protect all APIs except:

- Login
- Health Check

Never expose sensitive information.

---

# Error Handling

Use centralized exception handling.

Return consistent error responses.

Example

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

---

# Logging

Log:

- API requests
- Errors
- Authentication failures

Never log:

- Passwords
- Tokens
- Secrets

---

# Code Standards

Always:

- Use async/await
- Use TypeScript
- Follow SOLID principles
- Keep services reusable
- Validate inputs
- Use dependency injection where applicable

---

# Testing

Before completing any feature:

- Run unit tests
- Verify APIs
- Validate business rules
- Ensure TypeScript compiles
- Ensure no lint errors

---

# Instructions for Claude

Whenever implementing backend features:

- Generate production-ready code.
- Separate concerns properly.
- Keep controllers thin.
- Keep services reusable.
- Explain architectural decisions if introducing new modules.