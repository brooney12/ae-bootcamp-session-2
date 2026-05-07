import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { List } from '@mui/material';

import TodoItem from '../components/TodoItem';

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

function Wrapper({ children }) {
  return (
    <ThemeProvider theme={createTheme()}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <List>{children}</List>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

const baseTodo = { id: 1, name: 'Test Todo', due_date: null, created_at: '2026-01-01T00:00:00.000Z' };

describe('TodoItem', () => {
  test('displays the todo name', () => {
    render(
      <TodoItem todo={baseTodo} editingId={null} onEdit={jest.fn()} onSave={jest.fn()} onCancelEdit={jest.fn()} onDelete={jest.fn()} />,
      { wrapper: Wrapper }
    );
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  test('shows due date when set', () => {
    const todo = { ...baseTodo, due_date: '2026-12-31' };
    render(
      <TodoItem todo={todo} editingId={null} onEdit={jest.fn()} onSave={jest.fn()} onCancelEdit={jest.fn()} onDelete={jest.fn()} />,
      { wrapper: Wrapper }
    );
    expect(screen.getByText(/Dec 31, 2026/)).toBeInTheDocument();
  });

  test('marks overdue date as overdue', () => {
    const todo = { ...baseTodo, due_date: yesterday };
    render(
      <TodoItem todo={todo} editingId={null} onEdit={jest.fn()} onSave={jest.fn()} onCancelEdit={jest.fn()} onDelete={jest.fn()} />,
      { wrapper: Wrapper }
    );
    expect(screen.getByText(/overdue/i)).toBeInTheDocument();
  });

  test('calls onEdit when Edit button is clicked', async () => {
    const onEdit = jest.fn();
    render(
      <TodoItem todo={baseTodo} editingId={null} onEdit={onEdit} onSave={jest.fn()} onCancelEdit={jest.fn()} onDelete={jest.fn()} />,
      { wrapper: Wrapper }
    );
    await userEvent.click(screen.getByRole('button', { name: /edit test todo/i }));
    expect(onEdit).toHaveBeenCalledWith(1);
  });

  test('calls onDelete when Delete button is clicked', async () => {
    const onDelete = jest.fn();
    render(
      <TodoItem todo={baseTodo} editingId={null} onEdit={jest.fn()} onSave={jest.fn()} onCancelEdit={jest.fn()} onDelete={onDelete} />,
      { wrapper: Wrapper }
    );
    await userEvent.click(screen.getByRole('button', { name: /delete test todo/i }));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  test('renders EditTodoForm when editingId matches', () => {
    render(
      <TodoItem todo={baseTodo} editingId={1} onEdit={jest.fn()} onSave={jest.fn()} onCancelEdit={jest.fn()} onDelete={jest.fn()} />,
      { wrapper: Wrapper }
    );
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });
});
