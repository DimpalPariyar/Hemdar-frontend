import { BASE_URL } from 'config';
import axios from 'utils/axios';
import { useParams } from 'react-router';
import { Box } from '@mui/system';
import Loader from 'components/Loader';
import BasicTable from 'components/react-table/BasicTable';
import ScrollX from 'components/ScrollX';
import { useState, useEffect } from 'react';
import { EyeTwoTone } from '@ant-design/icons';
import { Tooltip, IconButton, Link, Stack } from '@mui/material';

const columns = [
  {
    Header: 'Name',
    accessor: 'name'
  },
  {
    Header: 'Mobile',
    accessor: 'mobile'
  },
  {
    Header: 'Email',
    accessor: 'email'
  },
  {
    Header: 'Actions',
    className: 'cell-right',
    accessor: 'id',
    disableSortBy: true,
    Cell: ({ value }: any) => {
      return (
        <Stack alignItems="center">
          <Link href={`/admin/user-list/detail/${value}`} underline="none">
            <Tooltip title="View">
              <IconButton color="secondary">
                <EyeTwoTone />
              </IconButton>
            </Tooltip>
          </Link>
        </Stack>
      );
    }
  }
];

function ParticipantList() {
  const { id = '' } = useParams<{ id: string }>();
  const [participants, setParticipants] = useState();

  const getParticipants = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/session/users?sessionId=${id}`);
      setParticipants(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getParticipants();
  }, []);

  if (!participants) {
    return <Loader />;
  }
  return (
    <Box display="flex" flexDirection="column">
      <ScrollX>
        <BasicTable columns={columns} data={participants} striped disableFilters />
      </ScrollX>
    </Box>
  );
}

export default ParticipantList;
