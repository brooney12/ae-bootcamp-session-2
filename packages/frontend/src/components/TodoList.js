import React from 'react';

import { List, Typography } from '@mui/material';

import TodoItem from './TodoItem';

function TodoList({ todos, editingId, onEdit, onSave, onCancelEdit, onDelete }) {
  if (todos.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        No todos yet. Add one above!
      </Typography>
    );
  }

  return (
    <List disablePadding>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          editingId={editingId}
          onEdit={onEdit}
          onSave={onSave}
          onCancelEdit={onCancelEdit}
          onDelete={onDelete}
        />
      ))}
    </List>
  );
}

export default TodoList;
