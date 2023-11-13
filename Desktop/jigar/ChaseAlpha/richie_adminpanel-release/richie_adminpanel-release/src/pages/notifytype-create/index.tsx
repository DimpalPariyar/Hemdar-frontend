import NotifyTypesForm from 'components/NotifyType-form';
import axios from 'utils/axios';
import { BASE_URL } from 'config';
import { useEffect, useState } from 'react';
import { columns } from './constant';
import BasicTable from 'components/react-table/BasicTable';

const TypeOfNotification = () => {
  const [showTable, setShowTable] = useState(false);
  const [data, setData] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (data: any) => {
    try {
      await axios.post(`${BASE_URL}/notification/create/types`, data).then(() => showTable);
      init();
    } catch (error) {}
  };
  const init = async () => {
    try {
      await axios.get(`${BASE_URL}/notification/getall/types`).then((data) => {
        setData(data.data);
        setShowTable(true);
      });
    } catch (error) {}
  };
  useEffect(() => {
    init();
    setShowTable(true);
  }, [showTable]);

  const handlePageChange = (page: number) => {
    setPage(page);
  };
  return (
    <div>
      <NotifyTypesForm onSubmit={onSubmit} />
      {data.length > 0 && showTable && (
        <>
          <BasicTable
            columns={columns}
            getHeaderProps={(column: any) => column.getSortByToggleProps()}
            data={data}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default TypeOfNotification;
