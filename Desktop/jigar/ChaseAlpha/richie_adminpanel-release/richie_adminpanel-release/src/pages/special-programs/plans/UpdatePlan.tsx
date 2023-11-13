import { Button, FormHelperText, Grid, InputLabel, Stack, TextField } from '@mui/material';
import { openSnackbar } from 'store/reducers/snackbar';
import { useDispatch } from 'store';
import AnimateButton from 'components/@extended/AnimateButton';
import { Form, Formik, setNestedObjectValues } from 'formik';

// project imports
import MainCard from 'components/MainCard';
// third-party
import * as yup from 'yup';
import axios from 'utils/axios';
import { BASE_URL } from 'config';

const validationSchema = yup.object({
    priceName: yup.string().required('priceName is required'),
  numOfSessions: yup.number().required('Number Of Sessions is required').typeError('no Of sessions must be number'),
  actualPrice: yup.number().required('Actual Price is required').typeError('Actual Price must be number'),
  discount: yup.number().typeError('discount must be number')
});

interface Props {
  handleClose: () => void;
  plan: any;
}
const UpdatePlan = ({ handleClose, plan }: Props) => {
  const dispatch = useDispatch();

  // console.log(plan);

  const handleClickNext = (formik: any) => {
    formik.setTouched(setNestedObjectValues(formik.values, true));
  };

  const handleSubmit = async (values: any) => {
    console.log(values);
    // console.log(plan);
    let payload = {
      id: plan._id,
        priceName: values.priceName,
      numOfSessions: values.numOfSessions,
      actualPrice: values.actualPrice,
      discountPercentage: values.discount,
      discountedPrice: values.discountedPrice,
      bannerImage: values.bannerImage
    };
    axios.put(`${BASE_URL}/learning/plan/${plan._id}`, payload).then(() => {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Existing Plan is updated successfully',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: true
        })
      );
      // console.log(values);
    });
    handleClose();
  };
  return (
    <Formik
      initialValues={{
        priceName: plan?.priceName || '',
        numOfSessions: plan?.numOfSessions || '',
        bannerImage: plan?.bannerImage || '',
        actualPrice: plan?.actualPrice || 0,
        discountedPrice: plan?.discountedPrice || 0,
        discount: plan?.discountPercentage || 0
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => {
        return (
          <Form>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <MainCard title="Update the Plan">
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} lg={6}>
                      <Stack spacing={0.5}>
                        <InputLabel>Plan Name</InputLabel>
                        <TextField
                          fullWidth
                          id="priceName"
                          name="priceName"
                          placeholder="Enter your priceName"
                          type="priceName"
                          value={formik.values.priceName}
                          onChange={formik.handleChange}
                          error={formik.touched.priceName && Boolean(formik.errors.priceName)}
                          helperText={formik.touched.priceName && formik.errors.priceName}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <Stack spacing={0.5}>
                        <InputLabel>No of Session</InputLabel>
                        <TextField
                          fullWidth
                          id="numOfSessions"
                          name="numOfSessions"
                          type="numOfSessions"
                          value={formik.values.numOfSessions}
                          onChange={formik.handleChange}
                          error={formik.touched.numOfSessions && Boolean(formik.errors.numOfSessions)}
                          helperText={formik.touched.numOfSessions && formik.errors.numOfSessions}
                          placeholder="Enter No of Session"
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <Stack spacing={0.5}>
                        <InputLabel>Banner Image</InputLabel>
                        <TextField
                          fullWidth
                          id="bannerImage"
                          name="bannerImage"
                          type="bannerImage"
                          value={formik.values.bannerImage}
                          onChange={formik.handleChange}
                          error={formik.touched.bannerImage && Boolean(formik.errors.bannerImage)}
                          helperText={formik.touched.bannerImage && formik.errors.bannerImage}
                          placeholder="Banner Image"
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <Stack spacing={0.5}>
                        <InputLabel>Actual Price</InputLabel>
                        <TextField
                          fullWidth
                          name="actualPrice"
                          type="actualPrice"
                          value={formik.values.actualPrice}
                          onChange={(e: any) => {
                            // console.log(e.target.value);
                            if (formik.values.discount) {
                              const discountPric: any = e.target.value - (e.target.value * formik.values.discount) / 100;
                              formik.setFieldValue('discountedPrice', discountPric, true);
                            } else {
                              formik.setFieldValue('discountedPrice', e.target.value, true);
                            }
                            formik.handleChange(e);
                          }}
                          placeholder="Please enter Actual Price"
                        />
                        <FormHelperText>Please enter Actual Price</FormHelperText>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <Stack spacing={0.5}>
                        <InputLabel>Discount %</InputLabel>
                        <TextField
                          fullWidth
                          name="discount"
                          type="discount"
                          value={formik.values.discount}
                          onChange={(e: any) => {
                            // console.log(e.target.value);
                            if (formik.values.actualPrice && e.target.value) {
                              const discountPric: any = formik.values.actualPrice - (formik.values.actualPrice * e.target.value) / 100;
                              formik.setFieldValue('discountedPrice', discountPric, true);
                            } else {
                              formik.setFieldValue('discountedPrice', formik.values.actualPrice, true);
                            }
                            formik.handleChange(e);
                          }}
                          placeholder="Discount %"
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <Stack spacing={0.5}>
                        <InputLabel>Discounted Price</InputLabel>
                        <TextField
                          fullWidth
                          name="discountedPrice"
                          type="discountedPrice"
                          value={formik.values.discountedPrice}
                          // onChange={formik.handleChange}
                          placeholder="Please enter Discounted Price"
                        />
                        <FormHelperText>Please enter Discounted Price</FormHelperText>
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack direction="row" justifyContent="flex-end" spacing={1}>
                        <AnimateButton>
                          <Button variant="contained" onClick={handleClose}>
                            Close
                          </Button>
                        </AnimateButton>
                        <AnimateButton>
                          <Button variant="contained" type="submit" onClick={() => handleClickNext(formik)}>
                            Verify & Submit
                          </Button>
                        </AnimateButton>
                      </Stack>
                    </Grid>
                  </Grid>
                </MainCard>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default UpdatePlan;
