import { useEffect, useState } from 'react';

import { Stack, Grid, InputLabel } from '@mui/material';
import SelectField from 'components/SelectField';
import useMaster from 'hooks/useActivityMaster';
import { firstFormSet } from './constant';

const AdviceDetailForm = ({ values, formik, isUpdateMode, hostProfiles, onIstrumentLoad, isPermited }: any) => {
  const [me, setMe] = useState('');
  const { data: market } = useMaster({ apiUrl: 'market' });
  const { data: exchange } = useMaster({ apiUrl: 'exchange' });
  const { data: productType } = useMaster({ apiUrl: 'product-type' });
  const { data: instrument } = useMaster({ apiUrl: 'instrument' });
  const { data: timeFrame } = useMaster({ apiUrl: 'time-frame' });
  const dropdownIndex: any = {
    market,
    exchange,
    instrument,
    productType,
    timeFrame,
    hostProfiles
  };

  useEffect(() => {
    if (instrument.length) {
      onIstrumentLoad(instrument);
    }
    setMe(JSON.parse(localStorage.getItem('me') || '-'));
    formik.values.analyst = me
  }, [instrument]);
  return (
    <Stack direction="column">
      {firstFormSet.map((field) => {
        const options = (dropdownIndex[field.dataKey] || []).map((data: any) => ({
          value: data._id,
          label: data[field.labelKey]
        }));
        const value = `${values?.[field.name]}`;

        if (field.labelKey === 'analyst') {
          return (
            <Grid key={field.name} container spacing={2} width={360}>
              <Grid item xs={5}>
                <InputLabel sx={{ mt: 1 }}>{field.label}</InputLabel>
              </Grid>
              <Grid item xs={7}>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <SelectField
                    options={[{ value: me, label: me }]}
                    value={value}
                    onChange={formik.handleChange}
                    name={field.name}
                    shouldDisable={!isPermited}
                  />
                </Stack>
              </Grid>
            </Grid>
          );
        } else {
          return (
            <Grid key={field.name} container spacing={2} width={360}>
              <Grid item xs={5}>
                <InputLabel sx={{ mt: 1 }}>{field.label}</InputLabel>
              </Grid>
              <Grid item xs={7}>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <SelectField
                    options={options}
                    value={value}
                    onChange={formik.handleChange}
                    name={field.name}
                    shouldDisable={!isPermited}
                  />
                </Stack>
              </Grid>
            </Grid>
          );
        }
      })}
    </Stack>
  );
};

export default AdviceDetailForm;
