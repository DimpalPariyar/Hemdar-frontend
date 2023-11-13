import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import axios from '../../utils/axios';
import { BASE_URL } from '../../config';
import AdviceNewUpdateForm from 'components/advisory-form/AdviceNewUpdateForm';
import { openSnackbar } from 'store/reducers/snackbar';
import { useDispatch } from 'store';
import _ from 'lodash';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PublishIcon from '@mui/icons-material/Publish';
import { IconButton, Stack, Tooltip } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
const UpdateChatAdviceStatus = ({ advice, selected, setselected, setadvicerefetch }: any) => {
  const [spinner, setspinner] = useState(false);
  const dispatch = useDispatch();
  const updateAdvice = async (data: any, { resetForm }: any) => {
    const updateNotification: any = _.last(data.updates);
    try {
      if (updateNotification.newStatus || updateNotification.price || updateNotification.remarks) {
        setspinner(true);
        updateNotification.remarks = updateNotification.notificationBody
        await axios.put(`${BASE_URL}/advisory/advice-grid/${advice._id}`, updateNotification);
      }

      // else {
      //   await axios.put(`${BASE_URL}/advisory/advice/${advice._id}`, data);
      // }

      dispatch(
        openSnackbar({
          open: true,
          message: 'Advice Updated',
          variant: 'alert',
          alert: {
            color: 'success'
          }
        })
      );
      resetForm({ data: '' });
      setspinner(false);
      setadvicerefetch(true);
    } catch (error) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Unable to update the Advice',
          variant: 'alert',
          alert: {
            color: 'error'
          }
        })
      );
    }
  };
  const formik = useFormik({
    initialValues: {
      newStatus: '',
      price: '',
      remarks: '',
      notificationTitle: '',
      notificationBody: '',
      typeOfNotification: ''
    },
    onSubmit: updateAdvice
  });
  useEffect(() => {
    formik.setValues(advice);
    advice?.updates.push({
      newStatus: 'bookProfit',
      price: '',
      remarks: '',
      notificationTitle: `${advice?.nameOfUnderlying ? advice?.nameOfUnderlying : ''} ${
        advice?.expiry ? `${advice?.expiry.split('-')[0]} ${advice?.expiry.split('-')[1]}` : ''
      } ${advice?.optionStrike ? advice?.optionStrike : ''} ${advice?.optionType ? advice?.optionType : ''}`,
      notificationBody: '',
      typeOfNotification: '64b7bc4d769c5b12126bf5ad'
    });
  }, [advice]);
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.shiftKey && event.key === 'Enter') {
      // Call your update function here
      formik.submitForm() 
    }
  };
  useEffect(() => {
    // Add an event listener when the component mounts
    document.addEventListener('keydown', handleKeyPress);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []); // Empty dependency array to ensure the effect runs once

  const values: any = formik.values;
  return (
    <div>
      <Stack direction="row" justifyContent="space-between" padding={1} sx={{ height: '30px' }}>
        <Tooltip title="back">
          <IconButton onClick={() => setselected(!selected)}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Update Advice">
          <IconButton onClick={() => formik.submitForm()}>
            <PublishIcon />
          </IconButton>
        </Tooltip>
        {spinner && <CircularProgress />}
      </Stack>
      <AdviceNewUpdateForm formik={formik} />
    </div>
  );
};

export default UpdateChatAdviceStatus;
