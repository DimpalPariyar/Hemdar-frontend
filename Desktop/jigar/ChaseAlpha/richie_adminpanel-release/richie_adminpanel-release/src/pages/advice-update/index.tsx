import { useParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from '../../utils/axios';
import { BASE_URL } from '../../config';
import { openSnackbar } from '../../store/reducers/snackbar';
import MainCard from '../../components/MainCard';
import { Box, Button, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AdviceForm from '../advice-create/Form';
import { defaultUpdate } from '../advice-create/constant';
import _ from 'lodash';

const AdviceUpdate = () => {
  const { id = '' } = useParams<{ id: string }>();
  const [advice, setAdvice] = useState<any>(null);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const history = useNavigate();

  const getAdvice = async () => {
    try {
      // await axios.get(`${BASE_URL}/advisory/advice/${id}`).then((response: any) => {
      //   const adviceData = response.data;
      //   // adviceData.updates.push(defaultUpdate);
      //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
      //   const { _id, ...rest } = adviceData;
      //   setAdvice({
      //     ...rest,
      //     hostProfileId: rest.hostProfileId._id,
      //     advisoryId: rest.advisoryId._id,
      //     marketId: rest.marketId._id,
      //     exchangeId: rest.exchangeId._id,
      //     productTypeId: rest.productTypeId._id,
      //     instrumentId: rest.instrumentId._id,
      //     timeFrameId: rest.timeFrameId._id,
      //     action: rest.strategy?.[0]?.action ?? '',
      //     cmp: rest.strategy?.[0].ltp,
      //     expiry: rest.strategy?.[0]?.expiry ?? '',
      //     optionStrike: rest.strategy?.[0].strike ?? '',
      //     optionType: rest.strategy?.[0].optionType ?? ''
      //   }
      //   );
      // });
      await axios.get(`${BASE_URL}/advisory/advice/${id}`)
        .then((response) => {
          const adviceData = response.data;
          adviceData.updates.push(defaultUpdate);
          setAdvice(() => {
            return {
              ...adviceData,
              hostProfileId: adviceData.hostProfileId._id,
              advisoryId: adviceData.advisoryId._id,
              marketId: adviceData.marketId._id,
              exchangeId: adviceData.exchangeId._id,
              productTypeId: adviceData.productTypeId._id,
              instrumentId: adviceData.instrumentId._id,
              timeFrameId: adviceData.timeFrameId._id,
              action: adviceData.strategy?.[0]?.action || adviceData?.action || '',
              cmp: adviceData.strategy?.[0].ltp,
              expiry: adviceData.strategy?.[0]?.expiry ?? '',
              optionStrike: adviceData.strategy?.[0].strike ?? '',
              optionType: adviceData.strategy?.[0].optionType ?? '',
              Active: adviceData.Active
            };
          });
        })
        .catch((e) => {
          console.log(e.response.data.message);
          setError(e.response.data.message);
        });
    } catch (error) {
      console.log(error);
      setAdvice(null);
    }
  };
  const updateAdvice = async (data: any) => {
    const updateNotification: any = _.last(data.updates);
    try {
      if (updateNotification.newStatus || updateNotification.price || updateNotification.remarks) {
        await axios.put(`${BASE_URL}/advisory/advice-grid/${id}`, _.last(data.updates));
      } else {
        await axios.put(`${BASE_URL}/advisory/advice/${id}`, data);
      }

      dispatch(
        openSnackbar({
          open: true,
          message: 'Advice Updated',
          variant: 'alert',
          alert: {
            color: 'success'
          }
        })
      );
    } catch (error) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Unable to update the Advice',
          variant: 'alert',
          alert: {
            color: 'error'
          }
        })
      );
    } finally {
      getAdvice();
      history("/advice")
    }
  };

  useEffect(() => {
    getAdvice();
  }, []);

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
      {error &&
        <>
          <Dialog open={true}>
            <DialogContent>
              <p>{error}</p>
            </DialogContent>
          </Dialog>
        </>
      }
      <AdviceForm defaultState={advice} onSubmit={updateAdvice} />
    </MainCard>
  );
};

export default AdviceUpdate;
