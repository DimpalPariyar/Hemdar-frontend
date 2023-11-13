import { BASE_URL } from 'config';
import axios from '../../utils/axios';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, InputBase, InputLabel, Paper, Stack, Typography } from '@mui/material';

export const Formset = [
  { name: 'typeofNotificaiton', label: 'Type of Notification ', type: 'text' },
  { name: 'notificationDescription', label: 'Notification Description ', type: 'text' },
  { name: 'notificationLimit', label: 'Notification Limit', type: 'text' }
];

export const initialValues = {
  typeofNotificaiton: '',
  notificationDescription: '',
  notificationLimit: ''
};

export const columns = [
  {
    Header: 'Type of Notification ',
    disableFilters: true,
    accessor: 'typeofNotification'
  },
  {
    Header: 'Notification Description',
    accessor: 'notificationDescription'
  },
  {
    Header: 'Notification Limit',
    disableFilters: true,
    accessor: 'notificationLimit'
  },
  {
    Header: 'Delete',
    className: 'cell-right',
    accessor: ({ _id }: any) => {
      const deleteOrderhandler = async () => {
        await axios.delete(`${BASE_URL}/notification/delete/${_id}`).then((response: any) => {
          const data = response.data;
          window.location.reload();
        });
      };
      return (
        <IconButton onClick={deleteOrderhandler}>
          <IconButton color="secondary">
            <DeleteIcon />
          </IconButton>
        </IconButton>
      );
    }
  }
];
