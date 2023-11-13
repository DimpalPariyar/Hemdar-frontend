import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { couponIntialvalues } from './constant';
import AddCoupon from 'components/coupon-form/add-coupons/AddCoupon';
import GeneralTab from 'components/coupon-form/add-coupons/GeneralTab';
import { BASE_URL } from 'config';
import axios from 'utils/axios';
import { Button, InputLabel, Stack } from '@mui/material';
const bgColor = {
  background: 'linear-gradient(103.4deg, #2D00D2 12.04%, #2C00D3 30.87%, #3700C8 46.11%, #3E00C0 63.54%, #4B00B4 80.82%, #5400AA 93.76%)',
  color: ' #FFFFFF',
  borderRadius: '10px',
  width: '150px',
  height: '40px',
  fontSize: '10px'
};
const Offers = ({ email, setrefetchcoupon }: any) => {
  const formik = useFormik({
    initialValues: couponIntialvalues,
    onSubmit: async (data: any) => {
      data = {
        ...data,
        allowedEmail: [email],
        minSpend: 1000,
        maxSpend: 50000,
        notForSaleCoupon: false,
        singleUsedCoupon: false,
        listOfProduct: [],
        excludeProdList: [],
        listOfCategory: [],
        excludeCatList: [],
        redeem: 1,
        enableCoupon: true
      };
      try {
        const response = await axios.post(`${BASE_URL}/coupon`, data);
        alert(response.data.message);
        setrefetchcoupon(true);
      } catch (error) {}
    }
  });
  useEffect(() => {
    formik.setValues(formik.initialValues);
  }, []);
  return (
    <div>
      {' '}
      <AddCoupon formik={formik} />
      <GeneralTab formik={formik} />
      <Stack direction="row" justifyContent="center">
        <Button sx={bgColor} onClick={() => formik.submitForm()}>
          {'Create Coupon'}
        </Button>
      </Stack>
    </div>
  );
};

export default Offers;
