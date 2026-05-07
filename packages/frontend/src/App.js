import React, { useState, useEffect, useMemo } from 'react';

import { Alert, AppBar, Box, Container, Divider, Stack, Toolbar, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import AddTodoForm from './components/AddTodoForm';
import SortControl from './components/SortControl';
import TodoList from './components/TodoList';

const theme = createTheme();

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/items');
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      setTodos(result);
      setError(null);
    } catch (err) {
      setError('Failed to fetch todos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (name, dueDate) => {
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, due_date: dueDate }),
      });
      if (!response.ok) throw new Error('Failed to add todo');
      const created = await response.json();
      setTodos((prev) => [...prev, created]);
      setError(null);
    } catch (err) {
      setError('Error adding todo: ' + err.message);
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSave = async (id, name, dueDate) => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, due_date: dueDate }),
      });
      if (!response.ok) throw new Error('Failed to update todo');
      const updated = await response.json();
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError('Error updating todo: ' + err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/items/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete todo');
      setTodos((prev) => prev.filter((t) => t.id !== id));
      setError(null);
    } catch (err) {
      setError('Error deleting todo: ' + err.message);
    }
  };

  const handleToggleSort = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) =>
      sortOrder === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
  }, [todos, sortOrder]);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="h1">
              Todo App
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Typography variant="h5" component="h2" gutterBottom>
            Add New Todo
          </Typography>
          <AddTodoForm onAdd={handleAdd} />

          <Divider sx={{ my: 3 }} />

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5" component="h2">
              Your Todos
            </Typography>
            <SortControl sortOrder={sortOrder} onToggle={handleToggleSort} />
          </Stack>

          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <Box>
              <TodoList
                todos={sortedTodos}
                editingId={editingId}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancelEdit={handleCancelEdit}
                onDelete={handleDelete}
              />
            </Box>
          )}
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
