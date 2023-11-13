import React, { useEffect, useState } from 'react';
import axios from 'utils/axios';
import { BASE_URL } from 'config';
import BasicTable from 'components/react-table/BasicTable';
import SearchInput from 'components/SearchInput';
import Loader from 'components/Loader';
import { Box } from '@mui/system';
import { columns } from './constant';

const HniList = () => {
  const [hnilist, sethnilist] = useState();
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalUser, setTotalUser] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>('');

  const getHnilist = async () => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: 10
      };
      if (searchText) params.search = searchText;
      const response = await axios.get(`${BASE_URL}/hni?${new URLSearchParams(params).toString()}`);
      sethnilist(response.data);
      setTotalUser(response.data.total);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handlePageChange = (page: number) => {
    setPage(page);
  };
  useEffect(() => {
    getHnilist();
  }, [page, searchText]);
  return (
    <div>
      {(!hnilist || loading) && <Loader />}
      <Box display="flex" flexDirection="column">
        <Box display="flex" justifyContent="flex-end">
          <Box sx={{ position: 'absolute', top: 0 }}>
            <SearchInput onChange={setSearchText} />
          </Box>
        </Box>
        {hnilist && (
          <BasicTable
            columns={columns}
            getHeaderProps={(column: any) => column.getSortByToggleProps()}
            data={hnilist}
            //   currentPage={data.page}
            //   totalPage={data.pageTotal}
            onPageChange={handlePageChange}
            striped
          />
        )}
      </Box>
    </div>
  );
};

export default HniList;
