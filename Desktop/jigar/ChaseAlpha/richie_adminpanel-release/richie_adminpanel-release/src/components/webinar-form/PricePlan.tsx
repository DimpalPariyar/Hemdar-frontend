// material-ui
import { FormControl, InputLabel, Stack } from '@mui/material';
import { Box } from '@mui/system';
import { FormikProvider, FieldArray } from 'formik';
import { planFormSet, priceFields } from './constant';
import FastInputField from '../FastInputField';

const PricePlanForm = ({ formik }: any) => {
  const { values } = formik;
  const FastinputfieldStyle = {
    bgcolor: "#ECEFFF", borderRadius: "10px", padding: '8px 10px', "&:hover": {
      border: "1px solid #2D00D2"
    }
  }
  return (
    <Stack direction="column" flex={1} gap={1} marginY={2}>
      <FormikProvider value={formik}>
        <FieldArray
          name="priceIds"
          render={() => {
            return (
              <Box display="flex" gap={3} flexWrap="wrap">
                {planFormSet.map((field: any) => {
                  const handleChange = (name: string, value: any) => {
                    const isPriceField = priceFields.some((v) => name.includes(v));

                    if (isPriceField) {
                      const payload: any = {
                        ...values,
                        [field.name]: value
                      };
                      const discount = Math.abs((1 - payload.discountPercentage / 100 - 1) * 100).toFixed(2);
                      const discountedPrice = (payload.actualPrice - (payload.actualPrice * +discount) / 100).toFixed(2);
                      formik.setFieldValue('discountedPrice', discountedPrice);
                    }
                    formik.setFieldValue(name, value);
                  };
                  return (
                    <Stack key={field.name} sx={{ display: 'flex', flexDirection: 'row', flexGrow: 1 }}>
                      <InputLabel sx={{ mt: 1, width: "170px", padding: '10px', fontSize: '15px', fontWeight: '700' }}>{field.label}</InputLabel>
                      <FormControl>
                        <FastInputField

                          type={field.type}
                          value={values[`${field.name}`]}
                          onChange={handleChange}
                          shouldDisable={field.disabled}
                          name={`${field.name}`}
                          style={FastinputfieldStyle}
                        />
                      </FormControl>
                    </Stack>
                  );
                })}
              </Box>
            );
          }}
        />
      </FormikProvider>
    </Stack>
  );
};

export default PricePlanForm;
