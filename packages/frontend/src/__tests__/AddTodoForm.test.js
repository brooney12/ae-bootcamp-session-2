import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import AddTodoForm from '../components/AddTodoForm';

function Wrapper({ children }) {
  return (
    <ThemeProvider theme={createTheme()}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  );
}

describe('AddTodoForm', () => {
  test('renders title input and Add button', () => {
    render(<AddTodoForm onAdd={jest.fn()} />, { wrapper: Wrapper });
    expect(screen.getByRole('textbox', { name: /todo title/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  test('does not call onAdd when title is empty', async () => {
    const onAdd = jest.fn();
    render(<AddTodoForm onAdd={onAdd} />, { wrapper: Wrapper });
    await userEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(onAdd).not.toHaveBeenCalled();
  });

  test('calls onAdd with name and null due date when submitted', async () => {
    const onAdd = jest.fn();
    render(<AddTodoForm onAdd={onAdd} />, { wrapper: Wrapper });
    await userEvent.type(screen.getByRole('textbox', { name: /todo title/i }), 'My New Todo');
    await userEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(onAdd).toHaveBeenCalledWith('My New Todo', null);
  });

  test('clears the input after successful submit', async () => {
    const onAdd = jest.fn();
    render(<AddTodoForm onAdd={onAdd} />, { wrapper: Wrapper });
    const input = screen.getByRole('textbox', { name: /todo title/i });
    await userEvent.type(input, 'Clear Me');
    await userEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(input).toHaveValue('');
  });
});
