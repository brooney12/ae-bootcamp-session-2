import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

const mockTodos = [
  { id: 1, name: 'Alpha Task', due_date: null, created_at: '2026-01-01T00:00:00.000Z' },
  { id: 2, name: 'Beta Task', due_date: '2026-12-31', created_at: '2026-01-02T00:00:00.000Z' },
];

const server = setupServer(
  rest.get('/api/items', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockTodos));
  }),

  rest.post('/api/items', (req, res, ctx) => {
    const { name, due_date } = req.body;
    if (!name || name.trim() === '') {
      return res(ctx.status(400), ctx.json({ error: 'Item name is required' }));
    }
    return res(
      ctx.status(201),
      ctx.json({ id: 3, name, due_date: due_date || null, created_at: new Date().toISOString() })
    );
  }),

  rest.put('/api/items/:id', (req, res, ctx) => {
    const { name, due_date } = req.body;
    const id = parseInt(req.params.id);
    const todo = mockTodos.find((t) => t.id === id);
    if (!todo) return res(ctx.status(404), ctx.json({ error: 'Item not found' }));
    return res(ctx.status(200), ctx.json({ ...todo, name, due_date: due_date || null }));
  }),

  rest.delete('/api/items/:id', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: 'Item deleted successfully' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App Component', () => {
  test('renders the header', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText('Todo App')).toBeInTheDocument();
  });

  test('loads and displays todos', async () => {
    await act(async () => {
      render(<App />);
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Alpha Task')).toBeInTheDocument();
      expect(screen.getByText('Beta Task')).toBeInTheDocument();
    });
  });

  test('adds a new todo', async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const input = screen.getByRole('textbox', { name: /todo title/i });
    await act(async () => {
      await user.type(input, 'New Test Todo');
    });

    const submitButton = screen.getByRole('button', { name: /add/i });
    await act(async () => {
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('New Test Todo')).toBeInTheDocument();
    });
  });

  test('handles API error on load', async () => {
    server.use(
      rest.get('/api/items', (req, res, ctx) => res(ctx.status(500)))
    );

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch todos/)).toBeInTheDocument();
    });
  });

  test('shows empty state when no todos', async () => {
    server.use(
      rest.get('/api/items', (req, res, ctx) => res(ctx.status(200), ctx.json([])))
    );

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument();
    });
  });

  test('deletes a todo', async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Alpha Task')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /delete alpha task/i });
    await act(async () => {
      await user.click(deleteButtons[0]);
    });

    await waitFor(() => {
      expect(screen.queryByText('Alpha Task')).not.toBeInTheDocument();
    });
  });

  test('sorts todos A-Z then Z-A', async () => {
    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Alpha Task')).toBeInTheDocument();
    });

    const sortButton = screen.getByRole('button', { name: /sort todos/i });

    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Alpha Task');

    await act(async () => {
      await userEvent.setup().click(sortButton);
    });

    const itemsAfter = screen.getAllByRole('listitem');
    expect(itemsAfter[0]).toHaveTextContent('Beta Task');
  });
});
