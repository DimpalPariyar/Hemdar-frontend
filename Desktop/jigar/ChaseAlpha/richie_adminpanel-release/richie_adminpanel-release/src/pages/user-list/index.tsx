import axios from 'utils/axios';
import { BASE_URL } from 'config';
import { useEffect, useState } from 'react';
import BasicTable from 'components/react-table/BasicTable';
import { columns } from './constant';
import { Box } from '@mui/system';
import SearchInput from 'components/SearchInput';
import Loader from 'components/Loader';
import { Button, Stack } from '@mui/material';

const bgColor = {
  background: 'linear-gradient(103.4deg, #2D00D2 12.04%, #2C00D3 30.87%, #3700C8 46.11%, #3E00C0 63.54%, #4B00B4 80.82%, #5400AA 93.76%)',
  color: ' #FFFFFF',
  borderRadius: '10px'
};
const UserList = () => {
  const [data, setData] = useState<any>({});
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalUser, setTotalUser] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>('');
  const [verified, setVerified] = useState<boolean | null>(null);
  const [subscribedUser, setsubscribedUser] = useState<boolean | null>(false);
  const [ckycverified, setckycverified] = useState<boolean | null>(false);
  const [ckycPending, setckycPending] = useState<boolean | null>(false);
  const init = async () => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: 10,
        verified: verified,
        subscribedUser,
        ckycverified,
        ckycPending
      };
      if (searchText) params.search = searchText;

      const response = await axios.get(`${BASE_URL}/admin/users/lists?${new URLSearchParams(params).toString()}`);
      setData(response.data || []);
      setTotalUser(response.data.total);
    } catch (error) {
      console.log({ error: error });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };
  const handleChangeVerified = () => {
    setVerified(true);
  };
  const handleChangeNotVerified = () => {
    setVerified(false);
  };
  const handleChangesubscribedUser = () => {
    setsubscribedUser(true);
    setckycverified(false);
    setckycPending(false);
  };
  const handleChangeckycverified = () => {
    setckycverified(true);
    setsubscribedUser(false);
    setckycPending(false);
  };
  const handleChangeckycPending = () => {
    setckycPending(true);
    setsubscribedUser(false);
    setckycverified(false);
  };
  const handleRefresh = () => {
    setVerified(null);
  };
  useEffect(() => {
    init();
  }, [page, searchText, verified,subscribedUser,ckycverified,ckycPending]);

  return (
    <>
      {(!data.items || loading) && <Loader />}
      <Box display="flex" flexDirection="column">
        <Box display="flex" justifyContent="flex-end">
          <Box sx={{ position: 'absolute', top: 0 }}>
            <SearchInput onChange={setSearchText} />
          </Box>
        </Box>
        {data.items && !loading && (
          <>
            <Box sx={{ position: 'relative' }}>
              <Stack direction="row" spacing={2} sx={{ position: 'absolute', right: 0 }}>
                <Button sx={bgColor} onClick={handleChangeVerified}>
                  {verified === true ? `Verified User  (${totalUser})` : `Verified User`}
                </Button>
                <Button sx={bgColor} onClick={handleChangeNotVerified}>
                  {verified === false ? `Not Verified User  (${totalUser})` : `Not Verified User`}
                </Button>
                <Button sx={bgColor} onClick={handleChangesubscribedUser}>
                  {subscribedUser === true ? `SubScribed User  (${totalUser})` : `SubScribed User `}
                </Button>
                <Button sx={bgColor} onClick={handleChangeckycverified}>
                  {ckycverified === true ? `Ckyc Verified User  (${totalUser})` : `Ckyc Verified User`}
                </Button>
                <Button sx={bgColor} onClick={handleChangeckycPending}>
                  {ckycPending === true ? `Ckyc Pending User  (${totalUser})` : `Ckyc Pending User `}
                </Button>
                <Button sx={bgColor} onClick={handleRefresh}>
                  {verified === null ? `Total User  (${totalUser})` : `Total User`}
                </Button>
              </Stack>
              <BasicTable
                columns={columns}
                getHeaderProps={(column: any) => column.getSortByToggleProps()}
                data={data.items}
                currentPage={data.page}
                totalPage={data.pageTotal}
                onPageChange={handlePageChange}
                striped
              />
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default UserList;
