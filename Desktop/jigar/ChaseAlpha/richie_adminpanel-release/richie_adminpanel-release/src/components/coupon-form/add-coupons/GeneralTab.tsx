import { Stack, InputLabel, InputBase, Select, MenuItem, FormControl, TextFieldProps, TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { styled } from '@mui/system';
import FastInputField from 'components/FastInputField';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import moment from 'moment';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3)
  },
  '& .MuiInputBase-input': {
    flex: 1,
    width: 380,
    borderRadius: 10,
    position: 'relative',
    backgroundColor: '#ECEFFF',
    fontSize: 16,
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
const Inputfeild = { width: '200px', padding: '15px', fontSize: '15px', fontWeight: '600' };
const Fastinputfield = { backgroundColor: '#ECEFFF', borderRadius: '5px', height: '40px' };
const GeneralTab = ({ formik }: any) => {
  const values = formik.values;
  const couponType = () => {
    if (values.discountType === 'percentageCartDiscount') {
      return { InputLabel: 'Coupon Percentage', name: 'percentage', values: 'percentage' };
    }
    if (values.discountType === 'fixedCartDiscount') {
      return { InputLabel: 'Coupon Amount', name: 'amount', values: 'amount' };
    }
  };
  console.log(values);
  return (
    <>
      <Stack direction="row">
        <InputLabel sx={Inputfeild}>Discount type :</InputLabel>
        <FormControl sx={{ width: '60%' }}>
          <Select input={<BootstrapInput />} value={values.discountType} name="discountType" onChange={formik.handleChange}>
            <MenuItem value="fixedCartDiscount">Fixed cart discount</MenuItem>
            <MenuItem value="percentageCartDiscount">percentage cart discount</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <Stack direction="row">
        {couponType() && (
          <>
            <InputLabel sx={Inputfeild}>{couponType()?.InputLabel}</InputLabel>
            <FormControl sx={{ width: '60%' }}>
              <FastInputField
                style={Fastinputfield}
                type="number"
                name={couponType()?.name}
                value={values[couponType()?.values || '-']}
                onChange={formik.setFieldValue}
              />
            </FormControl>
          </>
        )}
      </Stack>
      <Stack direction="row">
        <InputLabel sx={Inputfeild}>Coupon expiry date :</InputLabel>
        <FormControl sx={{ width: '60%' }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              value={values.couponExpiry}
              onChange={(d) => {
                let date = moment(d).format('YYYY-MM-DDTHH:MM:SSZ');
                formik.setFieldValue('couponExpiry', date);
              }}
              renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
                <TextField {...params} id={'webinarTime'} name={'webinarTime'} />
              )}
            />
          </LocalizationProvider>
        </FormControl>
      </Stack>
    </>
  );
};

export default GeneralTab;
