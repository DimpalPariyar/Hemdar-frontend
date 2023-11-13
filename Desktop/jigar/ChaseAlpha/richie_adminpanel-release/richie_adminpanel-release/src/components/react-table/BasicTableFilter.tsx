import { TextField } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

export const BasicTableFilter = ({ column }: any) => {
  return <div style={{ marginTop: 5 }}>{column.canFilter ? column.render('Filter') : '-'}</div>;
};

export const ColumnFilter = ({ column: { filterValue, setFilter } }: any) => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      <TextField
        fullWidth
        value={filterValue}
        InputProps={{
          placeholder: 'Search...',
          type: 'search'
        }}
        onChange={(e: any) => setFilter(e.target.value)}
      />
    </Box>
  );
};
