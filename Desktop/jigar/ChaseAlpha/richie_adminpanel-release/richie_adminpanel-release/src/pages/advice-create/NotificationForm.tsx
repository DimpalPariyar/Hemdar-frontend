import { InputLabel, Stack } from '@mui/material';
import FastInputField from 'components/FastInputField';
import SelectField from 'components/SelectField';
import { useEffect, useState } from 'react';
import axios from 'utils/axios';
import { BASE_URL } from 'config';

const NotificationForm = ({ values, formik, isUpdateMode }: any) => {
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
  useEffect(() => {
    init();
  }, []);
  const FastinputfieldStyle = {
    bgcolor: '#ECEFFF',
    borderRadius: '10px',
    padding: '8px 10px',
    '&:hover': {
      border: '1px solid #2D00D2'
    }
  };

  const handleNotificationSelect = (e: any) => {
    const value = e.target.value;
    formik.setValues({
      ...values,
      typeOfNotification: value
    });
  };

  return (
    <>
      <Stack display="flex" direction="row" gap={1} marginY={2}>
        <Stack direction="column" spacing={1} my={1} width={360}>
          <InputLabel sx={{ mt: 1 }}>Notification Title (subscriber)</InputLabel>
          <FastInputField
            style={FastinputfieldStyle}
            name="notificationTitle"
            type="text"
            value={values?.['notificationTitle']}
            onChange={formik.setFieldValue}
            shouldDisable={isUpdateMode}
          />
        </Stack>
        <Stack direction="column" spacing={1} my={1} width={660}>
          <InputLabel sx={{ mt: 1 }}>Notification Body (subscriber)</InputLabel>
          <FastInputField
            style={FastinputfieldStyle}
            name="notificationBody"
            type="text"
            value={values?.['notificationBody']}
            onChange={formik.setFieldValue}
            shouldDisable={isUpdateMode}
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
      <Stack display="flex" direction="row" gap={1} marginY={2}>
        <Stack direction="column" spacing={1} my={1} width={360}>
          <InputLabel sx={{ mt: 1 }}>Notification Title (non-subscriber)</InputLabel>
          <FastInputField
            style={FastinputfieldStyle}
            name="unSubNotificationTitle"
            type="text"
            value={values?.['unSubNotificationTitle']}
            onChange={formik.setFieldValue}
            // shouldDisable={isUpdateMode}
          />
        </Stack>
        <Stack direction="column" spacing={1} my={1} width={660}>
          <InputLabel sx={{ mt: 1 }}>Notification Body (non-subscriber)</InputLabel>
          <FastInputField
            style={FastinputfieldStyle}
            name="unSubNotificationBody"
            type="text"
            value={values?.['unSubNotificationBody']}
            onChange={formik.setFieldValue}
            // shouldDisable={isUpdateMode}
          />
        </Stack>
      </Stack>
    </>
  );
};

export default NotificationForm;
