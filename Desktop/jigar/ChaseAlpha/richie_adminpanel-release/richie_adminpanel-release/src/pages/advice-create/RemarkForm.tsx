import { InputLabel, Stack } from '@mui/material';
import FastInputField from 'components/FastInputField';
import SelectField from 'components/SelectField';
import { statusOptions, updateTypeOptions } from './constant';
import ImageUpload from './ImageUpload';
import { useEffect, useRef } from 'react';

const RemarkForm = ({ values, formik, isUpdateMode, isPermited }: any) => {
  const FastinputfieldStyle = {
    bgcolor: '#ECEFFF',
    borderRadius: '10px',
    padding: '8px 10px',
    '&:hover': {
      border: '1px solid #2D00D2'
    }
  };
  const remarkfieldref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (remarkfieldref.current) {
      remarkfieldref.current.focus();
    }
  }, []);
  return (
    <Stack direction="row" justifyContent="space-between" mt={4} alignItems="center" gap={2}>
      <Stack direction="column">
        <Stack direction="row" spacing={1} my={1} width={350}>
          <InputLabel sx={{ mt: 1, minWidth: 58 }}>Internal Remark</InputLabel>
          <FastInputField
            style={FastinputfieldStyle}
            multiline
            rows={3}
            name="remarks"
            value={values?.remarks}
            onChange={formik.setFieldValue}
            shouldDisable={!isPermited}
            innerRef={remarkfieldref}
          />
        </Stack>
        {/* {isUpdateMode ? (
          <></>
        ) : (
         
        )} */}
        <Stack direction="row" spacing={1} my={1} width={560}>
          <InputLabel sx={{ mb: 1, minWidth: 58 }}>Chart</InputLabel>
          <ImageUpload name="internalChart" formik={formik} />
          {/* {values.internalChart === '' || values.internalChart === undefined || values.internalChart[0]?.path !== undefined ? (
              
            ) : (
              <img style={{ width: '500px', height: '300px' }} src={values.internalChart} alt="chart" loading="lazy" />
            )} */}
        </Stack>
      </Stack>
      <Stack>
        <Stack direction="row" spacing={1} my={1} width={360}>
          <InputLabel sx={{ mt: 1, mr: 1 }}>Status</InputLabel>
          <Stack width={260}>
            <SelectField
              options={statusOptions}
              value={values?.status}
              onChange={formik.handleChange}
              name="status"
              shouldDisable={!isPermited}
            />
          </Stack>
        </Stack>
        <Stack direction="row" spacing={1} my={1} width={360}>
          <InputLabel sx={{ mt: 1, mr: 1 }}>Update</InputLabel>
          <Stack width={260}>
            <SelectField
              options={updateTypeOptions}
              value={values?.updateType}
              onChange={formik.handleChange}
              name="updateType"
              shouldDisable={!isPermited}
            />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default RemarkForm;
