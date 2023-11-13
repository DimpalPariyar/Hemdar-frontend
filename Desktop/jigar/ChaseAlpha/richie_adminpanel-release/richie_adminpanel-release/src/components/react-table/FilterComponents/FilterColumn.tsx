
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';


import Checkbox from '@mui/material/Checkbox';
import { useEffect } from 'react';

export interface FilterColumn {
  data: any,

}

export default function FilterColumn(props: FilterColumn) {
  let { data } = props
  const Store = data.map((x: any) => {
    return { ...x.getToggleHiddenProps(), header: x.Header }
  })
  useEffect(() => {
    window.localStorage.setItem("data", JSON.stringify(Store))
  }, [Store])

  return (
    <Box sx={{ display: 'flex' }}>
      <FormControl component="fieldset" variant="standard">
        <FormLabel component="legend">Visible columns</FormLabel>
        <FormGroup sx={{ height: '200px' }}>
          {
            data.map((column: any) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox  {...column.getToggleHiddenProps()} />
                  }
                  label={column.Header}

                />
              )
            })
          }
        </FormGroup>

      </FormControl>
    </Box>
  );
}
