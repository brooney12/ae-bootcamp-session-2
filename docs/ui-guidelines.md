# UI Guidelines

## Overview

This document defines the UI/UX requirements for the Todo application frontend. All UI components should be consistent, accessible, and responsive.

## Layout

- The app should have a single-page layout with a centered main content area.
- A header at the top displays the application title ("Todo App").
- The main content area contains the todo input form and the todo list.

## Components

### Add Todo Form
- A text input field for the todo title/description (required).
- A date input field for the optional due date.
- An "Add" button to submit the new todo.
- The form should clear after a todo is successfully added.

### Todo List
- Displays all todos in a vertical list.
- Each todo item shows:
  - The todo title/description.
  - The due date (if set), formatted as `MMM DD, YYYY` (e.g., `Jan 15, 2026`).
  - An "Edit" button to modify the todo.
  - A "Delete" button to remove the todo.
- An empty state message is shown when there are no todos (e.g., "No todos yet. Add one above!").

### Sort Control
- A sort button or dropdown above the todo list to sort todos alphabetically by name.
- Toggling between ascending (A–Z) and descending (Z–A) order should be clearly indicated (e.g., with an arrow icon or label).

### Edit Todo
- Clicking "Edit" on a todo item switches it to an inline edit mode or opens an edit form.
- The edit form pre-populates with the current title and due date.
- "Save" and "Cancel" buttons are provided.
- Changes are saved immediately on "Save" and discarded on "Cancel".

## Component Library: Material UI (MUI)

- Use [Material UI (MUI)](https://mui.com/) as the primary component library.
- Install via `npm install @mui/material @emotion/react @emotion/styled`.
- Use MUI components wherever possible instead of custom HTML elements (e.g., `<Button>`, `<TextField>`, `<IconButton>`, `<List>`, `<ListItem>`).
- Use MUI's `DatePicker` from `@mui/x-date-pickers` for due date input.
- Use MUI icons from `@mui/icons-material` for action buttons (e.g., `EditIcon`, `DeleteIcon`, `SortIcon`).
- Follow MUI's theming system for consistent colors, typography, and spacing across the app.
- Avoid overriding MUI styles with raw CSS unless strictly necessary; prefer the `sx` prop or `styled()` utility.

## Styling

- Use a clean, minimal design with sufficient whitespace.
- Buttons should have distinct styles for primary actions (Add, Save) vs. secondary/destructive actions (Cancel, Delete).
- Due dates that are overdue (past today's date) should be visually highlighted (e.g., red text).
- The app should be responsive and usable on both desktop and mobile screen sizes.

## Accessibility

- All form inputs must have associated `<label>` elements.
- Buttons must have descriptive text or `aria-label` attributes.
- Color alone should not be the sole means of conveying information (e.g., overdue state).
- The app should be keyboard navigable.
