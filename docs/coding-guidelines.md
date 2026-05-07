# Coding Guidelines

## Overview

This document describes the coding style and quality principles for this project. All contributors and AI tools should follow these guidelines to ensure a consistent, maintainable, and high-quality codebase.

## General Formatting

- Use **2 spaces** for indentation (no tabs).
- Keep lines to a maximum of **100 characters**.
- Always use **semicolons** at the end of statements in JavaScript.
- Use **single quotes** for strings, except in JSX where double quotes are preferred for attribute values.
- Add a **trailing newline** at the end of every file.
- Remove all **trailing whitespace**.

## Naming Conventions

- Use **camelCase** for variables and functions (e.g., `getTodos`, `dueDate`).
- Use **PascalCase** for React components and classes (e.g., `TodoList`, `AddTodoForm`).
- Use **UPPER_SNAKE_CASE** for constants (e.g., `MAX_TODOS`).
- File names should match the component or module they export (e.g., `TodoList.js` for the `TodoList` component).

## Import Organization

Organize imports in the following order, with a blank line between each group:

1. **Node.js built-ins** (e.g., `path`, `fs`)
2. **Third-party packages** (e.g., `express`, `react`, `@mui/material`)
3. **Internal modules / local files** (e.g., `./components/TodoList`, `../utils/helpers`)

Example:
```js
import path from 'path';

import express from 'express';
import { Button } from '@mui/material';

import TodoList from './components/TodoList';
import { formatDate } from '../utils/helpers';
```

## Linter Usage

- **ESLint** is the required linter for both frontend and backend code.
- All code must pass ESLint checks with no errors before being committed.
- Warnings should be addressed but are not blocking.
- Do not disable ESLint rules inline (`// eslint-disable`) unless there is a documented reason.

## DRY Principle (Don't Repeat Yourself)

- Avoid duplicating logic — extract repeated code into shared utility functions or custom React hooks.
- Place shared backend utilities in `packages/backend/src/utils/`.
- Place shared frontend utilities or hooks in `packages/frontend/src/utils/` or `packages/frontend/src/hooks/`.
- Reuse MUI components rather than recreating similar UI patterns from scratch.

## Component Design (Frontend)

- Keep React components **small and focused** — each component should do one thing well.
- Prefer **functional components** with hooks over class components.
- Lift state up only as far as necessary; avoid unnecessary prop drilling (use context if needed).
- Avoid inline styles; use MUI's `sx` prop or `styled()` utility instead.

## Error Handling

- Always handle errors at system boundaries (API routes, async operations).
- Return meaningful HTTP status codes and error messages from backend routes.
- Use `try/catch` with async/await rather than chaining `.catch()` for readability.

## Code Quality

- Write **self-documenting code** — use clear, descriptive names so that comments are rarely needed.
- Add comments only to explain *why*, not *what* (the code should speak for itself).
- Keep functions short and focused — if a function is doing too much, break it up.
- Delete unused code and imports rather than commenting them out.
