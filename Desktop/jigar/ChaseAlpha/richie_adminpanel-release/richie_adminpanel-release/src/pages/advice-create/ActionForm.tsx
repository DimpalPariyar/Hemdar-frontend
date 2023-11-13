import { Stack, InputLabel, FormControl, Grid, Typography, Button } from '@mui/material';
import FastInputField from 'components/FastInputField';
import SelectField from 'components/SelectField';
import { strategyActionOptions } from './constant';
import { forwardRef } from 'react';

const ActionForm = forwardRef((props: any, ref: any) => {
  const { values, formik, onShowCmp, isPermited } = props;
  const bgColor = {
    background: 'linear-gradient(103.4deg, #2D00D2 12.04%, #2C00D3 30.87%, #3700C8 46.11%, #3E00C0 63.54%, #4B00B4 80.82%, #5400AA 93.76%)',
    color: ' #FFFFFF',
    borderRadius: '10px',
    marginBottom: '5px'
  };
  const FastinputfieldStyle = {
    bgcolor: '#ECEFFF',
    borderRadius: '10px',
    padding: '8px 10px',
    '&:hover': {
      border: '1px solid #2D00D2',
      height: '41px'
    }
  };
  return (
    <Stack direction="row" flexWrap="wrap" mt={4} gap={2}>
      <Stack spacing={1} width={260}>
        <InputLabel sx={{ mt: 1 }}>Action</InputLabel>
        <FormControl>
          <SelectField
            options={strategyActionOptions}
            value={values?.action}
            onChange={formik.handleChange}
            name="action"
            shouldDisable={!isPermited}
          />
        </FormControl>
      </Stack>
      <Stack spacing={1} alignItems={'center'} justifyContent={'end'} width={100}>
        <Button sx={bgColor} onClick={onShowCmp}>
          Show CMP
        </Button>
      </Stack>
      <Stack spacing={1} width={260}>
        <InputLabel sx={{ mt: 1 }}>
          Entry Range{' '}
          <strong>
            (CMP: <span ref={ref}>123</span>)
          </strong>
        </InputLabel>
        <FormControl>
          <Grid container spacing={0} width={260} justifyItems={'center'} alignItems={'center'} xs={12}>
            <Grid item xs={5.5}>
              <FastInputField
                style={FastinputfieldStyle}
                shouldDisable={!isPermited}
                name={'entryLowerRange'}
                type={'number'}
                value={values?.['entryLowerRange']}
                onChange={formik.setFieldValue}
              />
            </Grid>
            <Grid item xs={1}>
              <Typography variant="h6" align="center">
                -
              </Typography>
            </Grid>
            <Grid item xs={5.5}>
              <FastInputField
                style={FastinputfieldStyle}
                shouldDisable={!isPermited}
                name={'entryUpperRange'}
                type={'number'}
                value={values?.['entryUpperRange']}
                onChange={formik.setFieldValue}
              />
            </Grid>
          </Grid>
        </FormControl>
      </Stack>
      <Stack spacing={1} width={260}>
        <InputLabel sx={{ mt: 1 }}>SL</InputLabel>
        <FormControl>
          <FastInputField
            style={FastinputfieldStyle}
            name={'stopLoss'}
            type={'number'}
            value={values?.['stopLoss']}
            onChange={formik.setFieldValue}
            shouldDisable={!isPermited}
          />
        </FormControl>
      </Stack>
    </Stack>
  );
});

export default ActionForm;
