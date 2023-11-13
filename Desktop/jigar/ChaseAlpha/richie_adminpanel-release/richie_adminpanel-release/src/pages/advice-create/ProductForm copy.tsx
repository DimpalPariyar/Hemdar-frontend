import { InputLabel, Stack } from '@mui/material';
// import SelectField from 'components/SelectField';
import useMaster from 'hooks/useActivityMaster';
import Autocomplete from 'components/AutoComplete';
import { getAdvisory, getSymbolsOption, getProductPayloads, getInstrumentChangePayload } from './helper';
import useProducts from './hooks/useProducts';
import { useEffect, useMemo, useState } from 'react';
import { FormControl, MenuItem, Select } from '@mui/material';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3)
  },
  '& .MuiInputBase-input': {
    borderRadius: 10,
    position: 'relative',
    backgroundColor: '#ECEFFF',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    '&:focus': {
      borderRadius: 10,
      boxShadow: '0 0 0 0.2rem #ECEFFG'
    }
  },
  '& .MuiSelect-icon': {
    background: 'white',
    borderRadius: 15,
    color: '#2D00D2'
  }
}));

const ProductForm1 = ({ values, formik, isUpdateMode }: any) => {
  const { products } = useProducts();
  const [advisory, setadvisory] = useState<any>([]);
  const [combo, setCombo] = useState<any>([]);

  useEffect(() => {
    setadvisory(getAdvisory(products).filter((x: any) => !x.relatedProducts?.length));
    setCombo(getAdvisory(products).filter((x: any) => x.relatedProducts?.length));
  }, [products]);

  const { instrumentId } = values;
  const { data: symbol } = useMaster({ apiUrl: 'symbol' });

  const symbolsOption = useMemo(() => getSymbolsOption(symbol, instrumentId), [instrumentId, symbol]);
  useEffect(() => {
    const payload = getInstrumentChangePayload(values);
    formik.setValues(payload);
  }, [instrumentId]);

  const handleAdvisorySelect = (e: any) => {
    let value = e.target.value;
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

  return (
    <Stack direction="row" flexWrap="wrap" gap={2}>
      <Stack spacing={1} width={260}>
        <InputLabel sx={{ mt: 1 }}>Product</InputLabel>
        {/* <SelectField
          multiple
          options={advisory}
          value={values.advisoryId}
          onChange={handleAdvisorySelect}
          name="advisoryId"
          shouldDisable={isUpdateMode}
        />
        {values.notificationTitle} */}
        <FormControl>
          <Select
            input={<BootstrapInput />}
            id="advisoryId"
            value={values.advisoryId}
            onChange={handleAdvisorySelect}
            name="advisoryId"
            disabled={isUpdateMode}
          >
            {advisory.map((option: any) => (
              <MenuItem value={option['value']} key={option['value']} disabled={isUpdateMode}>
                {option['label']}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <Stack spacing={1} width={360}>
        <InputLabel sx={{ mt: 1 }}>Name of the Underlying</InputLabel>
        <Autocomplete
          valueKey="label"
          name="nameOfUnderlying"
          value={values.nameOfUnderlying}
          onChange={handleUnderLyingSelect}
          options={symbolsOption}
        />
      </Stack>
    </Stack>
  );
};

export default ProductForm1;
