// material-ui
import { Box, FormControl, IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// assets
//import IconButton from 'themes/overrides/IconButton';

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const Search = () => (
  <Box sx={{ ml: { xs: 0, md: 1 } }}>
    <FormControl sx={{
      width: { xs: 'max-content', md: 300 }, border: "none"
    }}>
      {/* <Paper
        component="form"
        elevation={0}
        sx={{ display: 'flex', alignItems: 'center', width: 300, borderRadius: "25px", background: "#E5E9FF" }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1, fontWeight: "700", p: 0.5, marginLeft: "15px" }}
          placeholder="Search "
          inputProps={{ 'aria-label': 'search google maps' }}

        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon sx={{ color: "black" }} />
        </IconButton>
      </Paper> */}
    </FormControl>
  </Box>
);

export default Search;
