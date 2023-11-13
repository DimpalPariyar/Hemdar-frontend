import axios from 'utils/axios';
import { BASE_URL } from 'config';
import { dispatch } from 'store';
import { getAdminList } from 'store/reducers/adminList';
import Switch from 'components/Switch';

export const Status = ({ enabled, userId }: any) => {
  const onChange = async (checked: boolean) => {
    await axios.put(`${BASE_URL}/admin/ban`, { enable: checked, userId });
    dispatch(getAdminList());
  };

  return <Switch checked={enabled} checkedLabel="Active" unCheckedLabel="Banned" onChange={onChange} />;
};
