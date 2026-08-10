# CLAUDE.md

# Engineering Standards

All generated artifacts should follow industry best practices.

## Code Standards

- Generate production-ready code.
- Follow language-specific best practices.
- Keep code modular and reusable.
- Follow the Single Responsibility Principle (SRP).
- Follow SOLID principles where applicable.
- Avoid duplicated logic.
- Prefer composition over inheritance.
- Use meaningful naming conventions.
- Keep methods and functions small and focused.
- Remove dead or unused code.
- Maintain consistent formatting.
- For adding diagrams, use Mermaid syntax.
---

## Documentation Standards

All documentation should:

- Use Markdown.
- Be well structured.
- Use meaningful headings.
- Include tables where appropriate.
- Be concise and professional.
- Be suitable for engineering teams.

---

# Clean Code Principles

Always write code that is:

- Readable
- Maintainable
- Testable
- Reusable
- Self-documenting

Prefer:

- Small classes
- Small functions
- Strong typing
- Consistent naming
- Clear separation of concerns

Avoid:

- Magic numbers
- Hardcoded values
- Deep nesting
- Large methods
- Duplicate implementations

---

# Security Standards

Always follow secure development practices.

## Authentication

- Never expose credentials.
- Use secure authentication mechanisms.
- Protect sensitive endpoints.
- Validate authorization before performing operations.

## Secrets

Never generate or commit:

- Passwords
- API Keys
- Tokens
- Certificates
- Connection strings

Secrets should always come from secure configuration or environment variables.

## Input Validation

Always:

- Validate user input.
- Sanitize data where appropriate.
- Prevent SQL Injection.
- Prevent XSS.
- Prevent CSRF where applicable.

## API Security

- Validate every request.
- Return appropriate HTTP status codes.
- Do not expose stack traces.
- Never leak internal implementation details.

---

# Backend Project Memory

Whenever working inside the backend project, automatically follow:

```

backend/CLAUDE.md

```

This file contains:

- Backend architecture
- API standards
- Business rules
- Database guidelines
- Coding standards
- Testing guidelines
- Implementation conventions

Do not duplicate backend-specific rules in this document.

---

# Frontend Project Memory

Whenever working inside the frontend project, automatically follow:

```

frontend/CLAUDE.md

```

This file contains:

- UI standards
- Component conventions
- Styling guidelines
- State management
- Routing
- Accessibility
- Frontend implementation standards

Do not duplicate frontend-specific rules in this document.

---

# Working Principles

Before implementing any feature:

1. Understand the requirement.
2. Identify the affected project layer.
3. Load the appropriate project memory.
4. Follow all engineering standards.
5. Generate production-ready output.
6. Validate the solution before completing the task.

---

# Quality Checklist

Before completing any task, ensure:

- Production-ready implementation.
- No duplicated code.
- Security best practices followed.
- Coding standards followed.
- Appropriate project memory applied.
- Documentation updated if required.
- Maintainable and scalable solution.

---

# Primary Objective

Always produce software that is:

- Secure
- Maintainable
- Scalable
- Performant
- Well documented
- Production ready
- Consistent across the entire application