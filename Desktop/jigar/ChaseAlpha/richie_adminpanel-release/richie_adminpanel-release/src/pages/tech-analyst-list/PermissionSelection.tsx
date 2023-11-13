import { Button, Checkbox, Chip, MenuItem, Select } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'utils/axios';
import { BASE_URL } from 'config';
import { useAsyncDebounce } from 'react-table';
import { useEffect, useState } from 'react';
import { getResearchList } from 'store/reducers/researchList';
import { dispatch } from 'store';
export const PermissionSelection = ({ values = [], userId, type }: any) => {
  const [products, setProducts] = useState([]);
  const init = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/advisory/product`);
      response.data &&
        setProducts(() => {
          return response.data.map((title: any) => title.productTitle);
        });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    init();
  }, []);
  const onChange = useAsyncDebounce(async (e) => {
    await axios.put(`${BASE_URL}/admin/researchaccess`, { access: { [type]: { product: e.target.value } }, userId });
    dispatch(getResearchList());
  }, 500);
  return (
    <Select
      multiple
      id="permissions"
      name="permissions"
      value={values}
      onChange={onChange}
      sx={{ display: 'flex', gap: 2 }}
      renderValue={(selected: any) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {selected.map((item: any, index: any) => {
            const selectedItem: any = products.find((product: any) => product === item);
            return <Chip key={index} label={selectedItem || '-'} />;
          })}
        </Box>
      )}
    >
      {products.map((product: any) => {
        const isSelected = values.filter((value: any) => value === product).length !== 0;
        return (
          <MenuItem value={product}>
            <Checkbox checked={!!isSelected} />
            {product}
          </MenuItem>
        );
      })}
    </Select>
  );
};
