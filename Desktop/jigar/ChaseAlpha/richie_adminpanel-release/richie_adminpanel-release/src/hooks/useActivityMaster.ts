import { BASE_URL } from 'config';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/reducers/snackbar';
import axios from 'utils/axios';

const useMaster = ({ apiUrl, isAllowToFetch = true }: any) => {
  const [data, setData] = useState<any>([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      if (isAllowToFetch) {
        const response = await axios.get(`${BASE_URL}/advisory/${apiUrl}`);
        setData(response.data);
      }
    } catch (error) {
      console.log({ error: error });
    }
  };

  useEffect(() => {
    getData();
  }, [apiUrl]);

  const deleteItem = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/advisory/${apiUrl}/${id}`);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Deleted successfully.',
          variant: 'alert',
          alert: {
            color: 'success'
          }
        })
      );
    } finally {
      getData();
    }
  };

  const updateItem = async (id: string, data: any) => {
    try {
      await axios.put(`${BASE_URL}/advisory/${apiUrl}/${id}`, data);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Updated successfully.',
          variant: 'alert',
          alert: {
            color: 'success'
          }
        })
      );
    } finally {
      getData();
    }
  };
  const createItem = async (data: any) => {
    try {
      await axios.post(`${BASE_URL}/advisory/${apiUrl}`, data);
    } finally {
      getData();
    }
  };

  return { data, createItem, deleteItem, updateItem };
};

export default useMaster;
