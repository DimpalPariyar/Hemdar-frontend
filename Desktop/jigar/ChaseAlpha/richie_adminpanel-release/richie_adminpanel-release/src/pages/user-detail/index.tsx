import axios from 'utils/axios';
import { useParams } from 'react-router';
import { BASE_URL } from 'config';
import { useEffect, useState } from 'react';
import ScrollX from 'components/ScrollX';
import { Stack, Typography } from '@mui/material';
import UserInfo from './UserInfo';
import ActivityTab from './ActivityTab';

const UserDetail = () => {
  const [data, setData] = useState<any>();
  const { id = '' } = useParams<{ id: string }>();

  const init = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/users/list/${id}`);
      // const userDetail = (response.data.data || []).find(({ _id }: any) => _id === id);
      setData(response?.data)
    } catch (error) {
      console.log({ error: error });
    }
  };

  useEffect(() => {
    init();
  }, []);
  return (
    <ScrollX>
      <Typography variant="h3" py={3} mb={1} fontWeight="600">
        Personal Details
      </Typography>
      <Stack flexDirection="column" gap={2}>
        <UserInfo info={data} />
        <ActivityTab userInfo={data} />
      </Stack>
    </ScrollX>
  );
};

export default UserDetail;
