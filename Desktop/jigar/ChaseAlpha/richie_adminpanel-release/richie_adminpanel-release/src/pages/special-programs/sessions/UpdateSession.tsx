/* eslint-disable  @typescript-eslint/no-unused-vars */
import { useDispatch, useSelector } from 'store';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Button, Grid, InputLabel, Stack, TextField, TextFieldProps } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import { openSnackbar } from 'store/reducers/snackbar';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'utils/axios';
import { BASE_URL } from 'config';
import { getProgramSessions } from 'store/reducers/programSessions';

const validationSchema = yup.object({
  dates: yup.string().required('date is required'),
  sessionLink: yup.string().required('link is required')
});

interface Props {
  handleClose: () => void;
  session: any;
}

const UpdateSession = ({ handleClose, session }: Props) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { programId } = useSelector((state) => state.specialProgram);

  const [editorStateDisclaimer, setEditorStateDisclaimer] = useState(session.disclaimer);

  const handleChangeDisclaimer = (value: string) => {
    setEditorStateDisclaimer(value);
  };

  const [editorStateDescription, setEditorStateDescription] = useState(session.description);

  const handleChangeDescription = (value: string) => {
    setEditorStateDescription(value);
  };

  const formik = useFormik({
    initialValues: {
      dates: session.date,
      sessionName: session.sessionName,
      shortDescription: session.shortDescription,
      longDescription: session.longDescription,
      sessionLink: session.sessionLink,
      bannerImage: session.bannerImage,
      basePrice: session.basePricePerSession
    },
    validationSchema,
    onSubmit: async (values: any) => {

      axios
        .put(`${BASE_URL}/learning/session/${session._id}`, {
          date: values.dates,
          sessionName: values.sessionName,
          sessionLink: values.sessionLink,
          bannerImage: values.bannerImage,
          shortDescription: values.shortDescription,
          longDescription: values.longDescription,
          description: editorStateDescription,
          basePricePerSession: values.basePrice,
          disclaimer: editorStateDisclaimer
        })
        .then(() => {
          dispatch(getProgramSessions());
          dispatch(
            openSnackbar({
              open: true,
              message: 'Session is updated successfully',
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
    }
  });

  return (
    <MainCard title={`Update ${session.sessionName}`} sx={{ overflow: 'auto' }}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel>Date</InputLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Date & Time Picker"
                  value={formik.values.dates}
                  onChange={(date) => formik.setFieldValue('dates', date)}
                  renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
                    <TextField
                      {...params}
                      fullWidth
                      id="dates"
                      name="dates"
                      placeholder="Enter date"
                      error={formik.touched.dates && Boolean(formik.errors.dates)}
                      helperText={formik.touched.dates && formik.errors.dates}
                    />
                  )}
                />
              </LocalizationProvider>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel>Session Name</InputLabel>
              <TextField
                fullWidth
                id="sessionName"
                name="sessionName"
                placeholder="Enter session name"
                type="sessionName"
                value={formik.values.sessionName}
                onChange={formik.handleChange}
                error={formik.touched.sessionName && Boolean(formik.errors.sessionName)}
                helperText={formik.touched.sessionName && formik.errors.sessionName}
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="email">link</InputLabel>
              <TextField
                fullWidth
                id="sessionLink"
                name="sessionLink"
                placeholder="Enter link"
                type="sessionLink"
                value={formik.values.sessionLink}
                onChange={formik.handleChange}
                error={formik.touched.sessionLink && Boolean(formik.errors.sessionLink)}
                helperText={formik.touched.sessionLink && formik.errors.sessionLink}
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="email">Banner Image</InputLabel>
              <TextField
                fullWidth
                id="bannerImage"
                name="bannerImage"
                placeholder="Enter your banner image link"
                type="bannerImage"
                value={formik.values.bannerImage}
                onChange={formik.handleChange}
                error={formik.touched.bannerImage && Boolean(formik.errors.bannerImage)}
                helperText={formik.touched.bannerImage && formik.errors.bannerImage}
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="email">Short Description</InputLabel>
              <TextField
                fullWidth
                rows={3}
                multiline
                id="shortDescription"
                name="shortDescription"
                placeholder="Enter short description"
                type="shortDescription"
                value={formik.values.shortDescription}
                onChange={formik.handleChange}
                error={formik.touched.shortDescription && Boolean(formik.errors.shortDescription)}
                helperText={formik.touched.shortDescription && formik.errors.shortDescription}
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="email">Long Description</InputLabel>
              <TextField
                fullWidth
                rows={3}
                multiline
                id="longDescription"
                name="longDescription"
                placeholder="Enter Long description"
                type="longDescription"
                value={formik.values.longDescription}
                onChange={formik.handleChange}
                error={formik.touched.longDescription && Boolean(formik.errors.longDescription)}
                helperText={formik.touched.longDescription && formik.errors.longDescription}
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <InputLabel htmlFor="email">Description</InputLabel>
            <Grid
              item
              xs={12}
              sx={{
                '& .quill': {
                  bgcolor: theme.palette.mode === 'dark' ? 'dark.main' : 'grey.50',
                  borderRadius: '4px',
                  '& .ql-toolbar': {
                    bgcolor: theme.palette.mode === 'dark' ? 'dark.light' : 'grey.100',
                    borderColor: theme.palette.divider,
                    borderTopLeftRadius: '4px',
                    borderTopRightRadius: '4px'
                  },
                  '& .ql-container': {
                    borderColor: `${theme.palette.divider} !important`,
                    borderBottomLeftRadius: '4px',
                    borderBottomRightRadius: '4px',
                    '& .ql-editor': {
                      minHeight: 135
                    }
                  }
                }
              }}
            >
              <ReactQuill value={editorStateDescription} onChange={handleChangeDescription} />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="email">Base Price</InputLabel>
              <TextField
                fullWidth
                id="basePrice"
                name="basePrice"
                placeholder="Enter baseprice"
                type="basePrice"
                value={formik.values.basePrice}
                onChange={formik.handleChange}
                error={formik.touched.basePrice && Boolean(formik.errors.basePrice)}
                helperText={formik.touched.basePrice && formik.errors.basePrice}
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <InputLabel htmlFor="email">Disclaimer</InputLabel>
            <Grid
              item
              xs={12}
              sx={{
                '& .quill': {
                  bgcolor: theme.palette.mode === 'dark' ? 'dark.main' : 'grey.50',
                  borderRadius: '4px',
                  '& .ql-toolbar': {
                    bgcolor: theme.palette.mode === 'dark' ? 'dark.light' : 'grey.100',
                    borderColor: theme.palette.divider,
                    borderTopLeftRadius: '4px',
                    borderTopRightRadius: '4px'
                  },
                  '& .ql-container': {
                    borderColor: `${theme.palette.divider} !important`,
                    borderBottomLeftRadius: '4px',
                    borderBottomRightRadius: '4px',
                    '& .ql-editor': {
                      minHeight: 135
                    }
                  }
                }
              }}
            >
              <ReactQuill value={editorStateDisclaimer} onChange={handleChangeDisclaimer} />
            </Grid>
          </Grid>
          <Grid item xs={12}>
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
          </Grid>
        </Grid>
      </form>
    </MainCard>
  );
};

export default UpdateSession;
