import { Button } from '@mui/material';
import { FormControl, InputLabel, Stack } from '@mui/material';
import FastInputField from 'components/FastInputField';
import React from 'react';
import axios from '../../utils/axios';
import { BASE_URL } from '../../config';
import { useFormik } from 'formik';
const FastinputfieldStyle = {
  bgcolor: '#ECEFFF',
  borderRadius: '10px',
  padding: '2px 5px',
  '&:hover': {
    border: '1px solid #2D00D2'
    // height: '41px'
  },
  width: '500px',
  height: '100px'
};
const bgColor = {
  background: 'linear-gradient(103.4deg, #2D00D2 12.04%, #2C00D3 30.87%, #3700C8 46.11%, #3E00C0 63.54%, #4B00B4 80.82%, #5400AA 93.76%)',
  color: ' #FFFFFF',
  borderRadius: '10px',
  width: '150px',
  height: '40px',
  fontSize:'9px'
};
const Engagement = ({ data ,setrefetchWhatsapp}: any) => {
  console.log(data);
  const formik = useFormik({
    initialValues: {
      body: ''
    },
    onSubmit: async (whatsappdata: any, { resetForm }: any) => {
      whatsappdata = {
        body: whatsappdata.body,
        number: data?.mobile,
        userId: data?._id
      };
      const response = await axios.post(`${BASE_URL}/admin/onetooneWhatsapp`, whatsappdata);
      if (response.data) {
        console.log(response);
        alert(response.data.message)
        resetForm();
        setrefetchWhatsapp(true)
      }
    }
  });
  const values: any = formik.values;
  return (
    <div>
      <Stack direction="column" gap={2} alignItems="left">
        <InputLabel>Whatsapp Message Body :</InputLabel>
        <FormControl>
          <FastInputField
            style={FastinputfieldStyle}
            name="body"
            type="text"
            multiline
            row={3}
            value={values.body}
            placeholder="Write Your Message Here !!"
            onChange={formik.setFieldValue}
          />
        </FormControl>
        <Button sx={bgColor} onClick={() => formik.submitForm()}>
          Send Whatsapp Message
        </Button>
      </Stack>
    </div>
  );
};

export default Engagement;
