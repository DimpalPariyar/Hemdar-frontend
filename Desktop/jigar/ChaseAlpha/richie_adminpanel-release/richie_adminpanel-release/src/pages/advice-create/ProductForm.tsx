import { InputLabel, Stack } from '@mui/material';
import SelectField from 'components/SelectField';
import useMaster from 'hooks/useActivityMaster';
import Autocomplete from 'components/AutoComplete';
import { getAdvisory, getSymbolsOption, getProductPayloads, getInstrumentChangePayload } from './helper';
import useProducts from './hooks/useProducts';
import { useEffect, useMemo, useRef } from 'react';

const ProductForm = ({ values, formik, isUpdateMode, isPermited }: any) => {
  const cmpRef = useRef<HTMLSpanElement>(null!);
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

  // useEffect(() => {
  //   if (cmpRef) {
  //     socket.on('LTP', (socketData) => {
  //       cmpRef.current.textContent = socketData?.LTP;
  //     });
  //   }
  // }, [cmpRef]);
  return (
    <Stack direction="row" flexWrap="wrap" gap={2}>
      <Stack spacing={1} width={260}>
        <InputLabel sx={{ mt: 1 }}>Product</InputLabel>
        <SelectField
          options={advisory}
          value={values?.advisoryId}
          onChange={handleAdvisorySelect}
          name="advisoryId"
          shouldDisable={!isPermited}
        />
      </Stack>
      <Stack spacing={1} width={360}>
        <InputLabel sx={{ mt: 1 }}>Name of the Underlying</InputLabel>
        <Autocomplete
          valueKey="label"
          name="nameOfUnderlying"
          value={values?.nameOfUnderlying}
          onChange={handleUnderLyingSelect}
          options={symbolsOption}
          disabled={!isPermited}
        />
      </Stack>
    </Stack>
  );
};

export default ProductForm;
