import React, { useEffect, useState } from 'react';
import Loader from 'components/Loader';
import axios from 'utils/axios';
import { BASE_URL } from 'config';
import { Box } from '@mui/system';
import SearchInput from 'components/SearchInput';
import BasicTable from 'components/react-table/BasicTable';
import { columns } from './constant';

const MessageNotification = () => {
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
      // const response = await axios.get(`${BASE_URL}/notification?${new URLSearchParams(params).toString()}`);
      const response = await axios.get(`${BASE_URL}/newnotification?${new URLSearchParams(params).toString()}`);
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
      <Box display="flex" justifyContent="flex-end">
        <Box sx={{ position: 'absolute', top: 0 }}>
          <SearchInput onChange={setSearchText} />
        </Box>
      </Box>
      {data.items && !loading && (
        <>
          <Box sx={{ position: 'relative' }}>
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
    </div>
  );
};

export default MessageNotification;
