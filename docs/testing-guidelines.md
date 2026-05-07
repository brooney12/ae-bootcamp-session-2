# Testing Guidelines

## Unit Tests

- Use **Jest** to test individual functions and React components in isolation.
- File naming convention: `*.test.js` or `*.test.ts`.
- Backend unit tests: `packages/backend/__tests__/`
- Frontend unit tests: `packages/frontend/src/__tests__/`
- Name test files to match what they're testing (e.g., `app.test.js` for testing `app.js`).

## Integration Tests

- Use **Jest + Supertest** to test backend API endpoints with real HTTP requests.
- File naming convention: `*.test.js` or `*.test.ts`.
- Integration tests: `packages/backend/__tests__/integration/`
- Name integration test files based on what they test (e.g., `todos-api.test.js` for TODO API endpoints).

## End-to-End (E2E) Tests

- Use **Playwright** (required framework) to test complete UI workflows through browser automation.
- File naming convention: `*.spec.js` or `*.spec.ts`.
- E2E tests: `tests/e2e/`
- Name E2E test files based on the user journey they test (e.g., `todo-workflow.spec.js`).
- Use **one browser only** in Playwright configuration.
- Use the **Page Object Model (POM)** pattern for maintainability.
- Limit to **5–8 E2E tests** covering critical user journeys — focus on happy paths and key edge cases, not exhaustive coverage.

## Port Configuration

- Always use environment variables with sensible defaults for port configuration.
- Backend: `const PORT = process.env.PORT || 3030;`
- Frontend: React's default port is `3000`, but can be overridden with the `PORT` environment variable.
- This allows CI/CD workflows to dynamically detect ports.

## Testing Pyramid

Follow the **testing pyramid** principle when deciding what and how much to test:

- **Unit tests** (base) — the majority of tests should be at this level. Fast, isolated, and cheap to write and maintain.
- **Integration tests** (middle) — a moderate number covering key API interactions and data flows.
- **E2E tests** (top) — a small number (5–8) targeting only critical user journeys. Avoid duplicating coverage already provided by unit or integration tests.

Favor unit and integration tests over E2E/UI tests. E2E tests are slower, more brittle, and harder to maintain — use them sparingly and purposefully.

## General Requirements

- All tests must be **isolated and independent** — each test should set up its own data and not rely on other tests.
- **Setup and teardown hooks are required** — tests must succeed on multiple consecutive runs.
- All new features must include appropriate tests (unit, integration, and/or E2E as applicable).
- Tests should be maintainable and follow best practices.
