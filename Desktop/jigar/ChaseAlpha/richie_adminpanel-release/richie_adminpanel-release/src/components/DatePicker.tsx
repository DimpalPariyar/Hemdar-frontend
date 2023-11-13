import { LocalizationProvider, DesktopDatePicker } from '@mui/lab';
import { TextField, TextFieldProps } from '@mui/material';
import IconButton from 'components/@extended/IconButton';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CloseCircleOutlined } from '@ant-design/icons';

const DatePicker = (props: any) => {
  const DateIcon = () => {
    const handleClear = (e: any) => {
      e.stopPropagation();
      props.onChange(null);
    };
    return (
      <IconButton color="secondary" onClick={handleClear}>
        <CloseCircleOutlined />
      </IconButton>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        components={{
          OpenPickerIcon: props.value ? DateIcon : null
        }}
        renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <TextField {...params} />
          </div>
        )}
        {...props}
      />
    </LocalizationProvider>
  );
};

export default DatePicker;
