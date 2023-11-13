import { InputLabel, Stack } from '@mui/material';
// import { debounce } from 'lodash';
import FastInputField from 'components/FastInputField';
import AutoComplete from 'components/AutoComplete';
import useMaster from 'hooks/useActivityMaster';
import { expiryAdviceFormSet, optionTypeOptions } from './constant';
import { getExpiryDateOption, getExpiryPayload } from './helper';
import { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { BASE_URL } from 'config';
import axios from 'utils/axios';

const ExpiryForm = ({ values, formik, isPermited }: any) => {
  const [datalive, setDatalive] = useState(0);
  const { instrumentId, nameOfUnderlying, expiry } = values;
  const expiryAdviceForm = expiryAdviceFormSet(values.instrumentId);
  const allowStrikeFetch = useMemo(
    () => [nameOfUnderlying, instrumentId, expiry].filter(Boolean).length === 3,
    [nameOfUnderlying, instrumentId, expiry]
  );
  const allowExpiryFetch = useMemo(() => [nameOfUnderlying, instrumentId].filter(Boolean).length === 2, [nameOfUnderlying, instrumentId]);
  const expiryDateUrl = `expiry-date?symbols=${values.nameOfUnderlyingDataId}&instrument=${values.instrumentId}`;
  const strikePriceUrl = `strike-price?symbols=${values.nameOfUnderlyingDataId}&instrument=${values.instrumentId}&expiry=${values.expiryDataId}`;

  const { data: strikePrice } = useMaster({ apiUrl: strikePriceUrl, isAllowToFetch: allowStrikeFetch });

  const { data: expiryDate } = useMaster({ apiUrl: expiryDateUrl, isAllowToFetch: allowExpiryFetch });

  const strikePriceOption: any = strikePrice.map((data: any) => ({
    value: data._id,
    label: data.name
  }));

  const expiryDateOption = getExpiryDateOption(expiryDate, instrumentId, values.nameOfUnderlyingDataId);

  const dropdownIndex: any = {
    expiry: expiryDateOption,
    optionStrike: strikePriceOption,
    optionType: optionTypeOptions
  };
  const updateExpiry = () => {
    formik.setFieldValue(() => {
      return { ...values, expiry: expiryDateOption[0] };
    });
  };
  useEffect(() => {
    updateExpiry();
  }, []);
  const handleAutoCompleteSelect = async (name: any, data: any) => {
    const value = data?.label || '';
    const id = data.value;
    const payload = getExpiryPayload(name, value || '', values);
    formik.setValues({ ...payload, [`${name}DataId`]: id });
    const date = moment(values?.expiry, 'DD-MMM-YYYY').format('YYMMDD');
    let Symbol;
    if (Object.keys(value.preformdata > 0)) {
      if (data.label === 'CE' || data.label === 'PE') {
        Symbol = `${values?.nameOfUnderlying}${date}${values.optionStrike}${data.label}`;
      } else {
        Symbol = `${values?.nameOfUnderlying}${date}${data.label}${values.optionType}`;
      }
      await axios.get(`${BASE_URL}/advisory/stocksymbol/${Symbol}`).then((data: any) => {
        setDatalive(data.data.LTP);
      });
    }
  };
 console.log(values)
  useEffect(() => {
    if (datalive) {
      formik.setValues({
        ...values,
        entryLowerRange: Math.round(datalive + (values?.preformdata?.entryLowerRange / 100) * datalive),
        entryUpperRange: Math.round(datalive + (values?.preformdata?.entryUpperRange / 100) * datalive),
        stopLoss: Math.round(datalive + (values?.preformdata?.stopLoss / 100) * datalive),
        target1: Math.round(datalive + (values?.preformdata?.target1 / 100) * datalive),
        target2: Math.round(datalive + (values?.preformdata?.target2 / 100) * datalive),
        target3: Math.round(datalive + (values?.preformdata?.target3 / 100) * datalive)
      });
    }
  }, [datalive]);
  return (
    <>
      {expiryAdviceForm.length !== 0 && (
        <Stack direction="row" flexWrap="wrap" mt={4} gap={2}>
          {expiryAdviceFormSet(values.instrumentId).map((field: any) => (
            <Stack key={field.name} spacing={1} width={360}>
              <InputLabel sx={{ mt: 1 }}>{field.label}</InputLabel>
              {field.type !== 'text' ? (
                <AutoComplete
                  options={dropdownIndex[field.name]}
                  value={values?.[field.name]}
                  name={field.name}
                  valueKey="label"
                  disabled={!isPermited}
                  onChange={(e: any, data: any) => handleAutoCompleteSelect(field.name, data || null)}
                />
              ) : (
                <FastInputField
                  name={field.name}
                  type={field.type}
                  value={values?.[field.name]}
                  onChange={formik.setFieldValue}
                  shouldDisable={!isPermited}
                />
              )}
            </Stack>
          ))}
        </Stack>
      )}
    </>
  );
};

export default ExpiryForm;
