// material-ui
import { Box, Button, Typography } from '@mui/material';
import FaqForm from 'components/faq-form';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'utils/axios';
import MainCard from 'components/MainCard';
import { BASE_URL } from 'config';
import { openSnackbar } from 'store/reducers/snackbar';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';

const FaqEdit = () => {
  const history = useNavigate();
  const [faq, setFaq] = useState<any>();
  const { id = '' } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(`${BASE_URL}/faq/${id}`).then((response) => {
      setFaq(response.data);
    });
  }, []);
  const updateFaq = async (data: any) => {
    try {
      await axios.put(`${BASE_URL}/faq/${id}`, data);
      history('/faq-list');
    } catch (error) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Unable to update faq',
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
        <Button href="/faq-list" color="secondary" size="small">
          <Typography color="textSecondary" variant="h6" sx={{ textDecoration: 'none' }}>
            Faq
          </Typography>
        </Button>
        /<Typography variant="h5">Update</Typography>
      </Box>
      <FaqForm defaultState={faq} onSubmit={updateFaq} />
    </MainCard>
  );
};

export default FaqEdit;
