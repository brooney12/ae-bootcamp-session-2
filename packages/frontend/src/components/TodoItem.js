import React from 'react';

import {
  Box,
  IconButton,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';

import EditTodoForm from './EditTodoForm';

function formatDate(dateStr) {
  return dayjs(dateStr).format('MMM DD, YYYY');
}

function isOverdue(dateStr) {
  return dayjs(dateStr).isBefore(dayjs(), 'day');
}

function TodoItem({ todo, editingId, onEdit, onSave, onCancelEdit, onDelete }) {
  const isEditing = editingId === todo.id;

  if (isEditing) {
    return (
      <ListItem divider sx={{ py: 2 }}>
        <Box sx={{ width: '100%' }}>
          <EditTodoForm todo={todo} onSave={onSave} onCancel={onCancelEdit} />
        </Box>
      </ListItem>
    );
  }

  const overdue = todo.due_date && isOverdue(todo.due_date);

  return (
    <ListItem
      divider
      secondaryAction={
        <Box>
          <IconButton
            aria-label={`Edit ${todo.name}`}
            onClick={() => onEdit(todo.id)}
            size="small"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            aria-label={`Delete ${todo.name}`}
            onClick={() => onDelete(todo.id)}
            color="error"
            size="small"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      }
    >
      <ListItemText
        primary={todo.name}
        secondary={
          todo.due_date ? (
            <Typography
              component="span"
              variant="body2"
              color={overdue ? 'error' : 'text.secondary'}
              aria-label={overdue ? `Overdue: ${formatDate(todo.due_date)}` : undefined}
            >
              Due: {formatDate(todo.due_date)}
              {overdue && ' (overdue)'}
            </Typography>
          ) : null
        }
      />
    </ListItem>
  );
}

export default TodoItem;
