import { Button, Stack, InputLabel, FormControl } from '@mui/material';
import { Formset, initialValues } from './constant';
import FastInputField from 'components/FastInputField';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const FastinputfieldStyle = {
  bgcolor: '#ECEFFF',
  borderRadius: '10px',
  padding: '8px 10px',
  '&:hover': {
    border: '1px solid #2D00D2',
    height: '41px'
  }
};
const bgColor = {
  background: 'linear-gradient(103.4deg, #2D00D2 12.04%, #2C00D3 30.87%, #3700C8 46.11%, #3E00C0 63.54%, #4B00B4 80.82%, #5400AA 93.76%)',
  color: ' #FFFFFF',
  borderRadius: '10px',
  marginBottom: '5px'
};

interface Props {
  onSubmit: (data: any) => Promise<void>;
  defaultState?: any;
}
const NotifyTypesForm = ({ onSubmit }: Props) => {
  const formik = useFormik({
    initialValues: initialValues,
    validate: (values) => {
      let errors: any = {};
      if (!values.typeofNotification) {
        errors.typeofNotification = 'Required!';
      }
      if (!values.notificationDescription) {
        errors.notificationDescription = 'Required!';
      }

      return errors;
    },
    onSubmit
  });

  const values: any = formik.values;
  return (
    <div>
      <Stack direction="row" sx={{ justifyContent: 'space-evenly' }}>
        {Formset &&
          Formset.map((items) => {
            return (
              <div key={items.name} style={{ display: 'flex', flexDirection: 'row', gap: '15px' }}>
                <InputLabel sx={{ mt: 1, pt: 1, fontSize: '16px' }}>{items.label}:</InputLabel>
                <FormControl>
                  {items.name === 'typeofNotification' && (
                    <>
                      <FastInputField
                        style={FastinputfieldStyle}
                        name={items.name}
                        type={items.type}
                        value={values[items.name]}
                        onChange={formik.setFieldValue}
                      />
                      {formik.errors.typeofNotification && <div style={{ color: 'red' }}>{formik.errors.typeofNotification}</div>}
                    </>
                  )}
                  {items.name === 'notificationDescription' && (
                    <>
                      <FastInputField
                        style={FastinputfieldStyle}
                        name={items.name}
                        type={items.type}
                        value={values[items.name]}
                        onChange={formik.setFieldValue}
                      />
                      {formik.errors.typeofNotification && <div style={{ color: 'red' }}>{formik.errors.typeofNotification}</div>}
                    </>
                  )}
                  {items.name === 'notificationLimit' && (
                    <>
                      <FastInputField
                        style={FastinputfieldStyle}
                        name={items.name}
                        type={items.type}
                        value={values[items.name]}
                        onChange={formik.setFieldValue}
                        // shouldDisable={!isPermited}
                      />
                    </>
                  )}
                </FormControl>
              </div>
            );
          })}
      </Stack>
      <Stack direction="row" sx={{ justifyContent: 'center', marginTop: '30px' }}>
        <Button
          sx={bgColor}
          onClick={() => {
            formik.submitForm().then(() => {
              formik.resetForm();
            });
          }}
        >
          Create Types of Notification
        </Button>
      </Stack>
    </div>
  );
};

export default NotifyTypesForm;
