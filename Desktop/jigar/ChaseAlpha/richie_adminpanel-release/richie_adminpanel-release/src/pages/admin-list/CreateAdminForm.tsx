/* eslint-disable  @typescript-eslint/no-unused-vars */
// ==============================|| SPECIAL PROGRAM ||============================== //
import 'react-quill/dist/quill.snow.css';
import { Form, Formik } from 'formik';
import { useDispatch } from 'store';

// material-ui
import { Button, Checkbox, Dialog, Divider, Grid, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { Box, DialogActions, DialogContent, DialogTitle } from '@mui/material';

// project imports
import AnimateButton from 'components/@extended/AnimateButton';
import { openSnackbar } from 'store/reducers/snackbar';

// third-party
import { BASE_URL } from 'config';
import axios from 'utils/axios';
import { useSelector } from 'react-redux';

const initialValues = {
  name: '',
  email: '',
  mobile: null,
  password: '',
  permissions: []
};

interface Props {
  handleClose: () => void;
}
const CreateAdminForm = ({ handleClose }: Props) => {
  const { permissions } = useSelector((state: any) => state.adminList);
  const dispatch = useDispatch();
  const handleSubmit = async (values: any) => {
    values.type = values.permissions;
    await axios.post(`${BASE_URL}/admin/signup`, values);
    dispatch(
      openSnackbar({
        open: true,
        message: 'New Admin is created successfully',
        variant: 'alert',
        alert: {
          color: 'success'
        },
        close: true
      })
    );
    handleClose();
  };
  return (
    <Dialog
      onClose={(_: any, reason: string) => {
        if (reason !== 'backdropClick') {
          handleClose();
        }
      }}
      open
    >
      <div>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {(formik) => {
            return (
              <Form>
                <Box sx={{ p: 1, py: 1.5 }}>
                  <DialogTitle>Add New Admin</DialogTitle>
                  <Divider />
                  <DialogContent>
                    <Grid container marginBottom={2} spacing={3}>
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="name">Name</InputLabel>
                          <TextField
                            fullWidth
                            id="name"
                            name="name"
                            placeholder="Enter name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="email">Email</InputLabel>
                          <TextField
                            fullWidth
                            id="email"
                            name="email"
                            placeholder="Enter your link"
                            type="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="email">Mobile</InputLabel>
                          <TextField
                            fullWidth
                            id="mobile"
                            name="mobile"
                            placeholder="Enter Mobile"
                            type="mobile"
                            value={formik.values.mobile}
                            onChange={formik.handleChange}
                            error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                            helperText={formik.touched.mobile && formik.errors.mobile}
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="password">Password</InputLabel>
                          <TextField
                            fullWidth
                            id="password"
                            name="password"
                            placeholder="Enter Password"
                            type="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="permissions">Permissions</InputLabel>
                          <Select
                            multiple
                            id="permissions"
                            name="permissions"
                            value={formik.values.permissions}
                            onChange={formik.handleChange}
                            sx={{ display: 'flex', gap: 2 }}
                            error={formik.touched.permissions && Boolean(formik.errors.permissions)}
                            renderValue={(selected: any) => (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((item: any) => {
                                  const selectedItem: any = permissions.find((permission: any) => permission.value === item);
                                  return <Button variant="outlined">{selectedItem.label}</Button>;
                                })}
                              </Box>
                            )}
                          >
                            {permissions.map((permission: any) => {
                              const isSelected = formik.values.permissions.filter((value: any) => value === permission.value).length !== 0;

                              return (
                                <MenuItem value={permission.value}>
                                  <Checkbox checked={!!isSelected} />
                                  {permission.label}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </Stack>
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <Divider />
                  <DialogActions>
                    <Stack direction="row" justifyContent="flex-end" marginTop={2} spacing={1}>
                      <AnimateButton>
                        <Button variant="text" color="error" onClick={handleClose}>
                          Cancel
                        </Button>
                      </AnimateButton>
                      <AnimateButton>
                        <Button variant="contained" type="submit">
                          Add
                        </Button>
                      </AnimateButton>
                    </Stack>
                  </DialogActions>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Dialog>
  );
};

export default CreateAdminForm;
