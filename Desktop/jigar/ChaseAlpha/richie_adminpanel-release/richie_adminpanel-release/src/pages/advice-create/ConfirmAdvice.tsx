import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, InputLabel, Stack } from '@mui/material';

const ConfirmAdvice = ({ formik, handleClose, open }: any) => {
  return (
    <>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title" sx={{ textAlign: 'center' }}>
          Create Advice
        </DialogTitle>
        <DialogContent sx={{ position: 'relative' }}>
          <Stack direction="row" gap={2}>
            <InputLabel sx={{ fontSize: '18px', fontWeight: 800, mt: 2 }}>Name of UnderLying :</InputLabel>
            <InputLabel sx={{ fontSize: '15px', mt: 2 }}>{formik.values?.nameOfUnderlying}</InputLabel>
          </Stack>
          <Stack direction="row" gap={2}>
            <InputLabel sx={{ fontSize: '18px', fontWeight: 800, mt: 2 }}>Expiry :</InputLabel>
            <InputLabel sx={{ fontSize: '15px', mt: 2 }}>{formik.values?.expiry}</InputLabel>
          </Stack>
          <Stack direction="row" gap={2}>
            <InputLabel sx={{ fontSize: '18px', fontWeight: 800, mt: 2 }}>Action :</InputLabel>
            <InputLabel sx={{ fontSize: '15px', mt: 2 }}>{formik.values?.action}</InputLabel>
          </Stack>
          <Stack direction="row" gap={2}>
            <InputLabel sx={{ fontSize: '18px', fontWeight: 800, mt: 2 }}>Entry Range Lower Range :</InputLabel>
            <InputLabel sx={{ fontSize: '15px', mt: 2 }}>{formik.values?.entryLowerRange}</InputLabel>
          </Stack>

          <Stack direction="row" gap={2}>
            <InputLabel sx={{ fontSize: '18px', fontWeight: 800, mt: 2 }}>Entry Range Upper Range :</InputLabel>
            <InputLabel sx={{ fontSize: '15px', mt: 2 }}>{formik.values?.entryUpperRange}</InputLabel>
          </Stack>
          <Stack direction="row" gap={2}>
            <InputLabel sx={{ fontSize: '18px', fontWeight: 800, mt: 2 }}>Current Cmp :</InputLabel>
            <InputLabel sx={{ fontSize: '15px', mt: 2 }}>{formik.values?.cmp}</InputLabel>
          </Stack>
          <Stack direction="row" gap={2}>
            <InputLabel sx={{ fontSize: '18px', fontWeight: 800, mt: 2 }}>Stop Loss :</InputLabel>
            <InputLabel sx={{ fontSize: '15px', mt: 2 }}>{formik.values?.stopLoss}</InputLabel>
          </Stack>
          <Stack direction="row" gap={2}>
            <InputLabel sx={{ fontSize: '18px', fontWeight: 800, mt: 2 }}>Target 1 :</InputLabel>
            <InputLabel sx={{ fontSize: '15px', mt: 2 }}>{formik.values?.target1}</InputLabel>
          </Stack>
          <Stack direction="row" gap={2}>
            <InputLabel sx={{ fontSize: '18px', fontWeight: 800, mt: 2 }}>Remark :</InputLabel>
            <InputLabel sx={{ fontSize: '15px', mt: 2 }}>{formik.values?.remarks}</InputLabel>
          </Stack>
          <Stack direction="row" gap={2}>
            <InputLabel sx={{ fontSize: '18px', fontWeight: 800, mt: 2 }}>Notification Title :</InputLabel>
            <InputLabel sx={{ fontSize: '15px', mt: 2 }}>{formik.values?.notificationTitle}</InputLabel>
          </Stack>
          <Stack direction="row" gap={2}>
            <InputLabel sx={{ fontSize: '18px', fontWeight: 800, mt: 2 }}>Notification Body :</InputLabel>
            <InputLabel sx={{ fontSize: '15px', mt: 2 }}>{formik.values?.notificationBody}</InputLabel>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              return formik.submitForm();
            }}
          >
            Flash Trade
          </Button>
          <Button onClick={handleClose}>No</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmAdvice;
