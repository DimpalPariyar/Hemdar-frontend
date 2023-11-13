import { TextField } from '@mui/material';
import MuiAutocomplete from '@mui/material/Autocomplete';

const Autocomplete = ({ label, valueKey = 'value', showValue = true, ...props }: any) => {
  const value = props.options.find((data: any) => data[valueKey] === props.value);
  return (
    <MuiAutocomplete
      value={value?.label}
      renderInput={(params) => <TextField sx={{ border: 'none' }} {...params} autoFocus={showValue} />}
      {...props}
    />
  );
};

export default Autocomplete;
