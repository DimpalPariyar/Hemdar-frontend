import { FormControl, IconButton, InputBase, Paper } from '@mui/material';
import { memo, useState } from 'react';
import useDebounce from 'hooks/UseDebounce';
import SearchIcon from '@mui/icons-material/Search';
const SearchInput = ({ value = '', onChange }: any) => {
  const [searchText, setSearchText] = useState<string>(value);

  useDebounce(() => onChange(searchText), [searchText], 800);

  const handleOnChange = (value: string) => {
    setSearchText(value);
  };

  const SearchColur = '#2C00D3'
  return (
    <FormControl>
      <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300, borderRadius: "25px", background: "#E5E9FF", border: `1px solid ${SearchColur}` }}
      >
        <InputBase
          value={searchText}
          onChange={(e: any) => handleOnChange(e.target.value)}
          sx={{ ml: 1, flex: 1, fontWeight: "700" }}
          placeholder="Search "
          inputProps={{ 'aria-label': 'search google maps' }}

        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon sx={{ color: `${SearchColur}` }} />
        </IconButton>
      </Paper>
      <Paper sx={{ m: 1 }} elevation={0}>

      </Paper>
    </FormControl >
  );
};

export default memo(SearchInput);
