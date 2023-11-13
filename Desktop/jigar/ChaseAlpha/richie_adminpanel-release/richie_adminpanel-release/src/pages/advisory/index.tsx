import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import RichieHeader from 'components/RichieHeader';
import { PlusOutlined } from '@ant-design/icons';
import { Box, Button } from '@mui/material';
import { useEffect } from 'react';
import ProductItem from './ProductItem';
import { useDispatch, useSelector } from 'store';
import { getAdvisoryProducts } from 'store/reducers/advisoryProduct';

const RenderAdvisory = () => {
  const dispatch = useDispatch();
  const { advisoryProducts } = useSelector((state) => state.advisoryProduct);

  useEffect(() => {
    dispatch(getAdvisoryProducts());
  }, []);

  return (
    <>
      <MainCard content={false}>
        <ScrollX>
          <RichieHeader title="List of Advisory Products">
            <Box display="flex" alignItems="flex-end" gap={2}>
              <Button variant="contained" startIcon={<PlusOutlined />} href="/advisory-create">
                Add Product
              </Button>
            </Box>

            {advisoryProducts &&
              advisoryProducts.map((product: any) => {
                return <ProductItem product={product} />;
              })}
          </RichieHeader>
        </ScrollX>
      </MainCard>
    </>
  );
};

export default RenderAdvisory;
