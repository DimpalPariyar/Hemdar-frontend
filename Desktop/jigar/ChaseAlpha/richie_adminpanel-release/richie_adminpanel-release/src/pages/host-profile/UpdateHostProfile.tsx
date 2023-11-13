// material-ui
import { Button, DialogActions, DialogContent, DialogTitle, Grid, InputLabel, Stack, TextField } from '@mui/material';
import axios from 'utils/axios';

// project imports
import AnimateButton from 'components/@extended/AnimateButton';
import { BASE_URL } from 'config';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import MultipleAutoComplete from './MultipleAutoComplete';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

const validationSchema = yup.object({
  hostName: yup.string().required('Host Name is required'),
  type: yup.array().min(1, 'Type is required')
});

const UpdateHostProfile = ({ hostProfile, handleClose }: any) => {
  const [options, setOptions] = useState<[]>([]);
  console.log(Object.keys(hostProfile.type));

  useEffect(() => {
    axios.get(`${BASE_URL}/hostProfile/types`).then((response: any) => {
      const keys = Object.keys(response.data);
      const values = Object.values(response.data);
      const typesOptions: any = [];
      for (let i = 0; i < values.length; i++) {
        let item: any = {};
        item['id'] = keys[i];
        item['displayName'] = values[i];
        typesOptions.push(item);
      }
      // console.log(typesOptions);
      setOptions(typesOptions);
    });
  }, []);

  const handleSubmit = async (values: any) => {
    axios
      .put(`${BASE_URL}/hostProfile/${hostProfile?._id}`, {
        hostName: values.hostName,
        profileImage: values.profileImage,
        role: values.role,
        shortDescription: values.shortDescription,
        email: values.email,
        phoneNumber: values.phoneNumber,
        type: values.type,
        licenseNumber: '123',
        registerNumber: '123'
      })
      .then(async () => {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Host Profile is updated successfully',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
        handleClose();
      });
  };

  return (
    <div>
      <Formik
        initialValues={{
          hostName: hostProfile.hostName,
          profileImage: hostProfile.profileImage,
          role: hostProfile.role,
          shortDescription: hostProfile.shortDescription,
          email: hostProfile.email,
          phoneNumber: hostProfile.phoneNumber,
          type: Object.keys(hostProfile.type)
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => {
          return (
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <DialogTitle>Update Host Profile</DialogTitle>
                    <DialogContent>
                      <Stack spacing={1}>
                        <InputLabel>Host Name</InputLabel>
                        <TextField
                          fullWidth
                          id="hostName"
                          name="hostName"
                          placeholder="Enter host name"
                          type="hostName"
                          value={formik.values.hostName}
                          onChange={formik.handleChange}
                          error={formik.touched.hostName && Boolean(formik.errors.hostName)}
                          helperText={formik.touched.hostName && formik.errors.hostName}
                        />

                        <InputLabel>Profile Image</InputLabel>
                        <TextField
                          fullWidth
                          id="profileImage"
                          name="profileImage"
                          placeholder="Enter profile image"
                          type="profileImage"
                          value={formik.values.profileImage}
                          onChange={formik.handleChange}
                          error={formik.touched.profileImage && Boolean(formik.errors.profileImage)}
                          helperText={formik.touched.profileImage && formik.errors.profileImage}
                        />
                        <InputLabel>Role</InputLabel>
                        <TextField
                          fullWidth
                          id="role"
                          name="role"
                          placeholder="Enter role"
                          type="role"
                          value={formik.values.role}
                          onChange={formik.handleChange}
                          error={formik.touched.role && Boolean(formik.errors.role)}
                          helperText={formik.touched.role && formik.errors.role}
                        />
                        <InputLabel>Short Description</InputLabel>
                        <TextField
                          fullWidth
                          id="shortDescription"
                          name="shortDescription"
                          placeholder="Enter short description"
                          type="shortDescription"
                          value={formik.values.shortDescription}
                          onChange={formik.handleChange}
                          error={formik.touched.shortDescription && Boolean(formik.errors.shortDescription)}
                          helperText={formik.touched.shortDescription && formik.errors.shortDescription}
                        />
                        <InputLabel>Email</InputLabel>
                        <TextField
                          fullWidth
                          id="email"
                          name="email"
                          placeholder="Enter email"
                          type="email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          error={formik.touched.email && Boolean(formik.errors.email)}
                          helperText={formik.touched.email && formik.errors.email}
                        />
                        <InputLabel>Phone Number</InputLabel>
                        <TextField
                          fullWidth
                          id="phoneNumber"
                          name="phoneNumber"
                          placeholder="Enter phone number"
                          type="phoneNumber"
                          value={formik.values.phoneNumber}
                          onChange={formik.handleChange}
                          error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                          helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                        />
                        <InputLabel>Types</InputLabel>
                        <MultipleAutoComplete name="type" options={options} required={true} />
                      </Stack>
                    </DialogContent>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <DialogActions>
                    <Stack direction="row" justifyContent="flex-end" spacing={1}>
                      <AnimateButton>
                        <Button variant="contained" onClick={handleClose}>
                          Close
                        </Button>
                      </AnimateButton>
                      <AnimateButton>
                        <Button variant="contained" type="submit">
                          Verify & Submit
                        </Button>
                      </AnimateButton>
                    </Stack>
                  </DialogActions>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default UpdateHostProfile;
