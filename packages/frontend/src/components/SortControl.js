import React from 'react';

import { Button } from '@mui/material';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';

function SortControl({ sortOrder, onToggle }) {
  const label = sortOrder === 'asc' ? 'A → Z' : 'Z → A';

  return (
    <Button
      variant="outlined"
      size="small"
      startIcon={<SortByAlphaIcon />}
      onClick={onToggle}
      aria-label={`Sort todos ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
    >
      Sort: {label}
    </Button>
  );
}

export default SortControl;
