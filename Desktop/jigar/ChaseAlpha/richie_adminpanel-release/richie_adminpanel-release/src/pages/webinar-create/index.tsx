// material-ui
import { Box, Button, Typography } from '@mui/material';
import WebinarForm from 'components/webinar-form';
import { useNavigate } from 'react-router-dom';
import axios from 'utils/axios';
import MainCard from 'components/MainCard';
import { BASE_URL } from 'config';
import { openSnackbar } from 'store/reducers/snackbar';
import { useDispatch } from 'react-redux';

const WebinarCreate = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const createWebinar = async (data: any) => {
    const payload = data;
    payload.priceIds = [];
    payload.priceIds.push({
      actualPrice: data.actualPrice,
      discountPercentage: data.discountPercentage,
      discountedPrice: data.discountedPrice
    });
    payload.linkIds.push({
      linkUrl: data.link
    });
    delete payload.link;
    delete payload.actualPrice;
    delete payload.discountPercentage;
    delete payload.discountedPrice;
    try {
      await axios.post(`${BASE_URL}/learning/webinar`, payload);
      history('/webinar-list');
    } catch (error) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Unable to create the webinar',
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
        <Button href="/webinar-list" color="primary" size="small">
          <Typography color="textSecondary" variant="h6" sx={{ textDecoration: 'none' }}>
            Webinar
          </Typography>
        </Button>
        /<Typography variant="h5">Create</Typography>
      </Box>
      <WebinarForm onSubmit={createWebinar} />
    </MainCard>
  );
};

export default WebinarCreate;
