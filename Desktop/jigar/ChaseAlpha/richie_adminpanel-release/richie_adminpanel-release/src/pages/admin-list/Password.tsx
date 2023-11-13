/* eslint-disable  @typescript-eslint/no-unused-vars */
// ==============================|| SPECIAL PROGRAM ||============================== //
import 'react-quill/dist/quill.snow.css';
import { Form, Formik } from 'formik';
import { useDispatch } from 'store';

// material-ui
import {
  Button,
  Checkbox,
  Dialog,
  Divider,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip
} from '@mui/material';
import { Box, DialogActions, DialogContent, DialogTitle } from '@mui/material';

// project imports
import AnimateButton from 'components/@extended/AnimateButton';
import { openSnackbar } from 'store/reducers/snackbar';

// third-party
import { BASE_URL } from 'config';
import axios from 'utils/axios';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { EditTwoTone } from '@ant-design/icons';

const initialValues = {
  password: ''
};

interface Props {
  email: string;
}
const Password = ({ email }: Props) => {
  const [openForm, setOpenForm] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleClose = () => setOpenForm(false);

  const handleSubmit = async (values: any) => {
    await axios.put(`${BASE_URL}/admin/password`, values);
    dispatch(
      openSnackbar({
        open: true,
        message: 'Password is created successfully',
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
    <>
      <Tooltip title="View">
        <IconButton onClick={() => setOpenForm(true)} size="large" color="secondary">
          <EditTwoTone />
        </IconButton>
      </Tooltip>
      <Dialog
        onClose={(_: any, reason: string) => {
          if (reason !== 'backdropClick') {
            handleClose();
          }
        }}
        open={openForm}
      >
        <div>
          <Formik initialValues={{ ...initialValues, email }} onSubmit={handleSubmit}>
            {(formik) => {
              return (
                <Form>
                  <Box sx={{ width: 700, p: 1, py: 1.5 }}>
                    <DialogTitle>Update Password</DialogTitle>
                    <Divider />
                    <DialogContent>
                      <Grid container marginBottom={2} spacing={3}>
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
                            Update
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
    </>
  );
};

export default Password;
