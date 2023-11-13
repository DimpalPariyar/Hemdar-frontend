import { BASE_URL } from 'config';
import axios from 'utils/axios';
import { useParams } from 'react-router';
import { Box } from '@mui/system';
import Loader from 'components/Loader';
import BasicTable from 'components/react-table/BasicTable';
import ScrollX from 'components/ScrollX';
import Emoji from 'react-emoji-render';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button, Stack, TextField } from '@mui/material';
import { SendOutlined } from '@ant-design/icons';

const columns = [
  {
    Header: 'Message',
    accessor: 'message'
  },
  {
    Header: 'Date',
    accessor: ({ createdAt }: any) => (createdAt ? format(new Date(createdAt), 'dd MMM yyyy') : 'NA')
  },
  {
    Header: 'Time',
    accessor: ({ createdAt }: any) => (createdAt ? format(new Date(createdAt), 'HH:mm') : 'NA')
  },
  {
    Header: 'Reactions',
    accessor: ({ reactions }: any) => (
      <Stack gap={2}>
        {reactions.map((reaction: any) => (
          <Emoji text={reaction.emoji} />
        ))}
      </Stack>
    )
  }
];

function BroadcastList() {
  const { id = '' } = useParams<{ id: string }>();
  const [participants, setParticipants] = useState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const getSession = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/learning/broadcast?sessionId=${id}`);
      setParticipants(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const submitSession = async () => {
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/learning/broadcast`, { sessionId: id, message });
      setMessage('');
    } catch (error) {
      console.log(error);
    } finally {
      getSession();
      setLoading(false);
    }
  };

  useEffect(() => {
    getSession();
  }, []);

  if (!participants || loading) {
    return <Loader />;
  }
  return (
    <Box display="flex" flexDirection="column">
      <ScrollX>
        <BasicTable columns={columns} data={participants} striped disableFilters />
      </ScrollX>
      <Stack alignItems="cemter" flexDirection="row" gap={2} mt={2}>
        <TextField fullWidth value={message} onChange={(e: any) => setMessage(e.target.value)} />
        <Button disabled={loading || !message} variant="contained" startIcon={<SendOutlined />} size="large" onClick={submitSession}>
          Send
        </Button>
      </Stack>
    </Box>
  );
}

export default BroadcastList;
