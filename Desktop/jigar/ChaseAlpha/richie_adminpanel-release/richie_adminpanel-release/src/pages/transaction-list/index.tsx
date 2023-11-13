import axios from 'utils/axios';
import { BASE_URL } from 'config';
import { useEffect, useState } from 'react';
import BasicTable from 'components/react-table/BasicTable';
import { columns } from './constant';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';

const TransactionList = () => {
  const [data, setData] = useState<any>([]);

  const init = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/transaction-list`);
      setData(response.data.data || []);
    } catch (error) {
      console.log({ error: error });
    }
  };

  useEffect(() => {
    init();
  }, []);
  return (
    <MainCard content={false}>
      <ScrollX>
        <BasicTable columns={columns} getHeaderProps={(column: any) => column.getSortByToggleProps()} data={data} striped />
      </ScrollX>
    </MainCard>
  );
};

export default TransactionList;
