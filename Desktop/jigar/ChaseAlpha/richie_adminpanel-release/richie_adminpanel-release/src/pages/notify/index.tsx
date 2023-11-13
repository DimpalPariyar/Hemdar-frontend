// material-ui
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'utils/axios';
import MainCard from 'components/MainCard';
import { BASE_URL } from 'config';
import { openSnackbar } from 'store/reducers/snackbar';
import { useDispatch } from 'react-redux';
import NotificationForm from './Form';
const fileHeader = {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
};
const Notify = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const createNotification = async (data: any) => {
    const payload = data;
    payload.productIds = [data.advisoryId];
    payload.targetAudience = data.targetaudience?.[0].label;
    delete payload.advisoryId;
    const formData = new FormData();
    try {
      if (data.notificationImage) {
        formData.append(
          'image',
          data.notificationImage[0].file,
          `picture-notification${Math.floor(Math.random() * 1000000)}-${Math.floor(Math.random() * 100)}`
        );
        const chartResponse = await axios.post(`${BASE_URL}/image`, formData, fileHeader);
        payload.notificationImage = chartResponse.data.url;
      }
      if (data.everyone) {
        axios.post(`${BASE_URL}/newnotification/everyone`, payload).then((data: any) => {
          alert(data.data);
        });
      } else {
        axios.post(`${BASE_URL}/newnotification`, payload).then((data:any) => {
          alert(data.data.message);
        });
      }
      // await axios.post(`${BASE_URL}/notification`, payload);
      history('/admin/message-notification-list');
    } catch (error) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Unable to post the notification',
          variant: 'alert',
          alert: {
            color: 'error'
          }
        })
      );
    }
  };
  return (
    <MainCard sx={{ overflow: 'auto', px: 2 }}>
      <Box display="flex" alignItems="center" mb={2} gap={1}>
        <Button href="/advice" color="primary" size="small">
          <Typography color="textSecondary" variant="h6" sx={{ textDecoration: 'none' }}>
            Advice
          </Typography>
        </Button>
        /<Typography variant="h5">Notify</Typography>
      </Box>
      <NotificationForm onSubmit={createNotification} />
    </MainCard>
  );
};

export default Notify;
