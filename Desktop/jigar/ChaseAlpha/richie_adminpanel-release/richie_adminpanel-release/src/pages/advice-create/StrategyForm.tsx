// material-ui
import { Button, Typography, FormControl, InputLabel, Stack, MenuItem, Select } from '@mui/material';
import { Box } from '@mui/system';
import { FormikProvider, FieldArray } from 'formik';
import { defaultStrategy, strategyActionOptions, strategyFormSet } from './constant';
import FastInputField from 'components/FastInputField';

// ==============================|| MAIN LOGO ||============================== //

const StrategyForm = ({ formik }: any) => {
  const { values } = formik;
  return (
    <Stack direction="column" flex={1} gap={1} marginY={2}>
      <FormikProvider value={formik}>
        <FieldArray
          name="strategy"
          render={(arrayHelpers) => {
            return (
              <Stack flexDirection="column">
                {values.strategies.map((strategy: any, index: any) => {
                  return (
                    <>
                      <Box display="flex" key={index} my={2} mb={3} justifyContent="space-between">
                        <Typography variant="h4">{`Strategy - ${strategy.strategyName || index + 1}`}</Typography>
                        <Button variant="contained" color="error" onClick={() => arrayHelpers.remove(index)}>
                          Delete
                        </Button>
                      </Box>
                      <Box display="flex" gap={3} flexWrap="wrap">
                        {strategyFormSet.map((field: any) => {
                          return (
                            <Stack key={field.name} spacing={1} width={260}>
                              <InputLabel sx={{ mt: 1 }}>{field.label}</InputLabel>
                              <FormControl>
                                <FastInputField
                                  type={field.type}
                                  value={strategy[field.name]}
                                  onChange={formik.setFieldValue}
                                  disabled={field.disabled}
                                  name={`strategies[${index}].${field.name}`}
                                />
                              </FormControl>
                            </Stack>
                          );
                        })}
                        <Stack spacing={1} width={260}>
                          <InputLabel sx={{ mt: 1 }}>Action</InputLabel>
                          <FormControl>
                            <Select value={strategy.action} onChange={formik.handleChange} name="action">
                              {strategyActionOptions.map((option: any) => (
                                <MenuItem value={option.value} key={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Stack>
                      </Box>
                    </>
                  );
                })}
                <Box
                  component="span"
                  onClick={() => arrayHelpers.push(defaultStrategy)}
                  borderRadius={2}
                  my={3}
                  mt={5}
                  sx={{ p: 2, border: '1px dashed grey', cursor: 'pointer' }}
                >
                  <Typography variant="h4" textAlign="center">
                    Add New Strategy
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

export default StrategyForm;
