import { Box, Stack } from '@mui/system';
import React, { useEffect } from 'react';
import AddCoupon from './AddCoupon';
import CouponData from './CouponData';
import PdfDocument from './PdfDocument';
import { useFormik } from 'formik';
import { initialvalues } from './constant';
import { Button } from '@mui/material';

interface Props {
  onSubmit: (data: any) => Promise<void>;
  defaultState?: any;
}

const CouponFrom = ({ defaultState, onSubmit }: any) => {
  const formik = useFormik({
    initialValues: defaultState || initialvalues,
    onSubmit
  });
  useEffect(() => {
    formik.setValues(formik.initialValues);
  }, []);
  return (
    <>
      <Stack direction="row">
        <Box width="65%" m={1} sx={{ bgcolor: 'white' }}>
          <AddCoupon formik={formik} />
        </Box>
        <Box width="35%" m={1} sx={{ bgcolor: 'white' }}>
          <PdfDocument />
        </Box>
      </Stack>
      <CouponData formik={formik} />
      <Stack display="flex" direction="row" justifyContent="flex-end" flexWrap="wrap" gap={2}>
        <Button href="/coupons-list" variant="text" color="secondary">
          Cancel
        </Button>
        <Button variant="contained" onClick={() => formik.submitForm()}>
          {defaultState ? 'Update' : 'Save'}
        </Button>
      </Stack>
    </>
  );
};

export default CouponFrom;
