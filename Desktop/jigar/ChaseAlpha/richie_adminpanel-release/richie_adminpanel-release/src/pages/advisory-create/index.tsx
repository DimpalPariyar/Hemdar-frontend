// material-ui
import { Box, Button, Typography } from '@mui/material';
import AdvisoryForm from 'components/advisory-form';
import { useNavigate } from 'react-router-dom';
import axios from 'utils/axios';
import MainCard from 'components/MainCard';
import { BASE_URL } from 'config';
import { openSnackbar } from 'store/reducers/snackbar';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

const AdvisoryCreate = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const [finaldata, setFinaldata] = useState({});

  const createAdvisory = async (data: any) => {
    const value = data?.relatedProductsIds?.map((x: any) => x.value);
    setFinaldata(() => {
      return {
        ...data,
        Active: true,
        relatedProductsIds: value
      };
    });
    if (Object.keys(finaldata).length > 0) {
      try {
        await axios.post(`${BASE_URL}/advisory/product`, finaldata);
        history('/advisory');
      } catch (error) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Unable to create the product',
            variant: 'alert',
            alert: {
              color: 'error'
            }
          })
        );
      }
    }
  };
  return (
    <MainCard sx={{ overflow: 'auto', px: 2 }}>
      <Box display="flex" alignItems="center" mb={2} gap={1}>
        <Button href="/advisory" color="primary" size="small">
          <Typography color="textSecondary" variant="h6" sx={{ textDecoration: 'none' }}>
            Advisory
          </Typography>
        </Button>
        /<Typography variant="h5">Create</Typography>
      </Box>
      <AdvisoryForm onSubmit={createAdvisory} />
    </MainCard>
  );
};

export default AdvisoryCreate;
