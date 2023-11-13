import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import DialogTitle from '@mui/material/DialogTitle';
import { prefilleddata, prefillformInitialvalue } from './constant';
import { Stack, InputLabel, FormControl, Grid, Typography } from '@mui/material';
import SelectField from 'components/SelectField';
import FastInputField from 'components/FastInputField';
import { Box } from '@mui/system';
import { useEffect, useMemo, useState } from 'react';
import axios from 'utils/axios';
import { BASE_URL } from 'config';
import useProducts from './hooks/useProducts';
import { getAdvisory, getSymbolsOption } from './helper';
import { useFormik } from 'formik';
import useMaster from 'hooks/useActivityMaster';
const FastinputfieldStyle = {
  bgcolor: '#ECEFFF',
  borderRadius: '10px',
  padding: '8px 10px',
  '&:hover': {
    border: '1px solid #2D00D2',
    height: '41px'
  }
};
interface AddPrefilledformProps {
  onClose: () => void;
  open: boolean;
  defaultValue?: defaultFromdataProps;
}
interface defaultFromdataProps {
  _id?: string;
  formName?: string;
  action: string;
  productId: string;
  TypeOfNotification: string;
  lowRate: number;
  highRate: number;
  StopLoss: number;
  target1: number;
  target2: number;
  target3: number;
  HoldingPeriod: string;
  createdAt: string;
  updateAt: string;
  _v?: number;
}

const AddPrefilledform = (props: AddPrefilledformProps) => {
  const { open, onClose, defaultValue } = props;
  const [notification, setNotification] = useState([]);
  const formik = useFormik({
    initialValues: defaultValue ? defaultValue : prefillformInitialvalue,
    onSubmit: async (data: any) => {
      const nameOfUnderlying = symbolsOption.filter((symbol: any) => symbol.value === data.nameOfUnderlyingDataId)[0].label;
      const newdata = {
        ...data,
        nameOfUnderlying
      };
      if (defaultValue) {
        const response = await axios.put(`${BASE_URL}/advisory/prefilled-form/${defaultValue._id}`, newdata);
        if (response.data) {
          onClose();
        }
      } else {
        const response = await axios.post(`${BASE_URL}/advisory/prefilled-form`, newdata);
        if (response.data) {
          onClose();
        }
      }
    }
  });
  const values: any = formik.values;
  const { products } = useProducts();
  let advisory;
  if (products?.relatedProductsIds) {
    advisory = getAdvisory(products).filter((x: any) => !x.relatedProductsIds?.length);
  } else {
    advisory = getAdvisory(products);
  }
  const instrument = products.filter((product: any) => product._id === values.productId);
  const instrumentId = instrument[0]?.instrumentId._id;
  const { data: symbol } = useMaster({ apiUrl: 'symbol' });

  const symbolsOption = useMemo(() => getSymbolsOption(symbol, instrumentId), [instrumentId, symbol]);
  let action = [
    { value: 'buy', label: 'Buy' },
    { value: 'sell', label: 'Sell' }
  ];
  const dropdownIndex: any = {
    advisory,
    action,
    notification,
    symbolsOption
  };

  const init = async () => {
    try {
      await axios.get(`${BASE_URL}/notification/getall/types`).then((data) => {
        const notificationOption = data.data.map((item: any) => {
          return {
            value: item._id,
            label: item.typeofNotification
          };
        });
        setNotification(notificationOption);
      });
    } catch (error) {}
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <div>
      <Dialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{'Advice Form'}</DialogTitle>
        <DialogContent>
          {prefilleddata?.map((field: any) => {
            const options = (dropdownIndex[field.dataKey] || []).map((data: any) => ({
              value: data.value,
              label: data.label
            }));
            return (
              <>
                <Box sx={{ width: '100%' }}>
                  <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}></Grid>
                  {field.type === 'number' && (
                    <>
                      <Grid item>
                        <Stack spacing={1} width={260}>
                          <InputLabel sx={{ mt: 1 }}>{field.label} :</InputLabel>
                          <FormControl>
                            <FastInputField
                              style={FastinputfieldStyle}
                              name={field.name}
                              type={field.type}
                              value={values?.[field.name]}
                              onChange={formik.setFieldValue}
                              //   shouldDisable={!isPermited}
                            />
                          </FormControl>
                        </Stack>
                      </Grid>
                    </>
                  )}
                  {field.type === 'text' && (
                    <>
                      <Grid xs={6}>
                        <Stack spacing={1} width={260}>
                          <InputLabel sx={{ mt: 1 }}>{field.label}</InputLabel>
                          <FormControl>
                            <FastInputField
                              style={FastinputfieldStyle}
                              name={field.name}
                              type={field.type}
                              value={values?.[field.name]}
                              onChange={formik.setFieldValue}
                              placeholder={values?.placeholder}
                              //   shouldDisable={!isPermited}
                            />
                          </FormControl>
                        </Stack>
                      </Grid>
                    </>
                  )}
                  {field.type === 'select' && (
                    <Grid xs={6}>
                      <Stack spacing={1} width={260}>
                        <InputLabel sx={{ mt: 1 }}>{field.label}</InputLabel>
                        <FormControl>
                          <SelectField options={options} value={values?.[field.name]} onChange={formik.handleChange} name={field.name} />
                        </FormControl>
                      </Stack>
                    </Grid>
                  )}
                </Box>
              </>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => formik.handleSubmit()} autoFocus>
            {defaultValue ? 'Update form' : 'Create Form'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddPrefilledform;
