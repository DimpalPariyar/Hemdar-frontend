// material-ui

import React, { useEffect, useState } from 'react';
import { Button, FormControlLabel, InputLabel, Stack } from '@mui/material';
import Switch from 'components/Switch';
import { useFormik } from 'formik';
import { initialValues } from './constant';
import axios from '../../utils/axios';
import { BASE_URL } from '../../config';
import SelectField from '../../components/SelectField';
import FastInputField from '../../components/FastInputField';
import ImageUpload from 'pages/advice-create/ImageUpload';

const FastinputfieldStyle = {
  bgcolor: '#ECEFFF',
  borderRadius: '10px',
  padding: '8px 10px',
  '&:hover': {
    border: '1px solid #2D00D2'
  }
};
const FastTextareainputfieldStyle = {
  bgcolor: '#ECEFFF',
  borderRadius: '10px',
  padding: '8px 10px',
  '&:hover': {
    border: '1px solid #2D00D2'
  }
};

interface Props {
  onSubmit: (data: any) => Promise<void>;
}

const NotificationForm = ({ onSubmit }: Props) => {
  const [products, setProducts] = useState<any>([]);

  const [notification, setNotification] = useState([]);
  const init = async () => {
    try {
      await axios.get(`${BASE_URL}/notification/getall/types`).then((data) => {
        const notificationOption = data.data.map((item: any) => {
          return {
            value: item._id,
            label: item.typeofNotification
          };
        });
        setNotification(notificationOption);
      });
    } catch (error) {}
  };
  const handleNotificationSelect = (e: any) => {
    const value = e.target.value;
    formik.setValues({
      ...values,
      typeOfNotification: value
    });
  };

  useEffect(() => {
    init();
    getProducts();
  }, []);

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit
  });

  const advisory = products.map((data: any) => ({ value: data._id, label: data.productTitle }));

  const values: any = formik.values;
  const getProducts = async () => {
    try {
      await axios.get(`${BASE_URL}/advisory/product`).then((response: any) => {
        const products = response.data || [];
        setProducts(products);
      });
    } catch (error) {
      setProducts([]);
    }
  };
  return (
    <Stack direction="column">
      <Stack display="flex" direction="row" gap={1} marginY={2}>
        <Stack direction="column" spacing={1} my={1} width={360}>
          <InputLabel sx={{ mt: 1 }}>Notification Title</InputLabel>
          <FastInputField name="title" type="text" value={values['title']} onChange={formik.setFieldValue} sx={FastinputfieldStyle} />
        </Stack>
        <Stack direction="column" spacing={1} my={1} width={660}>
          <InputLabel sx={{ mt: 1 }}>Notification Body</InputLabel>
          <FastInputField
            name="body"
            multiline
            row={3}
            value={values['body']}
            onChange={formik.setFieldValue}
            sx={FastTextareainputfieldStyle}
          />
        </Stack>
        <Stack direction="column" spacing={1} my={1} width={660}>
          <InputLabel sx={{ mt: 1 }}>Type of Notification (subscriber)</InputLabel>
          <SelectField
            options={notification}
            value={values?.['typeOfNotification']}
            onChange={handleNotificationSelect}
            name="typeOfNotification"
          />
        </Stack>
      </Stack>
      <Stack direction="row">
        <FormControlLabel
          control={
            <Switch
              checked={values.everyone}
              checkedLabel="Everyone"
              unCheckedLabel="Subscribed User Only"
              onChange={() => formik.setFieldValue('everyone', !values.everyone)}
            />
          }
          label={values.everyone ? 'Everyone' : 'Subscribed User Only'}
        />
        {values.everyone ? (
          <></>
        ) : (
          <Stack spacing={1} width={260}>
            <InputLabel sx={{ mt: 1 }}>Send for Subscribed Users Only</InputLabel>
            <SelectField
              options={advisory}
              value={values.advisoryId}
              onChange={(e: any, value: any) => {
                values.targetaudience = advisory.filter((x: any) => x.value === e.target.value)[0].label;
                values.advisoryId = value.props.value;
              }}
            />
          </Stack>
        )}
      </Stack>
      <Stack direction="row" spacing={1}>
        <Stack direction="column" spacing={1} my={1} width={560}>
          <InputLabel sx={{ mb: 1, minWidth: 58 }}>Image</InputLabel>
          <ImageUpload name="notificationImage" formik={formik} />
        </Stack>
        <Stack direction="column" spacing={1} width={660}>
          <InputLabel sx={{ mt: 1, mb: 1 }}>Url link</InputLabel>
          <FastInputField
            name="url"
            multiline
            row={3}
            value={values['url']}
            onChange={formik.setFieldValue}
            sx={FastTextareainputfieldStyle}
          />
        </Stack>
      </Stack>
      <Stack display="flex" direction="row" justifyContent="flex-end" flexWrap="wrap" gap={2}>
        <Button variant="contained" onClick={() => formik.submitForm()}>
          Flash
        </Button>
      </Stack>
    </Stack>
  );
};
export default NotificationForm;
