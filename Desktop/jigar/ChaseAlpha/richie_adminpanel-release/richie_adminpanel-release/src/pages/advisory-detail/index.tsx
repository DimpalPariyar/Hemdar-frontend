// material-ui
import { Button, CardMedia, List, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import axios from '../../utils/axios';
import MainCard from 'components/MainCard';
import { BASE_URL } from 'config';
import Dashboard1 from 'assets/images/widget/dashborad-1.jpg';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { secondFormSet } from 'components/advisory-form/constant';

const mediaSX = {
  width: 250,
  height: 150,
  borderRadius: 1
};

const AdvisoryDetail = () => {
  const { id = '' } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>();

  useEffect(() => {
    axios.get(`${BASE_URL}/advisory/product/${id}`).then((response) => {
      setProduct(response.data);
      // console.log(response.data);
    });
  }, []);

  const CustomListItem = ({ fieldName, fieldValue = '-' }: any) => {
    return (
      <Stack mb={4} width={250} spacing={0.5}>
        <Typography mb={1} variant="h6" color="secondary">
          {fieldName}
        </Typography>
        <Typography variant="h5">{fieldValue}</Typography>
      </Stack>
    );
  };

  return (
    <MainCard sx={{ overflow: 'auto', px: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" mb={2} gap={1}>
          <Button href="/advisory" color="primary" size="small">
            <Typography color="textSecondary" variant="h6" sx={{ textDecoration: 'none' }}>
              Advisory
            </Typography>
          </Button>
          /<Typography variant="h5">{product?.productTitle}</Typography>
        </Box>
        <Button href={`/advisory-edit/${id}`} variant="contained" color="primary" size="small">
          Edit
        </Button>
      </Box>
      <Typography variant="h3" mb={3} fontWeight="600">{`Product Name - ${product?.productTitle}`}</Typography>
      <List sx={{ py: 0 }}>
        <Box display="flex" mb={5} flexDirection="row" flexWrap="wrap">
          {product && (
            <>
              <Box mr={5}>
                <CardMedia component="img" image={Dashboard1} title="image" sx={mediaSX} />
              </Box>
              <CustomListItem fieldName={'Product Name'} fieldValue={product?.productTitle} />
              <CustomListItem fieldName={'Min Invest Label'} fieldValue={product?.minInvestLabel} />
            </>
          )}
        </Box>
        <Stack direction="row" mt={3} flexWrap="wrap" gap={2}>
          {secondFormSet.map((field) => {
            const data: any = product?.[field.name] || {};
            return <CustomListItem fieldName={field.label} fieldValue={data[field.labelKey]} />;
          })}
        </Stack>
        <Box display="flex" flexDirection="column" gap={2}>
          {product &&
            product?.subscriptionPlanIds.map((plan: any, index: number) => {
              return (
                <div key={index}>
                  <Typography variant="h3" mb={3} fontWeight="600">{`Subcription Plan ${index + 1}`}</Typography>
                  <Box display="flex" flexDirection="row" flexWrap="wrap">
                    {Object.keys(plan).map((key, idx) => {
                      if (key === 'priceName') {
                        return <CustomListItem fieldName={'Plan Name'} fieldValue={plan?.priceName} />;
                      }
                      if (key === 'numOfSessions') {
                        return <CustomListItem fieldName={'Number of Sessions'} fieldValue={plan?.numOfSessions} />;
                      }
                      if (key === 'actualPrice') {
                        return <CustomListItem fieldName={'Actual Price'} fieldValue={plan?.actualPrice} />;
                      }
                      if (key === 'discountPercentage') {
                        return <CustomListItem fieldName={'Discount Percentage'} fieldValue={plan?.discountPercentage} />;
                      }
                      if (key === 'discountedPrice') {
                        return <CustomListItem fieldName={'Discounted Price'} fieldValue={plan?.discountedPrice} />;
                      }
                      if (key === 'validityPeriodInDays') {
                        return <CustomListItem fieldName={'Validity Period (InDays)'} fieldValue={plan?.validityPeriodInDays} />;
                      }
                      return <></>;
                    })}
                  </Box>
                </div>
              );
            })}
        </Box>
      </List>
    </MainCard>
  );
};

export default AdvisoryDetail;
