// material-ui
import { Box, Button, Typography } from '@mui/material';
import FaqForm from 'components/faq-form';
import { useNavigate } from 'react-router-dom';
import axios from 'utils/axios';
import MainCard from 'components/MainCard';
import { BASE_URL } from 'config';
import { openSnackbar } from 'store/reducers/snackbar';
import { useDispatch } from 'react-redux';

const FaqCreate = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const createFaq = async (data: any) => {

    try {
      await axios.post(`${BASE_URL}/faq/`, data);
      history('/faq-list');
    } catch (error) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Unable to create faq',
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
        <Button href="/faq" color="secondary" size="small">
          <Typography color="textSecondary" variant="h6" sx={{ textDecoration: 'none' }}>
            Faq
          </Typography>
        </Button>
        /<Typography variant="h5">Create</Typography>
      </Box>
      <FaqForm onSubmit={createFaq} />
    </MainCard>
  );
};

export default FaqCreate;
