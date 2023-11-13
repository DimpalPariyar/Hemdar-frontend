import axios from 'utils/axios';
import { BASE_URL } from 'config';
import { useEffect, useState } from 'react';
import BasicTable from 'components/react-table/BasicTable';
import { columns } from './constant';
import { Box } from '@mui/system';
import SearchInput from 'components/SearchInput';
import ScrollX from 'components/ScrollX';
import Loader from 'components/Loader';
import { Button, Stack } from '@mui/material';

const bgColor = {
  background: 'linear-gradient(103.4deg, #2D00D2 12.04%, #2C00D3 30.87%, #3700C8 46.11%, #3E00C0 63.54%, #4B00B4 80.82%, #5400AA 93.76%)',
  color: ' #FFFFFF',
  borderRadius: '10px'
};
const BetaUserList = () => {
  const [data, setData] = useState<any>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const init = async () => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: 10
      };

      if (searchText) params.search = searchText;
      const response = await axios.get(`${BASE_URL}/beta?${new URLSearchParams(params).toString()}`);

      setData(response.data || []);
    } catch (error) {
      console.log({ error: error });
    } finally {
      setLoading(false);
    }
  };
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleEnableChange = async () => {
    try {
      const data = {
        enable: true
      };
      await axios.patch(`${BASE_URL}/beta/bulk`, data);
    } catch (e) {
      console.log(e);
    }
  };
  const handleDisableChange = async () => {
    try {
      const data = {
        enable: false
      };
      await axios.patch(`${BASE_URL}/beta/bulk`, data);
    } catch (e) {
      console.log(e);
    }
  };
  const handleRefresh = async () => {
    try {
      setLoading(true);
      await axios.get(`${BASE_URL}/beta/updateEntries`);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    init();
  }, [page, searchText]);
  return (
    <>
      {(!data.items || loading) && <Loader />}
      <Box display="flex" flexDirection="column">
        <Box display="flex" justifyContent="flex-end">
          <Box sx={{ position: 'absolute', top: 0 }}>
            <SearchInput onChange={setSearchText} />
          </Box>
        </Box>
        <Stack direction="row" spacing={2} sx={{ position: 'absolute', right: 0 }}>
          <Button sx={bgColor} onClick={handleEnableChange}>
            Bulk Enable User
          </Button>
          <Button sx={bgColor} onClick={handleDisableChange}>
            Bulk disable User
          </Button>
          <Button sx={bgColor} onClick={handleRefresh}>
            Refresh Beta User List
          </Button>
        </Stack>
        {data.items && !loading && (
          <ScrollX>
            <BasicTable
              columns={columns}
              getHeaderProps={(column: any) => column.getSortByToggleProps()}
              data={data.items}
              currentPage={data.page}
              totalPage={data.pageTotal}
              onPageChange={handlePageChange}
              striped
              disableFilters
            />
          </ScrollX>
        )}
      </Box>
    </>
  );
};

export default BetaUserList;
