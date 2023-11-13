// material-ui
import { FormControl, InputLabel, Link, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { FormikProvider, FieldArray } from 'formik';
import { updateForSet } from './constant';
import FastInputField from '../FastInputField';
import SelectField from '../SelectField';
import { statusOptions } from '../../pages/advice-create/constant';
import { useEffect, useState } from 'react';
import axios from 'utils/axios';
import { BASE_URL } from 'config';

// ==============================|| MAIN LOGO ||============================== //

const FastinputfieldStyle = {
  bgcolor: '#ECEFFF',
  borderRadius: '10px',
  padding: '3px 4px',
  '&:hover': {
    border: '1px solid #2D00D2'
  },
  // fontSize: '8px', fontWeight: '400'
};
const AdviceNewUpdateForm = ({ formik }: any) => {
  const { values } = formik;

  const [notification, setNotification] = useState([]);
  const [showoldupdate, setshowoldupdate] = useState(false)
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
  return (
    <Stack direction="column" flex={1} gap={1} marginY={2}>
      <FormikProvider value={formik}>
        <FieldArray
          name="updates"
          render={(arrayHelpers) => {
            return (
              <Stack key={values?._id} flexDirection="column">
                <Stack direction="row" justifyContent="center">
                  {
                    <>
                      <Link onClick={() => setshowoldupdate(!showoldupdate)}>
                        {values?.updates?.length}
                        {` Updates`}{``}
                      </Link>
                    </>
                  }
                </Stack>
                {values?.updates?.map((plan: any, index: any) => {
                  const isNew = values?.updates.length - 1 === index;
                  if (!isNew && !showoldupdate) {
                    return <></>;
                  }
                  return (
                    <>
                      <Box key={index} display="flex" gap={3} flexWrap="wrap" paddingLeft={2}>
                        <Stack direction="column" flexWrap="wrap">
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="h5">{`Update - ${index + 1}`}</Typography>
                          </Stack>
                          <Stack direction="row" gap={1} flexWrap="wrap">
                            {updateForSet.map((field: any) => {
                              const handleChange = (name: string, value: any) => {
                                formik.setFieldValue(name, value);
                              };
                              return field.type === 'status' ? (
                                <Stack key={field.name} direction="column" spacing={1} width={130}>
                                  <InputLabel sx={{ mt: 0.5, fontSize: '11px', fontWeight: '800' }}>Status</InputLabel>
                                  <Stack>
                                    <SelectField
                                      options={statusOptions}
                                      value={plan[field.name]}
                                      onChange={formik.handleChange}
                                      name={`updates[${index}].${field.name}`}
                                      shouldDisable={!isNew}
                                    />
                                  </Stack>
                                </Stack>
                              ) : (
                                <Stack key={field.name} spacing={1} width={100}>
                                  <InputLabel sx={{ mt: 0.5, fontSize: '11px', fontWeight: '800' }}>{field.label}</InputLabel>
                                  <FormControl>
                                    <FastInputField
                                      style={FastinputfieldStyle}
                                      type={field.type}
                                      value={plan[field.name]}
                                      onChange={handleChange}
                                      shouldDisable={!isNew}
                                      name={`updates[${index}].${field.name}`}
                                    />
                                  </FormControl>
                                </Stack>
                              );
                            })}
                            <Stack direction="column" spacing={1} width={160}>
                              <InputLabel sx={{ mt: 0.5, fontSize: '11px', fontWeight: '800' }}>
                                Type of Notification
                              </InputLabel>
                              <SelectField
                                style={FastinputfieldStyle}
                                name={`updates[${index}].typeOfNotification`}
                                options={notification}
                                value={plan?.['typeOfNotification']}
                                onChange={formik.handleChange}
                              />
                            </Stack>
                          </Stack>
                        </Stack>
                        <Stack display="flex" direction="row" gap={1} flexWrap="wrap">
                          <Stack direction="column" spacing={1}>
                            <InputLabel sx={{ mt: 0.5, fontSize: '11px', fontWeight: '800' }}>Notification Title</InputLabel>
                            <FastInputField
                              style={FastinputfieldStyle}
                              name={`updates[${index}].notificationTitle`}
                              type="text"
                              value={plan['notificationTitle']}
                              onChange={formik.setFieldValue}
                              shouldDisable={!isNew}
                            />
                          </Stack>
                          <Stack direction="column" spacing={1}>
                            <InputLabel sx={{ mt: 0.5, fontSize: '11px', fontWeight: '800' }}>Notification Body</InputLabel>
                            <FastInputField
                              multiline
                              row={3}
                              style={FastinputfieldStyle}
                              name={`updates[${index}].notificationBody`}
                              type="text"
                              value={plan['notificationBody']}
                              onChange={formik.setFieldValue}
                              shouldDisable={!isNew}
                            />
                          </Stack>
                        </Stack>

                        {/* <Stack display="flex" direction="row" gap={1} marginY={2}>
                          <Stack direction="column" spacing={1} my={1} >
                            <InputLabel sx={{ mt: 0.5 }}>Notification Title (non-subscriber)</InputLabel>
                            <FastInputField
                              style={FastinputfieldStyle}
                              name={`updates[${index}].unSubNotificationTitle`}
                              type="text"
                              value={plan['unSubNotificationTitle']}
                              onChange={formik.setFieldValue}
                              shouldDisable={!isNew}
                            />
                          </Stack>
                          <Stack direction="column" spacing={1} my={1} >
                            <InputLabel sx={{ mt: 0.5 }}>Notification Body (non-subscriber)</InputLabel>
                            <FastInputField
                              style={FastinputfieldStyle}
                              name={`updates[${index}].unSubNotificationBody`}
                              type="text"
                              value={plan['unSubNotificationBody']}
                              onChange={formik.setFieldValue}
                              shouldDisable={!isNew}
                            />
                          </Stack>
                        </Stack> */}
                      </Box>
                    </>
                  );
                })}
              </Stack>
            );
          }}
        />
      </FormikProvider>
    </Stack>
  );
};

export default AdviceNewUpdateForm;
