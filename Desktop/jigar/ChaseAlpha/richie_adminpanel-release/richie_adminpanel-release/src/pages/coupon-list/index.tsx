import React from 'react';
import { Box } from '@mui/system';
import axios from 'utils/axios';
import { BASE_URL } from 'config';
import SearchInput from 'components/SearchInput';
import { useEffect, useState } from 'react';
import BasicTable from 'components/react-table/BasicTable';
import { columns } from './constant';
import Loader from 'components/Loader';
const CouponList = () => {
  const [data, setData] = useState<any>({});
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');

  const init = async () => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: 10
      };

      if (searchText) params.search = searchText;
      const response = await axios.get(`${BASE_URL}/coupon/couponlist/admin?${new URLSearchParams(params).toString()}`);
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

  useEffect(() => {
    init();
  }, [page, searchText]);

  return (
    <div>
      {(!data.items || loading) && <Loader />}
      <Box display="flex" flexDirection="column">
        <Box display="flex" justifyContent="flex-end">
          <Box sx={{ position: 'absolute', top: 0 }}>
            <SearchInput onChange={setSearchText} />
          </Box>
        </Box>
        {data.items && !loading && (
          <BasicTable
            columns={columns}
            getHeaderProps={(column: any) => column.getSortByToggleProps()}
            data={data.items}
            currentPage={data.page}
            totalPage={data.pageTotal}
            onPageChange={handlePageChange}
            striped
          />
        )}
      </Box>
    </div>
  );
};

export default CouponList;
