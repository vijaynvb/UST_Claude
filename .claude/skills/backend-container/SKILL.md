---
name: backend-container
disable-model-invocation: true
description: Use this skill whenever a Dockerfile, container image, or containerization is requested for a Node.js, Express, or TypeScript backend application.
---

# Backend Dockerfile Skill

Generate a production-ready Dockerfile for a Node.js (Express + TypeScript) application.

Requirements:
- Use multi-stage build (install & build → slim runtime image)
- Build the application (TypeScript compile) inside the container
- Final image should be lightweight (node:alpine)
- Expose port 3000
- Set environment variables for DB connection, NODE_ENV
- Use non-root user for security
- Include healthcheck instruction
- Ensure container runs with: node dist/index.js

Output:
- Complete Dockerfile
- Explanation of each stage

Actions:
- provide the file named Dockerfile with the content as specified above
