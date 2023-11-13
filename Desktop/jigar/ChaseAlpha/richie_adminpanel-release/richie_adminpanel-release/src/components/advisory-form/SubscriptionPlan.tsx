// material-ui
import { Button, Typography, FormControl, InputLabel, Stack } from '@mui/material';
import { Box } from '@mui/system';
import { FormikProvider, FieldArray } from 'formik';
import { defaultPlan, planFormSet, priceFields } from './constant';
import FastInputField from '../FastInputField';

const FastinputfieldStyle = {
  bgcolor: '#ECEFFF',
  borderRadius: '10px',
  padding: '8px 10px',
  '&:hover': {
    border: '1px solid #2D00D2',
    height: '41px'
  }
};

// ==============================|| MAIN LOGO ||============================== //

const SubscriptionPlanForm = ({ formik }: any) => {
  const { values } = formik;
  return (
    <Stack direction="column" flex={1} gap={1} marginY={2}>
      <FormikProvider value={formik}>
        <FieldArray
          name="subscriptionPlanIds"
          render={(arrayHelpers) => {
            return (
              <Stack flexDirection="column">
                {values.subscriptionPlanIds.map((plan: any, index: any) => {
                  return (
                    <>
                      <Box display="flex" key={index} my={2} mb={3} justifyContent="space-between">
                        <Typography variant="h4">{`Subscription - ${plan.priceName || index + 1}`}</Typography>
                        <Button variant="contained" color="error" onClick={() => arrayHelpers.remove(index)}>
                          Delete
                        </Button>
                      </Box>
                      <Box display="flex" gap={3} flexWrap="wrap">
                        {planFormSet.map((field: any) => {
                          const handleChange = (name: string, value: any) => {
                            const isPriceField = priceFields.some((v) => name.includes(v));

                            if (isPriceField) {
                              const payload: any = {
                                ...plan,
                                [field.name]: value
                              };
                              const discount = Math.abs((1 - payload.discountPercentage / 100 - 1) * 100).toFixed(2);
                              const discountedPrice = (payload.actualPrice - (payload.actualPrice * +discount) / 100).toFixed(2);

                              return arrayHelpers.replace(index, {
                                ...payload,
                                discountedPrice: discountedPrice
                              });
                            }
                            formik.setFieldValue(name, value);
                          };
                          return (
                            <Stack key={field.name} spacing={1} width={340}>
                              <InputLabel sx={{ mt: 1 }}>{field.label}</InputLabel>
                              <FormControl>
                                <FastInputField
                                  style={FastinputfieldStyle}
                                  type={field.type}
                                  value={plan[field.name]}
                                  onChange={handleChange}
                                  shouldDisable={field.disabled}
                                  name={`subscriptionPlanIds[${index}].${field.name}`}
                                />
                              </FormControl>
                            </Stack>
                          );
                        })}
                      </Box>
                    </>
                  );
                })}
                <Box
                  component="span"
                  onClick={() => arrayHelpers.push(defaultPlan)}
                  borderRadius={2}
                  my={3}
                  mt={5}
                  sx={{ p: 2, border: '1px dashed grey', cursor: 'pointer' }}
                >
                  <Typography variant="h4" textAlign="center">
                    Add New Subscription Plan
                  </Typography>
                </Box>
              </Stack>
            );
          }}
        />
      </FormikProvider>
    </Stack>
  );
};

export default SubscriptionPlanForm;
