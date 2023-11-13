import React, { useEffect, useState } from 'react';
import axios from 'utils/axios';
import { BASE_URL } from 'config';
import Loader from 'components/Loader';
import { columns } from './constant';
import BasicTable from '../../components/react-table/BasicTable';
import { useDispatch, useSelector } from 'store';
import { getResearchList } from '../../store/reducers/researchList';

const TechAnalystList = () => {
  const dispatch = useDispatch();
  const { researchList } = useSelector((state) => state.researchList);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const handlePageChange = (p: number) => {
    setPage(page);
  };
  useEffect(() => {
    dispatch(getResearchList());
  }, []);
  return (
    <>
      {(!researchList || loading) && <Loader />}
      <BasicTable columns={columns} data={researchList} currentPage={page} onPageChange={handlePageChange} striped />
    </>
  );
};

export default TechAnalystList;
