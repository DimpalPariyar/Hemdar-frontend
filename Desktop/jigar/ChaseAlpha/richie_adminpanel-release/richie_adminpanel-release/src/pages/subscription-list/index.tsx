import axios from 'utils/axios';
import { BASE_URL } from 'config';
import { useEffect, useState } from 'react';
import BasicTable from 'components/react-table/BasicTable';
import { columns } from './constant';
import ScrollX from 'components/ScrollX';
import { Box } from '@mui/system';
import SearchInput from 'components/SearchInput';
import Loader from 'components/Loader';
import { Button, Stack } from '@mui/material';
// import { CSVLink } from 'react-csv'

const bgColor = {
  background: 'linear-gradient(103.4deg, #2D00D2 12.04%, #2C00D3 30.87%, #3700C8 46.11%, #3E00C0 63.54%, #4B00B4 80.82%, #5400AA 93.76%)',
  color: ' #FFFFFF',
  borderRadius: '10px'
};

const SubscriptionList = () => {
  const [data, setData] = useState<any>({});
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalUser, setTotalUser] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>('');
  const [active, setActive] = useState<boolean | boolean[]>([true, false]);
  const [date, setDate] = useState<boolean>(false);

  const init = async () => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: 10,
        active: active,
        date: date
      };

      if (searchText) params.search = searchText;

      const response = await axios.get(`${BASE_URL}/admin/subscriptions?${new URLSearchParams(params).toString()}`);
      setTotalUser(response?.data?.total);
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

  const handleChangeActive = () => {
    setActive(true);
  };
  const handleChangeNotVerified = () => {
    setActive(false);
  };
  const handleRefresh = () => {
    setActive([true, false]);
  };

  useEffect(() => {
    init();
  }, [page, searchText, active, date]);

  return (
    <>
      {/* <CSVLink data={JSON.stringify(data.items)} ><Button>Export data in excel</Button></CSVLink>   */}
      {(!data.items || loading) && <Loader />}
      <Box display="flex" flexDirection="column">
        <Box display="flex" justifyContent="flex-end">
          <Box sx={{ position: 'absolute', top: 0 }}>
            <SearchInput onChange={setSearchText} />
          </Box>
        </Box>
        {data.items && !loading && (
          <>
            <Stack direction="row" spacing={2} sx={{ position: 'absolute', right: 0 }}>
              <Button sx={bgColor} onClick={() => setDate(true)}>
                Ending within week
              </Button>
              <Button sx={bgColor} onClick={handleChangeActive}>
                {active === true ? `Active Subscription  (${totalUser})` : `Active Subscription`}
              </Button>
              <Button sx={bgColor} onClick={handleChangeNotVerified}>
                {active === false ? `Created subscription  (${totalUser})` : `Created subscription`}
              </Button>
              <Button sx={bgColor} onClick={handleRefresh}>
                {active === null ? `Total subscription  (${totalUser})` : `Total subscription`}
              </Button>
            </Stack>
            <ScrollX>
              <BasicTable
                columns={columns()}
                getHeaderProps={(column: any) => column.getSortByToggleProps()}
                data={data.items}
                currentPage={data.page}
                totalPage={data.pageTotal}
                onPageChange={handlePageChange}
                striped
                disableFilters
              />
            </ScrollX>
          </>
        )}
      </Box>
    </>
  );
};

export default SubscriptionList;
