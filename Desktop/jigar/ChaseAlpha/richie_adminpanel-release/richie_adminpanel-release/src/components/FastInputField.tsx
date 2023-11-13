
import { FormControl, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

const FastInputField = ({ name, value, onChange, type = "text", style, placeholder, shouldDisable = false, ...props }: any) => {
  const [localValue, setLocalValue] = useState<any>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <FormControl>
      <TextField
        sx={style}
        {...props}
        type={type}
        placeholder={placeholder}
        fullWidth
        name={name}
        value={localValue}
        onBlur={() => onChange(name, localValue)}
        onChange={(e: any) => setLocalValue(e.target.value)}
        disabled={shouldDisable}
        variant="standard"
        InputProps={{
          disableUnderline: true,
        }}
      />
    </FormControl>
  );
};

export default FastInputField;
