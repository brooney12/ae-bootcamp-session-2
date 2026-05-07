import React, { useState } from 'react';

import { Button, Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AddIcon from '@mui/icons-material/Add';

function AddTodoForm({ onAdd }) {
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), dueDate ? dueDate.format('YYYY-MM-DD') : null);
    setName('');
    setDueDate(null);
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Add todo form">
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
        <TextField
          label="Todo title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          size="small"
          sx={{ flex: 1, minWidth: 200 }}
          inputProps={{ 'aria-label': 'Todo title' }}
        />
        <DatePicker
          label="Due date (optional)"
          value={dueDate}
          onChange={(val) => setDueDate(val)}
          slotProps={{ textField: { size: 'small', sx: { minWidth: 180 } } }}
        />
        <Button
          type="submit"
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Add
        </Button>
      </Stack>
    </form>
  );
}

export default AddTodoForm;
