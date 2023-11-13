import { TextField } from '@mui/material';
import { Box } from '@mui/system';

export const MinMaxInput = ({ column: { filterValue = {}, setFilter } }: any) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
      <TextField
        placeholder="MIN"
        sx={{ width: 52 }}
        value={filterValue.min}
        onChange={(e: any) => setFilter({ ...filterValue, min: e.target.value })}
      />
      -
      <TextField
        placeholder="MAX"
        sx={{ width: 52 }}
        value={filterValue.max}
        onChange={(e: any) => setFilter({ ...filterValue, max: e.target.value })}
      />
    </Box>
  );
};
