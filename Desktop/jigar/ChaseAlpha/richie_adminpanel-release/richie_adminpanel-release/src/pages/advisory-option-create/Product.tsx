import React, { useEffect, useState, useMemo } from 'react';
import useMaster from 'hooks/useActivityMaster';
import {
  getAdvisory,
  getSymbolsOption,
  getProductPayloads,
  getInstrumentChangePayload,
  getExpiryDateOption
} from 'pages/advice-create/helper';
import useProducts from 'pages/advice-create/hooks/useProducts';
import { InputLabel, Stack, TextField } from '@mui/material';
import SelectField from 'components/SelectField';
import Autocomplete from 'components/AutoComplete';
import FastInputField from 'components/FastInputField';
const FastinputfieldStyle = {
  bgcolor: '#ECEFFF',
  borderRadius: '10px',
  padding: '8px 10px',
  '&:hover': {
    border: '1px solid #2D00D2',
    height: '41px'
  }
};
const Product = ({ formik, values, interval, setinterval }: any) => {
  const { products } = useProducts();
  let advisory;
  if (products?.relatedProductsIds) {
    advisory = getAdvisory(products).filter((x: any) => !x.relatedProductsIds?.length);
  } else {
    advisory = getAdvisory(products);
  }
  const { instrumentId } = values;
  const { data: symbol } = useMaster({ apiUrl: 'symbol' });

  const symbolsOption = useMemo(() => getSymbolsOption(symbol, instrumentId), [instrumentId, symbol]);
  const { nameOfUnderlying } = values;
  const allowExpiryFetch = useMemo(() => [nameOfUnderlying, instrumentId].filter(Boolean).length === 2, [nameOfUnderlying, instrumentId]);
  const expiryDateUrl = `expiry-date?symbols=${values.nameOfUnderlyingDataId}&instrument=${values.instrumentId}`;
  const { data: expiryDate } = useMaster({ apiUrl: expiryDateUrl, isAllowToFetch: allowExpiryFetch });
  useEffect(() => {
    const payload = getInstrumentChangePayload(values);
    formik.setValues(payload);
  }, [instrumentId]);

  const handleAdvisorySelect = (e: any) => {
    const value = e.target.value;
    formik.setValues({
      ...values,
      ...getProductPayloads(value, products)
    });
  };
  const expiryDateOption = getExpiryDateOption(expiryDate, instrumentId, values.nameOfUnderlyingDataId);
  const handleExpirySelect = (e: any, data: any) => {
    formik.setValues({
      ...values,
      expiry: data.label
    });
  };
  const handleUnderLyingSelect = (e: any, data: any) => {
    formik.setValues({
      ...values,
      nameOfUnderlyingDataId: data?.value || null,
      nameOfUnderlying: data.label,
      expiry: null,
      optionStrike: null,
      optionType: null
    });
  };
  return (
    <>
      {' '}
      <Stack direction="row" flexWrap="wrap" gap={2}>
        <Stack spacing={1} width={250}>
          <InputLabel sx={{ mt: 1 }}>Product</InputLabel>
          <SelectField options={advisory} value={values?.advisoryId} onChange={handleAdvisorySelect} name="advisoryId" />
        </Stack>
        <Stack spacing={1} width={320}>
          <InputLabel sx={{ mt: 1 }}>Name of the Underlying</InputLabel>
          <Autocomplete
            valueKey="label"
            name="nameOfUnderlying"
            value={values?.nameOfUnderlying}
            onChange={handleUnderLyingSelect}
            options={symbolsOption}
          />
        </Stack>
        <Stack spacing={1} width={320}>
          <InputLabel sx={{ mt: 1 }}>Expiry </InputLabel>
          <Autocomplete valueKey="label" name="expiry" value={values?.expiry} onChange={handleExpirySelect} options={expiryDateOption} />
        </Stack>
      </Stack>
    </>
  );
};

export default Product;
