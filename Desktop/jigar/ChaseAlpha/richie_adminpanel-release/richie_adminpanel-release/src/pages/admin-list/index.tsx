import { useEffect, useState } from 'react';
import BasicTable from 'components/react-table/BasicTable';
import { columns } from './constant';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { PlusCircleFilled } from '@ant-design/icons';
import { Stack, Button } from '@mui/material';
import { getAdminList, getPermissions } from 'store/reducers/adminList';
import CreateAdminForm from './CreateAdminForm';
import { useDispatch, useSelector } from 'react-redux';

const AdminList = () => {
  const [createDialog, setCreateDialog] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { adminList } = useSelector((state: any) => state.adminList);

  const handleNewClick = () => {
    setCreateDialog(true);
  };

  const handleNewClose = () => {
    setCreateDialog(false);
    dispatch(getAdminList());
  };

  useEffect(() => {
    dispatch(getAdminList());
    dispatch(getPermissions());
  }, []);
  return (
    <MainCard secondary={<div>Hi</div>} content={false}>
      <ScrollX>
        <Stack justifyContent="flex-end" direction="row" margin={1} marginX={2}>
          <Button variant="text" color="primary" startIcon={<PlusCircleFilled />} onClick={handleNewClick}>
            Add new admin
          </Button>
        </Stack>
        <BasicTable
          columns={columns}
          disableFilters
          getHeaderProps={(column: any) => column.getSortByToggleProps()}
          data={adminList}
          striped
        />
      </ScrollX>
      {createDialog && <CreateAdminForm handleClose={handleNewClose} />}
    </MainCard>
  );
};

export default AdminList;
