import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import FastInputField from '../FastInputField';
import moment from 'moment';
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
  width: '120px',
  height: '30px'
};
const FastinputfieldStyles = {
  bgcolor: '#ECEFFF',
  borderRadius: '10px',
  padding: '2px 5px',
  '&:hover': {
    border: '1px solid #2D00D2'
    // height: '41px'
  },
  fontSize: '8px',
  width: '70px',
  height: '30px'
};
const AdviceDetailForm = ({ advice }: any) => {
  return (
    <div>
      <Box padding={2}>
        <Stack direction="row" gap={2} justifyContent="space-between">
          <Stack spacing={1} maxWidth="max-content">
            <InputLabel sx={{ mt: 1, fontSize: '12px' }}>Date</InputLabel>
            <FormControl>
              <FastInputField
                style={FastinputfieldStyle}
                name={advice?.date}
                type="text"
                value={moment(advice?.date).format('ll')}
                // placeholder={format(new Date(advice?.date), 'dd MMM yyyy')}
                // onChange={formik.setFieldValue}
              />
            </FormControl>
          </Stack>
          <Stack spacing={1} maxWidth="max-content">
            <InputLabel sx={{ mt: 1, fontSize: '12px' }}>Time</InputLabel>
            <FormControl>
              <FastInputField
                style={FastinputfieldStyle}
                name={advice?.date}
                type="text"
                value={moment(advice?.date).format('LTS')}
                // value={format(new Date(advice?.date), 'hh:mm:ss a')}
                // onChange={formik.setFieldValue}
              />
            </FormControl>
          </Stack>
          <Stack spacing={1} maxWidth="max-content">
            <InputLabel sx={{ mt: 1, fontSize: '12px' }}>Status</InputLabel>
            <FormControl>
              <FastInputField
                style={FastinputfieldStyle}
                name={advice?.status}
                type="text"
                value={advice?.status}
                // onChange={formik.setFieldValue}
              />
            </FormControl>
          </Stack>
        </Stack>
        <Stack direction="row" gap={2} justifyContent="space-between" sx={{ paddingTop: '15px' }}>
          <Stack spacing={1} maxWidth="max-content">
            <InputLabel sx={{ mt: 1, fontSize: '12px' }}>Name of Underlying</InputLabel>
            <FormControl>
              <FastInputField
                style={FastinputfieldStyle}
                name={advice?.nameOfUnderlying}
                type="text"
                value={advice?.nameOfUnderlying}
                // onChange={formik.setFieldValue}
              />
            </FormControl>
          </Stack>
          <Stack spacing={1} maxWidth="max-content">
            <InputLabel sx={{ mt: 1, fontSize: '12px' }}>Option Strike</InputLabel>
            <FormControl>
              <FastInputField
                style={FastinputfieldStyle}
                name={advice?.optionStrike}
                type="text"
                value={advice?.optionStrike}
                // onChange={formik.setFieldValue}
              />
            </FormControl>
          </Stack>
          <Stack spacing={1} maxWidth="max-content">
            <InputLabel sx={{ mt: 1, fontSize: '12px' }}>Option Type</InputLabel>
            <FormControl>
              <FastInputField
                style={FastinputfieldStyle}
                name={advice?.optionType}
                type="text"
                value={advice?.optionType}
                // onChange={formik.setFieldValue}
              />
            </FormControl>
          </Stack>
        </Stack>
        <Stack direction="row" gap={2} justifyContent="space-between" sx={{ paddingTop: '15px' }}>
          <Stack spacing={1} maxWidth="max-content">
            <InputLabel sx={{ mt: 1, fontSize: '12px' }}>Expiry</InputLabel>
            <FormControl>
              <FastInputField
                style={FastinputfieldStyles}
                name={advice?.timeFrame}
                type="text"
                value={advice?.timeFrame}
                // onChange={formik.setFieldValue}
              />
            </FormControl>
          </Stack>
          <Stack spacing={1} maxWidth="max-content">
            <InputLabel sx={{ mt: 1, fontSize: '12px' }}>Action</InputLabel>
            <FormControl>
              <FastInputField
                style={FastinputfieldStyles}
                name={advice?.action}
                type="text"
                value={advice?.action}
                // onChange={formik.setFieldValue}
              />
            </FormControl>
          </Stack>
          <Stack spacing={1} maxWidth="max-content">
            <InputLabel sx={{ mt: 1, fontSize: '12px' }}>Entry Range</InputLabel>
            <FormControl>
              <FastInputField
                style={FastinputfieldStyles}
                name={advice?.entry}
                type="text"
                value={advice?.entry}
                // onChange={formik.setFieldValue}
              />
            </FormControl>
          </Stack>
          <Stack spacing={1} maxWidth="max-content">
            <InputLabel sx={{ mt: 1, fontSize: '12px' }}>Time Frame</InputLabel>
            <FormControl>
              <FastInputField
                style={FastinputfieldStyles}
                name={advice?.timeFrame}
                type="text"
                value={advice?.timeFrame}
                // onChange={formik.setFieldValue}
              />
            </FormControl>
          </Stack>
        </Stack>
        <Stack direction="row" gap={2} justifyContent="space-between" sx={{ paddingTop: '15px' }}>
          <Stack spacing={1} maxWidth="max-content">
            <InputLabel sx={{ mt: 1, fontSize: '12px' }}>StopLoss</InputLabel>
            <FormControl>
              <FastInputField
                style={FastinputfieldStyles}
                name={advice?.stopLoss}
                type="text"
                value={advice?.stopLoss}
                // onChange={formik.setFieldValue}
              />
            </FormControl>
          </Stack>
          <Stack spacing={1} maxWidth="max-content">
            <InputLabel sx={{ mt: 1, fontSize: '12px' }}>Target1</InputLabel>
            <FormControl>
              <FastInputField
                style={FastinputfieldStyles}
                name={advice?.target1}
                type="text"
                value={advice?.target1}
                // onChange={formik.setFieldValue}
              />
            </FormControl>
          </Stack>
          <Stack spacing={1} maxWidth="max-content">
            <InputLabel sx={{ mt: 1, fontSize: '12px' }}>Target2 </InputLabel>
            <FormControl>
              <FastInputField
                style={FastinputfieldStyles}
                name={advice?.target2}
                type="text"
                value={advice?.target2}
                // onChange={formik.setFieldValue}
              />
            </FormControl>
          </Stack>
          <Stack spacing={1} maxWidth="max-content">
            <InputLabel sx={{ mt: 1, fontSize: '12px' }}>Target3</InputLabel>
            <FormControl>
              <FastInputField
                style={FastinputfieldStyles}
                name={advice?.target3}
                type="text"
                value={advice?.target3}
                // onChange={formik.setFieldValue}
              />
            </FormControl>
          </Stack>
          {/* <Stack spacing={1} maxWidth="max-content">
            <InputLabel sx={{ mt: 1, fontSize: '12px' }}>Risk Reward Ratio</InputLabel>
            <FormControl>
              <FastInputField
                style={FastinputfieldStyle}
                name={advice?.name}
                type="text"
                value={advice?.nameOfUnderlying}
                // onChange={formik.setFieldValue}
              />
            </FormControl>
          </Stack> */}
        </Stack>
        <Stack direction="row" gap={2} justifyContent="space-between" sx={{ paddingTop: '15px' }}>
          <Stack spacing={1} maxWidth="max-content">
            <InputLabel sx={{ mt: 1, fontSize: '12px' }}>Product</InputLabel>
            <FormControl>
              <FastInputField
                style={FastinputfieldStyle}
                name={advice?.product}
                type="text"
                value={advice?.product}
                // onChange={formik.setFieldValue}
              />
            </FormControl>
          </Stack>
          <Stack spacing={1} maxWidth="max-content">
            <InputLabel sx={{ mt: 1, fontSize: '12px' }}>Product Type</InputLabel>
            <FormControl>
              <FastInputField
                style={FastinputfieldStyle}
                name={advice?.productType}
                type="text"
                value={advice?.productType}
                // onChange={formik.setFieldValue}
              />
            </FormControl>
          </Stack>
          <Stack spacing={1} maxWidth="max-content">
            <InputLabel sx={{ mt: 1, fontSize: '12px' }}>Instrument</InputLabel>
            <FormControl>
              <FastInputField
                style={FastinputfieldStyle}
                name={advice?.instrument}
                type="text"
                value={advice?.instrument}
                // onChange={formik.setFieldValue}
              />
            </FormControl>
          </Stack>
        </Stack>
      </Box>
    </div>
  );
};

export default AdviceDetailForm;
