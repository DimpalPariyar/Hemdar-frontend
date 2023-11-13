import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';



function SatusOptionBar(Props: any) {
    const [values, setValues] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setValues(event.target.value);
    };

    return (
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <Select
                value={values}
                onChange={handleChange}
                sx={{ background: "white", borderRadius: '15px' }}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
            >
                <MenuItem value={values}>
                    <em>All</em>
                </MenuItem>
                <MenuItem value={values}>Created</MenuItem>
                <MenuItem value={values}>Paid</MenuItem>

            </Select>
        </FormControl>
    )
}

export default SatusOptionBar