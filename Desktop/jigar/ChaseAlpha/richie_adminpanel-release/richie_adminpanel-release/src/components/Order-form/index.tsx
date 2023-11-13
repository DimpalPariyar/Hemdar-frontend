import { useFormik } from 'formik';
import { Box, FormControl, InputBase, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { orderDetails, initialValues, paymentDetails } from './constant';
import FastInputField from '../FastInputField';
import DateTimeComponent from './DateTimeComponent';
import { styled } from '@mui/system';
import PdfAccordion from './PdfAccordion';
import PaymentDetails from './PaymentDetails';
import TableDetails from './TableDetails';
import { Button } from '@mui/material';
import { useState } from 'react';
import axios from '../../utils/axios';
import { BASE_URL } from 'config';

const LongdescriptionStyles = {
  height: '62px',
  background: '#ECEFFF',
  width: '334px',
  borderRadius: '10px'
};

const buttonBackgroud =
  'linear-gradient(103.4deg, #2D00D2 12.04%, #2C00D3 30.87%, #3700C8 46.11%, #3E00C0 63.54%, #4B00B4 80.82%, #5400AA 93.76%)';
const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3)
  },
  '& .MuiInputBase-input': {
    width: 280,
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

const Inputfeild = { mt: 1, width: '150px', padding: '10px', fontSize: '15px', fontWeight: '700' };

interface Props {
  onSubmit: (data: any) => Promise<void>;
  defaultState?: any;
}

const OrderForm = ({ defaultState, onSubmit }: Props) => {
  const [productValue, setProductValue] = useState<any>([]);
  const [fetchData, setfetchData] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: defaultState || initialValues,
    onSubmit
  });

  const values: any = formik.values;

  if (productValue?.plans) {
    let val = productValue.plans.map((x: any) => x.validityPeriodInDays);
    values.duration = val[0];
  }
  const fetchEmail = async () => {
    try {
      const data = {
        email: values.email
      };
      const response = await axios.post(`${BASE_URL}/admin/getUserdetail`, data);
      values.name = response?.data?.name;
      values.mobile = response?.data?.mobile;
      values.address = response?.data?.address;
      values.UserId = response.data.userId;
      if (response.data.name) {
        setfetchData(true);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      <Box sx={{ background: 'white', mb: 1 }}>
        <Typography variant="h4" sx={{ p: 1 }}>
          Order Details
        </Typography>
        <Typography variant="h6" sx={{ p: 1 }}>
          Payment via card/debit card/Netbanking
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={2} sx={{ p: 2, position: 'relative' }}>
          <DateTimeComponent formik={formik} />
          <Stack direction="row" sx={{ position: 'absolute', right: '22%' }}>
            <InputLabel sx={Inputfeild}>Address</InputLabel>
            <FormControl>
              <FastInputField
                multiline
                rows={3}
                name="address"
                value={values?.billingId?.address || ''}
                onChange={formik.setFieldValue}
                style={LongdescriptionStyles}
              />
            </FormControl>
          </Stack>

          {orderDetails.map((field: any, index: any) => {
            if (field.name === 'status') {
              const options = [
                { value: 'created', label: 'Created' },
                { value: 'paid', label: 'Paid' },
                { value: 'refunded', label: 'refunded' }
              ];
              const value = `${values?.[field.name]}`;
              return (
                <Stack key={index} spacing={1} direction="row" sx={{ width: '45%' }}>
                  <InputLabel sx={Inputfeild}>{field.label}</InputLabel>
                  <FormControl>
                    <Select input={<BootstrapInput />} id={field.name} value={value} onChange={formik.handleChange} name={field.name}>
                      {options.map((option: any) => (
                        <MenuItem value={option.value} key={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              );
            } else {
              return (
                <>
                  <Stack direction="row" key={field.name} sx={{ width: '45%' }}>
                    <InputLabel sx={Inputfeild}>{field.label}</InputLabel>
                    <FormControl>
                      {/* <FastInputField multiline rows={3} type={field.type} name={field.name} value={values?.userId?.[field.name]} onChange={formik.setFieldValue} style={FastinputfieldStyle} /> */}

                      <TextField
                        type={field.type}
                        name={field.name}
                        value={values?.userId?.[field.name]}
                        onChange={(e) => formik.setFieldValue(field.name, e.target.value)}
                      />
                      {field.name === 'email' && (
                        <Button sx={{ m: 1 }} variant="contained" color={fetchData ? 'success' : 'info'} onClick={fetchEmail}>
                          {fetchData ? 'Data fetched' : 'fetch data'}
                        </Button>
                      )}
                    </FormControl>
                  </Stack>
                </>
              );
            }
          })}
          {paymentDetails.map((field: any) => {
            return (
              <>
                <Stack direction="row" key={field.name} sx={{ width: '45%' }}>
                  <InputLabel sx={Inputfeild}>{field.label}</InputLabel>
                  <FormControl>
                    {/* <FastInputField multiline rows={3} type={field.type} name={field.name} value={values?.userId?.[field.name]} onChange={formik.setFieldValue} style={FastinputfieldStyle} /> */}

                    <TextField
                      type={field.type}
                      name={field.name}
                      value={values?.userId?.[field.name]}
                      onChange={(e) => formik.setFieldValue(field.name, e.target.value)}
                    />
                  </FormControl>
                </Stack>
              </>
            );
          })}
        </Stack>
      </Box>
      <PdfAccordion formik={formik} />
      {defaultState && <PaymentDetails formik={formik} />}
      <TableDetails formik={formik} productValue={productValue} setProductValue={setProductValue} defaultState={defaultState} />
      <Stack display="flex" direction="row" justifyContent="center" flexWrap="wrap" gap={2}>
        <Button
          sx={{ color: '#000000', fontSize: '16px', fontWeight: '700', width: '90px', height: '40px' }}
          href="/orders"
          variant="text"
          color="secondary"
        >
          Cancel
        </Button>
        <Button
          sx={{ color: 'white', background: `${buttonBackgroud}`, width: '90px', height: '40px', fontSize: '16px', fontWeight: '700' }}
          variant="contained"
          onClick={() => formik.submitForm()}
        >
          {defaultState ? 'Update' : 'Save'}
        </Button>
      </Stack>
    </div>
  );
};

export default OrderForm;
