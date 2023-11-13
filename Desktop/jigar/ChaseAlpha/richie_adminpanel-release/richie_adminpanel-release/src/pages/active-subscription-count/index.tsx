import React, { useEffect, useState } from 'react'
import axios from 'utils/axios'
import { BASE_URL } from 'config';
import { columns } from './constant';
import BasicTable from '../../components/react-table/BasicTable';
import Loader from 'components/Loader';

const ActiveSubscriptionCount = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const init = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/admin/ProductSubCount`);
      setData(response.data.item);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    init();
  }, []);
  const handlePageChange = (p: number) => {
    setPage(p);
  };
  return (
    <>
      {(!data || loading) && <Loader />}
      <BasicTable columns={columns} data={data} currentPage={page} onPageChange={handlePageChange} striped />
    </>
  );
};

export default ActiveSubscriptionCount;
