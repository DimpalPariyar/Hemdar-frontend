import { Button, Checkbox, MenuItem, Select } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'utils/axios';
import { BASE_URL } from 'config';
import { useAsyncDebounce } from 'react-table';
import { dispatch, useSelector } from 'store';
import { getAdminList } from 'store/reducers/adminList';

export const PermissionSelection = ({ values = [], userId }: any) => {
  const { permissions = [] } = useSelector((state: any) => state.adminList);

  const onChange = useAsyncDebounce(async (e) => {
    await axios.put(`${BASE_URL}/admin/permissions`, { type: e.target.value, userId });
    dispatch(getAdminList());
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
          {selected.map((item: any) => {
            const selectedItem: any = permissions.find((permission: any) => +permission.value === item);
            return <Button key={selectedItem?.value} variant="outlined">{selectedItem?.label || "-"}</Button>;
          })}
        </Box>
      )}
    >
      {permissions.map((permission: any) => {
        const isSelected = values.filter((value: any) => value === +permission.value).length !== 0;
        return (
          <MenuItem key={permission.value} value={+permission.value}>
            <Checkbox checked={!!isSelected} />
            {permission.label}
          </MenuItem>
        );
      })}
    </Select>
  );
};
