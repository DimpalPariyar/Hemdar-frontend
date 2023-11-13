// material-ui
import { Box, Button, Typography } from '@mui/material';
import AdviceForm from './Form';
import { useNavigate } from 'react-router-dom';
import axios from 'utils/axios';
import MainCard from 'components/MainCard';
import { BASE_URL } from 'config';
import { openSnackbar } from 'store/reducers/snackbar';
import { useDispatch } from 'react-redux';

const fileHeader = {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
};

const AdviceCreate = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const createAdvice = async (data: any) => {
    try {
      const formData = new FormData();
      const payload = { ...data };

      // payload.advisoryId = [payload.advisoryId, ...comboadvisory.filter((x: any) => x.relatedProducts.includes(payload.advisoryId)).map((x: any) => x.value)]
      payload.strategy[0].action = payload.action;
      payload.strategy[0].name = payload.nameOfUnderlying;
      payload.strategy[0].ltp = payload.cmp;
      payload.strategy[0].expiry = payload.expiry;
      payload.strategy[0].strike = payload.optionStrike;
      payload.strategy[0].optionType = payload.optionType;
      delete payload.action;
      delete payload.cmp;
      delete payload.expiry;
      delete payload.optionStrike;
      delete payload.optionType;

      delete payload.nameOfUnderlyingDataId;
      delete payload.expiryDataId;
      delete payload.optionStrikeDataId;
      delete payload.optionTypeDataId;

      if (data.attachment) {
        formData.append('image', data.attachment[0].file);
        const attachmentResponse = await axios.post(`${BASE_URL}/image`, formData, fileHeader);
        formData.delete('image');
        payload.attachment = attachmentResponse.data.url;
      }

      if (data.internalChart) {
        formData.append(
          'image',
          data.internalChart[0].file,
          `picture${Math.floor(Math.random() * 1000000)}-${Math.floor(Math.random() * 100)}`
        );
        const chartResponse = await axios.post(`${BASE_URL}/image`, formData, fileHeader);
        payload.internalChart = chartResponse.data.url;
      }

      await axios.post(`${BASE_URL}/advisory/advice`, payload);
      history('/advice');
    } catch (error) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Unable to create the advice',
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
        /<Typography variant="h5">Create</Typography>
      </Box>
      <AdviceForm onSubmit={createAdvice} />
    </MainCard>
  );
};

export default AdviceCreate;
