import React from 'react';
import { TextFieldProps, Grid, TextField } from '@mui/material';
import { InputLabel } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';


const DateTimeComponent = ({ formik }: any) => {
  const { values } = formik;
  const FastinputfieldStyle = {
    bgcolor: "#ECEFFF", borderRadius: "10px", padding: '8px 10px', width: 335, border: "none",
    '& .MuiOutlinedInput-notchedOutline ': {
      border: 'none',
      boxShadow: "none"
    },
    "& .focus": { boxShadow: "none" },
  }

  return (
    <Grid container direction="row" sx={{ width: "45%" }}>
      <InputLabel sx={{ mt: 1, width: "150px", padding: '10px', fontSize: '15px', fontWeight: '700' }}> Webinar Time </InputLabel>
      <Grid item >
        <LocalizationProvider dateAdapter={AdapterDateFns}>

          {/* //<DateTimePicker
            value={values.  }
            onChange={(date) => {
              console.log(date)
              return formik.setFieldValue(`webinarTime`, date)
            }}
            renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
              <TextField
                sx={FastinputfieldStyle}
                {...params}

                id={'webinarTime'}
                name={'webinarTime'}
                InputProps={{
                  startAdornment: <InputAdornment position="start">kg</InputAdornment>,

                }}
              />
            )}
          /> */}
          <DateTimePicker
            value={values.webinarTime}
            onChange={(date) => { 
              formik.setFieldValue(`webinarTime`, date)
            }}
            renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
              <TextField
                sx={FastinputfieldStyle}
                {...params}
                id={'webinarTime'}
                name={'webinarTime'}
              />
            )}
          />

        </LocalizationProvider>
      </Grid>
    </Grid>
  );
};

export default DateTimeComponent;
