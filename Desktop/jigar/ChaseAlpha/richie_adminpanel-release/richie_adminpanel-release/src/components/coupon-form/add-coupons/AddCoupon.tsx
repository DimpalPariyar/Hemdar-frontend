import { Button, Stack, TextField, Typography } from '@mui/material';
import FastInputField from 'components/FastInputField';
import React, { useEffect, useState } from 'react';
import { getKey } from 'utils/couponkey';

const FastinputfieldStyle = {
  borderRadius: '10px',
  padding: '8px 10px',
  width: '35vw',
  height: '50px',
  m: 2,
  border: '1px solid #2D00D2'
};
const bgColor = {
  background: '#ECEFFF',
  color: '#2D00D2',
  borderRadius: '10px',
  height: '40px',
  width: '200px',
  border: '1px solid #2D00D2',
  position: 'absolute',
  right: '32%'
};

const AddCoupon = ({ formik }: any) => {
  const values: any = formik.values;
  const [key, setkey] = useState('');
  useEffect(() => {
    formik.setValues({
      couponCode: key,
      discountType: 'percentageCartDiscount'
    });
  }, [key]);
  return (
    <>
      <Typography variant="h5" sx={{ m: 3 }}>
        Add New Coupon
      </Typography>
      <Stack direction="row" sx={{ position: 'relative',justifyItems:'center',alignItems:'center'}}>
        <FastInputField
          name="couponCode"
          type="text"
          style={FastinputfieldStyle}
          placeholder="Coupon Code"
          value={values.couponCode}
          onChange={formik.setFieldValue}
        />
        <Button sx={bgColor} onClick={() => setkey(getKey())}>
          Generate Coupon Code
        </Button>
      </Stack>
      <FastInputField
        name="description"
        type="textarea"
        style={FastinputfieldStyle}
        placeholder="Description (Optional)"
        value={values.description}
        onChange={formik.setFieldValue}
      />
    </>
  );
};

export default AddCoupon;
