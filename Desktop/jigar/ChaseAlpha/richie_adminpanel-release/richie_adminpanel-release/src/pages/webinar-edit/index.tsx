// material-ui
import { Box, Button, Typography } from '@mui/material';
import axios from 'utils/axios';
import MainCard from 'components/MainCard';
import { BASE_URL } from 'config';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { openSnackbar } from 'store/reducers/snackbar';
import { useDispatch } from 'react-redux';
import WebinarForm from '../../components/webinar-form';

const WebinarEdit = () => {
  const { id = '' } = useParams<{ id: string }>();
  const [webinar, setWebinar] = useState<any>(null);
  const dispatch = useDispatch();

  const getWebinar = async () => {
    try {
      await axios.get(`${BASE_URL}/learning/webinar/${id}`).then((response: any) => {
        const webinarData = response.data;
        webinarData.actualPrice = webinarData.priceIds[0].actualPrice;
        webinarData.discountPercentage = webinarData.priceIds[0].discountPercentage;
        webinarData.discountedPrice = webinarData.priceIds[0].discountedPrice;
        webinarData.link = webinarData.linkIds[0].linkUrl;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, ...rest } = webinarData;
        setWebinar({
          ...rest
        });
      });
    } catch (error) {
      setWebinar(null);
    }
  };

  const updateWebinar = async (data: any) => {
    try {
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
      await axios.put(`${BASE_URL}/learning/webinar/${id}`, payload);
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
      getWebinar();
    }
  };

  useEffect(() => {
    getWebinar();
  }, []);

  console.log(id);
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
      <WebinarForm defaultState={webinar} onSubmit={updateWebinar} />
    </MainCard>
  );
};

export default WebinarEdit;
