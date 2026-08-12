# Frontend Development Guidelines

## Project Overview

This folder contains the React frontend for the Task Management System.

The application allows users to manage tasks, assignments, priorities, reports, and notifications.

---

# Technology Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

---

# Folder Structure

```
src/
components/
pages/
layouts/
hooks/
services/
context/
utils/
types/
assets/
```

---

# UI Principles

Always create interfaces that are:

- Clean
- Responsive
- Accessible
- Reusable
- Consistent

Desktop-first with mobile responsiveness.

---

# Component Standards

Always:

- Use Functional Components.
- Use Hooks.
- Keep components small.
- Create reusable UI components.
- Separate presentation from business logic.

---

# Styling

Use:

- Tailwind CSS

Avoid:

- Inline styles
- Duplicate CSS
- Hardcoded colors

Use responsive utility classes.

---

# Forms

Every form should include:

- Validation
- Loading state
- Error handling
- Success messages

Use controlled components.

---

# API Integration

Use Axios.

Keep API calls inside:

```
services/
```

Never call APIs directly inside UI components.

---

# Routing

Use React Router.

Protect authenticated routes.

Group routes by feature.

---

# State Management

Prefer:

- React Context
- Custom Hooks

Keep state localized whenever possible.

---

# Accessibility

Always include:

- Labels
- Keyboard navigation
- ARIA attributes
- Proper button types

---

# UI Components

Prefer reusable components for:

- Buttons
- Cards
- Tables
- Forms
- Inputs
- Dialogs
- Loaders

---

# Code Standards

Always:

- Use TypeScript
- Avoid duplicated components
- Use reusable hooks
- Follow naming conventions
- Keep files organized

---

# Performance

Optimize by:

- Lazy loading pages
- Memoizing expensive components
- Avoiding unnecessary re-renders

---

# Testing

Before completing UI work:

- Verify responsiveness
- Verify accessibility
- Test forms
- Test API integration
- Ensure no TypeScript errors

---

# Instructions for Claude

Whenever generating frontend code:

- Produce production-ready React components.
- Follow the project structure.
- Use Tailwind CSS.
- Include loading, empty, and error states.
- Create reusable components whenever possible.
- Keep the UI clean, modern, and consistent.