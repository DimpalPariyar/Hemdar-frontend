import React, { useState } from 'react';
import { Stack, InputLabel, FormControl, TextField, TextFieldProps, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import FastInputField from 'components/FastInputField';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
const Inputfeild = { width: '200px', padding: '15px', fontSize: '15px', fontWeight: '400' };

// const FastinputfieldStyle = {
//     bgcolor: "#ECEFFF", borderRadius: "10px", padding: '8px 10px', width: 335, border: "none",
//     '& .MuiOutlinedInput-notchedOutline ': {
//         border: 'none',
//         boxShadow: "none"
//     },
//     "& .focus": { boxShadow: "none" },
// }
const UsageLimitTab = ({ formik }: any) => {
  const values: any = formik.values;
  console.log(values);
  const [enable, setEnable] = useState(values.enableCoupon);

  return (
    <>
      <Stack direction="row">
        <InputLabel sx={Inputfeild}>No of Redeemtion :</InputLabel>
        <FormControl sx={{ width: '60%' }}>
          <FastInputField
            style={{ backgroundColor: '#ECEFFF', borderRadius: '5px', height: '40px' }}
            type="number"
            name="redeem"
            value={values.redeem}
            onChange={formik.setFieldValue}
          />
        </FormControl>
      </Stack>
      <Stack direction="row">
        <InputLabel sx={Inputfeild}>Enable Coupon:</InputLabel>
        <FormControl sx={{ width: '60%' }}>
          <FormControl sx={{ flex: 1 }}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    name="enableCoupon"
                    checked={enable}
                    onChange={(e) => {
                      setEnable(!enable);
                      values.enableCoupon = e.target.checked;
                    }}
                  />
                }
                label="check this box if the you want to disable the coupon."
              />
            </FormGroup>
          </FormControl>
        </FormControl>
      </Stack>
    </>
  );
};

export default UsageLimitTab;
