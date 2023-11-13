// material-ui
import { Box, Button, Typography } from '@mui/material';
import axios from 'utils/axios';
import lodash from 'lodash';
import MainCard from 'components/MainCard';
import { BASE_URL } from 'config';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import AdvisoryForm from 'components/advisory-form';
import { openSnackbar } from 'store/reducers/snackbar';
import { useDispatch } from 'react-redux';

const AdvisoryEdit = () => {
  const { id = '' } = useParams<{ id: string }>();
  const [advisory, setAdvisory] = useState<any>(null);
  const dispatch = useDispatch();

  const getAdvisory = async () => {
    try {
      await axios.get(`${BASE_URL}/advisory/product/${id}`).then((response: any) => {
        const advisoryData = response.data;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, subscriptionPlanIds, ...rest } = advisoryData;
        console.log(advisoryData);
        setAdvisory({
          ...rest,
          hostProfileId: rest.hostProfileId ? rest.hostProfileId._id : null,
          marketId: rest.marketId ? rest.marketId._id : null,
          exchangeId: rest.exchangeId ? rest.exchangeId._id : null,
          productTypeId: rest.productTypeId ? rest.productTypeId._id : null,
          instrumentId: rest.instrumentId ? rest.instrumentId._id : null,
          timeFrameId: rest.timeFrameId ? rest.timeFrameId._id : null,
          volatilityId: rest.volatilityId ? rest.volatilityId._id : null,
          subscriptionPlanIds: subscriptionPlanIds.map((subscriptionPlan: any) => lodash.omit(subscriptionPlan, ['_id']))
        });
      });
    } catch (error) {
      console.log(error);
      setAdvisory(null);
    }
  };

  const updateAdvisory = async (data: any) => {
    try {
      const value = data.relatedProductsIds.map((x: any) => x.value)
      const relatedproductdata = {
        ...data,
        relatedProductsIds: value
      }
      await axios.put(`${BASE_URL}/advisory/product/${id}`, relatedproductdata);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Product Updated',
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
          message: 'Unable to update the product',
          variant: 'alert',
          alert: {
            color: 'error'
          }
        })
      );
    } finally {
      getAdvisory();
    }
  };

  useEffect(() => {
    getAdvisory();
  }, []);

  return (
    <MainCard sx={{ overflow: 'auto', px: 2 }}>
      <Box display="flex" alignItems="center" mb={2} gap={1}>
        <Button href="/advisory" color="primary" size="small">
          <Typography color="textSecondary" variant="h6" sx={{ textDecoration: 'none' }}>
            Advisory
          </Typography>
        </Button>
        /<Typography variant="h5">Edit</Typography>
      </Box>
      <AdvisoryForm defaultState={advisory} onSubmit={updateAdvisory} />
    </MainCard>
  );
};

export default AdvisoryEdit;
