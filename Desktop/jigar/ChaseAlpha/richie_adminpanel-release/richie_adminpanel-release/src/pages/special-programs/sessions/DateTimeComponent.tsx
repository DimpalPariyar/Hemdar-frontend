import React from 'react';
import { IconButton, TextFieldProps, Grid, TextField } from '@mui/material';
import { InputLabel } from '@mui/material';
import { getIn, useFormikContext } from 'formik';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import moment from 'moment';

const DateTimeComponent = (props: IProps) => {
  const { values, touched, setFieldValue, errors, handleBlur } = useFormikContext();

  const isTouched = getIn(touched, `dates.${props.id}.date`);
  const error = {
    date: getIn(errors, `dates.${props.id}.date`)
  };
  const value = {
    date: getIn(values, `dates.${props.id}.date`)
  };
  const FastinputfieldStyle = {
    bgcolor: "#ECEFFF", borderRadius: "10px", padding: '8px 10px', "&:hover": {
      border: "1px solid #2D00D2"
    }
  }
  return (
    <Grid container>
      <InputLabel sx={{ p: 0.5 }}>{props.index + 1}. Session Date & Time </InputLabel>
      <Grid item xs={11}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            value={value.date}
            onChange={(date) => {
              let dates = moment(date).format("YYYY-MM-DDTHH:mm:ssZ")
              console.log(date, dates);
              return setFieldValue(`dates.${props.id}.date`, dates)
            }}
            renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
              <TextField
                {...params}
                sx={FastinputfieldStyle}
                id={`dates.${props.id}.date`}
                name={`dates.${props.id}.date`}
                error={isTouched && Boolean(error.date)}
                helperText={isTouched && error.date}
                onBlur={handleBlur}
              />
            )}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item alignItems="stretch" sx={{ display: 'flex' }}>
        <IconButton disabled={Number(props.index) < 1 && true} onClick={() => props.deleteRow(props.id, setFieldValue)}>
          <DeleteOutlineOutlinedIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

interface IProps {
  id: string;
  index: number;
  deleteRow: (id: string, setFieldValue: any) => void;
}

export default DateTimeComponent;
