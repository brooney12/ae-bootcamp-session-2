import React, { useState } from 'react';

import { Button, Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import dayjs from 'dayjs';

function EditTodoForm({ todo, onSave, onCancel }) {
  const [name, setName] = useState(todo.name);
  const [dueDate, setDueDate] = useState(todo.due_date ? dayjs(todo.due_date) : null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(todo.id, name.trim(), dueDate ? dueDate.format('YYYY-MM-DD') : null);
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Edit todo form">
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="flex-start">
        <TextField
          label="Todo title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          size="small"
          sx={{ flex: 1, minWidth: 200 }}
          inputProps={{ 'aria-label': 'Edit todo title' }}
        />
        <DatePicker
          label="Due date"
          value={dueDate}
          onChange={(val) => setDueDate(val)}
          slotProps={{ textField: { size: 'small', sx: { minWidth: 180 } } }}
        />
        <Button
          type="submit"
          variant="contained"
          startIcon={<SaveIcon />}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Save
        </Button>
        <Button
          type="button"
          variant="outlined"
          color="secondary"
          startIcon={<CancelIcon />}
          onClick={onCancel}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Cancel
        </Button>
      </Stack>
    </form>
  );
}

export default EditTodoForm;
