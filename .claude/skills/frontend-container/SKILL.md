---
name: frontend-container
description: Use this skill whenever a Dockerfile, container image, or containerization is requested for the React + TypeScript + Vite frontend application.
---

# Frontend Dockerfile Skill

Generate a Dockerfile for a React (TypeScript) frontend.

Requirements:
- Multi-stage build
- Stage 1: Node image for building frontend with npm/yarn
- Stage 2: NGINX lightweight image to serve static build
- Copy build output to /usr/share/nginx/html
- Add caching instructions for static assets
- Expose port 80
- Include NGINX default.conf setup for SPA routing

Output:
- Complete Dockerfile
- Example NGINX config

Actions:
- provide the file named Dockerfile with the content as specified above