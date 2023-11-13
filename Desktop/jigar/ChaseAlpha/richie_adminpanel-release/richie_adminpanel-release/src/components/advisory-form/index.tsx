// material-ui
import { Button, FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import { useFormik } from 'formik';
import SubscriptionPlanForm from './SubscriptionPlan';
import { firstFormSet, secondFormSet, initialValues } from './constant';
import useMaster from 'hooks/useActivityMaster';
import axios from 'utils/axios';
import { BASE_URL } from 'config';
import { useState, useEffect } from 'react';
import FastInputField from '../FastInputField';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Autocomplete from 'components/AutoComplete';
import { uniqBy } from 'lodash';
import Switch from '@mui/material/Switch';

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

interface Props {
  onSubmit: (data: any) => Promise<void>;
  defaultState?: any;
}

const AdvisoryForm = ({ defaultState, onSubmit }: Props) => {
  const [hostProfiles, setHostProfiles] = useState<any>([]);
  const [relatedproductsids, setrelatedProductsIds] = useState<any>([]);
  const [options, setOptions] = useState<any>([]);
  const [currentSelection, setCurrentSelection] = useState<any>([]);
  const [previousSelection, setPreviousSelection] = useState<any>([]);
  const [active, setActive] = useState<boolean>(false);

  const { data: volatility } = useMaster({ apiUrl: 'volatility' });
  const { data: market } = useMaster({ apiUrl: 'market' });
  const { data: exchange } = useMaster({ apiUrl: 'exchange' });
  const { data: instrument } = useMaster({ apiUrl: 'instrument' });
  const { data: productType } = useMaster({ apiUrl: 'product-type' });
  const { data: timeFrame } = useMaster({ apiUrl: 'time-frame' });

  const dropdownIndex: any = {
    market,
    volatility,
    exchange,
    instrument,
    productType,
    timeFrame,
    hostProfiles
  };

  const getHostProfiles = async () => {
    try {
      await axios.get(`${BASE_URL}/hostProfile/all`).then((response: any) => {
        const hosts = response.data || [];
        setHostProfiles(hosts);
      });

      const res = await axios.get(`${BASE_URL}/advisory/product`);
      const data = (res.data || []).map((item: any) => ({
        label: item['productTitle'],
        value: item._id
      }));
      setOptions(data);
    } catch (error) {
      setHostProfiles([]);
    }
  };

  useEffect(() => {
    getHostProfiles();
  }, []);

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit
  });

  useEffect(() => {
    formik.setValues(defaultState || initialValues);
    setActive(defaultState?.Active);
  }, [defaultState]);

  const values: any = formik.values;

  if (values.relatedProductsIds) {
    const filterdata = options?.filter((item: any) => {
      for (let i = 0; i < values.relatedProductsIds.length; i++) {
        if (item.value === values.relatedProductsIds[i]) {
          return item;
        }
      }
    });
    if (filterdata.length > 0) {
      values.relatedProductsIds = filterdata;
      setPreviousSelection(filterdata);
      setrelatedProductsIds(filterdata);
    }
  }

  const onItemChange = (e: any, value: any) => {
    value &&
      setCurrentSelection((existingItem: any) => {
        values.relatedProductsIds = [...value.map((x: any) => x.value)];
        setrelatedProductsIds([...value, ...existingItem, ...previousSelection]);
        return uniqBy([...value, ...existingItem], 'value');
      });
  };

  const handleToogle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setActive(event.target.checked);
    formik.setFieldValue('Active', event.target.checked);
  };
  return (
    <Stack direction="column" gap={1} marginY={2}>
      <Stack direction="column">
        <Stack direction="row" flexWrap="wrap" gap={2}>
          {firstFormSet.map((field) => (
            <Stack key={field.name} spacing={1} width={340}>
              <InputLabel sx={{ mt: 1 }}>{field.label}</InputLabel>
              <FormControl>
                <FastInputField
                  style={FastinputfieldStyle}
                  name={field.name}
                  type={field.type}
                  value={values[field.name]}
                  onChange={formik.setFieldValue}
                />
              </FormControl>
            </Stack>
          ))}
          <Stack spacing={1} width={340}>
            <InputLabel sx={{ mt: 1 }}>Combo product</InputLabel>
            <FormControl>
              <Autocomplete
                name="nameOfUnderlying"
                multiple
                value={relatedproductsids}
                clearOnBlur
                disableCloseOnSelect={false}
                onChange={onItemChange}
                options={options}
                sx={{ width: '350px' }}
              />
            </FormControl>
          </Stack>
        </Stack>
        <Stack direction="row" mt={3} flexWrap="wrap" gap={2}>
          {secondFormSet.map((field) => {
            const options = (dropdownIndex[field.dataKey] || []).map((data: any) => ({ value: data._id, label: data[field.labelKey] }));
            const value = `${values[field.name]}`;

            return (
              <Stack key={field.name} spacing={1} width={340}>
                <InputLabel sx={{ mt: 1 }}>{field.label}</InputLabel>
                <FormControl>
                  <Select id={field.name} value={value} onChange={formik.handleChange} name={field.name}>
                    {options.map((option: any) => (
                      <MenuItem value={option.value} key={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            );
          })}
        </Stack>
        <Stack spacing={1} mt={2} width={500}>
          {defaultState && (
            <>
              <Stack direction="row" spacing={1} mt={2}>
                <InputLabel>{values?.Active ? 'Product is Active :' : 'Product is InActive :'}</InputLabel>
                <Switch checked={active} onChange={handleToogle} inputProps={{ 'aria-label': 'controlled' }} />
              </Stack>
            </>
          )}
          <InputLabel sx={{ mt: 1 }}>Long Description</InputLabel>
          <FormControl>
            {/* <FastInputField
              multiline
              rows={3}
              name="productLongDescription"
              value={values.productLongDescription}
              onChange={formik.setFieldValue}
            /> */}
            <ReactQuill
              theme="snow"
              value={values.productLongDescription}
              onChange={(value) => {
                formik.setFieldValue('productLongDescription', value);
              }}
            />
          </FormControl>
        </Stack>
      </Stack>
      <SubscriptionPlanForm formik={formik} />
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
