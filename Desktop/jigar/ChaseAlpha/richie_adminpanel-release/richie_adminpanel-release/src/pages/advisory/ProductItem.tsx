// material-ui
import { EyeTwoTone, EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { Button, CardMedia, Grid, Stack, Tooltip, Typography, useTheme } from '@mui/material';
// assets
import Dashboard1 from 'assets/images/widget/dashborad-1.jpg';
import axios from 'utils/axios';
import { BASE_URL } from 'config';
import { openSnackbar } from 'store/reducers/snackbar';
import { getAdvisoryProducts } from 'store/reducers/advisoryProduct';
import { useDispatch } from 'store';

const mediaSX = {
  width: 150,
  height: 150,
  borderRadius: 1
};

const ProductItem = ({ product }: any) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const handleDeleteProduct = (id: string) => {
    axios.delete(`${BASE_URL}/advisory/product/${id}`).then(async () => {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Product is deleted successfully',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: true
        })
      );
      dispatch(getAdvisoryProducts());
    });
  };
  const collapseIcon = <EyeTwoTone twoToneColor={theme.palette.secondary.main} />;
  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      <Grid item xs={12}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <CardMedia component="img" image={Dashboard1} title="image" sx={mediaSX} />
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  align="left"
                  variant="h4"
                  sx={{ maxWidth: '450px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {product?.productTitle || 'Product Name'}
                </Typography>
                <Typography
                  align="left"
                  style={{ padding: 0, margin: 0, maxWidth: '450px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {product?.description || 'Description'}
                </Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                  <Typography align="left" sx={{ maxWidth: '450px' }} variant="subtitle2">
                    Basket #stocks
                  </Typography>
                  <Typography align="left" sx={{ maxWidth: '450px' }} variant="subtitle2">
                    {product?.basketStocks || ''}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                  <Typography align="left" sx={{ maxWidth: '450px' }} variant="subtitle2">
                    {product?.minInvestLabel || 'Minimum Invest'}
                  </Typography>
                  <Typography align="left" sx={{ maxWidth: '450px' }} variant="subtitle2">
                    {product?.minInvest || ''}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                  <Typography align="left" sx={{ maxWidth: '450px' }} variant="subtitle2">
                    Volatility
                  </Typography>
                  <Typography align="left" sx={{ maxWidth: '450px' }} variant="subtitle2">
                    {product?.volatility || ''}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
            <Stack direction="row" alignItems="left" justifyContent="left" spacing={0}>
              <Tooltip title="View">
                <Button href={`advisory-detail/${product._id}`} color="secondary" size="small" startIcon={collapseIcon}>
                  View
                </Button>
              </Tooltip>
              <Tooltip title="Edit">
                <Button
                  href={`advisory-edit/${product._id}`}
                  color="primary"
                  size="small"
                  startIcon={<EditTwoTone twoToneColor={theme.palette.primary.main} />}
                >
                  Edit
                </Button>
              </Tooltip>
              <Tooltip title="Delete">
                <Button
                  color="error"
                  size="small"
                  startIcon={<DeleteTwoTone twoToneColor={theme.palette.error.main} />}
                  onClick={() => handleDeleteProduct(product._id)}
                >
                  Delete
                </Button>
              </Tooltip>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProductItem;
