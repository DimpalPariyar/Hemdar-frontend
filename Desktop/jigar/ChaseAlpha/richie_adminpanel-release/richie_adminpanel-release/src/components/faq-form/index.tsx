// material-ui
import { Button, FormControl, InputLabel, Stack } from '@mui/material';
import { useFormik } from 'formik';
import ArticlesForm from './ArticlesForm';
import { firstFormSet, initialValues } from './constant';
import { useEffect } from 'react';
import FastInputField from '../FastInputField';

// ==============================|| MAIN LOGO ||============================== //

interface Props {
  onSubmit: (data: any) => Promise<void>;
  defaultState?: any;
}

const AdvisoryForm = ({ defaultState, onSubmit }: Props) => {
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit
  });

  useEffect(() => {
    formik.setValues(defaultState || initialValues);
  }, [defaultState]);

  const values: any = formik.values;

  const FastinputfieldStyle = {
    bgcolor: '#ECEFFF',
    borderRadius: '10px',
    padding: '8px 10px',
    '&:hover': {
      border: '1px solid #2D00D2'
    }
  };

  return (
    <Stack direction="column" gap={1} marginY={2}>
      <Stack direction="column">
        <Stack direction="row" flexWrap="wrap" gap={2}>
          {firstFormSet.map((field) => (
            <Stack key={field.name} spacing={1} width={340}>
              <InputLabel sx={{ mt: 1 }}>{field.label}</InputLabel>
              <FormControl>
                <FastInputField style={FastinputfieldStyle} name={field.name} value={values[field.name]} onChange={formik.setFieldValue} />
              </FormControl>
            </Stack>
          ))}
        </Stack>
      </Stack>
      <ArticlesForm formik={formik} />
      <Stack display="flex" direction="row" justifyContent="flex-end" flexWrap="wrap" gap={2}>
        <Button href="/advisory" variant="text" color="secondary">
          Cancel
        </Button>
        <Button variant="contained" onClick={() => formik.submitForm()}>
          {defaultState ? 'Update' : 'Save'}
        </Button>
      </Stack>
    </Stack>
  );
};

export default AdvisoryForm;
