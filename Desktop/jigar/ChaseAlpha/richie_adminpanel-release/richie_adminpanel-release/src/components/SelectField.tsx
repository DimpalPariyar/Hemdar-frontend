import { FormControl, MenuItem, Select } from '@mui/material';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

const SelectField = ({
  name,
  value,
  onChange,
  options,
  valueKey = 'value',
  labelKey = 'label',
  defaultValue = null,
  shouldDisable = false
}: any) => {
  const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
      marginTop: theme.spacing(3)
    },
    '& .MuiInputBase-input': {
      borderRadius: 10,
      position: 'relative',
      backgroundColor: '#ECEFFF',
      fontSize: 14,
      padding: '10px 26px 10px 12px',
      '&:focus': {
        borderRadius: 10,
        boxShadow: '0 0 0 0.2rem #ECEFFG'
      }
    },
    '& .MuiSelect-icon': {
      background: 'white',
      borderRadius: 15,
      color: '#2D00D2'
    }
  }));

  return (
    <FormControl>
      <Select input={<BootstrapInput />} id={name} value={value} onChange={onChange} name={name} disabled={shouldDisable}>
        {defaultValue}
        {options.map((option: any) => (
          <MenuItem value={option[valueKey]} key={option[valueKey]} disabled={shouldDisable}>
            {option[labelKey]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectField;
