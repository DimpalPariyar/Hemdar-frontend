/* eslint-disable  @typescript-eslint/no-unused-vars */
import { useDispatch, useSelector } from 'store';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Button, DialogContent, DialogTitle, Grid, InputLabel, Stack, TextField } from '@mui/material';
// project imports
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import { openSnackbar } from 'store/reducers/snackbar';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
// third-party
import { v4 as UIDV4 } from 'uuid';
import { Form, Formik, setNestedObjectValues } from 'formik';
import axios from 'utils/axios';
import { BASE_URL } from 'config';
import { getProgramSessions } from 'store/reducers/programSessions';
import DateTimeComponent from './DateTimeComponent';
import SessionValidationSchema from './SessionValidationSchema';
import moment from 'moment';
import _ from 'lodash';

interface Props {
  handleClose: () => void;
}

const CreateSession = ({ handleClose }: Props) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { programId } = useSelector((state) => state.specialProgram);
  const [currentRows, setCurrentRows] = useState<any>({
    dates: {},
    title: '',
    sessionLink: '',
    bannerImage: '',
    basePrice: 0
  });

  const addNewRow = (setFieldValue?: any, data?: any) => {
    const id: string = UIDV4();
    const current = currentRows;
    let nextDate = moment();
    if (data && data.dates && Object.keys(data.dates).length > 0) {
      const keys = Object.keys(data.dates).map((id, index) => id);
      const key: string | undefined = _.last(keys);
      if (key) {
        nextDate = moment(data.dates[key].date).add(1, 'days');
      }
    } else {
      nextDate.set({ hour: 9, minute: 15, second: 0, millisecond: 0 });
    }
    if (nextDate.weekday() === 0) {
      nextDate = nextDate.add(1, 'days');
    } else if (nextDate.weekday() === 6) {
      nextDate = nextDate.add(2, 'days');
    }
    const emptyRow = {
      date: nextDate.toDate()
    };
    if (setFieldValue) {
      setFieldValue(`dates.${id}`, { ...emptyRow }, true);
    }
    current.dates[id] = { ...emptyRow };
    setCurrentRows({ ...current });
  };

  const deleteRow = (id: string, setFieldValue: any) => {
    setFieldValue(`dates.${id}`, undefined, true);
    const current = currentRows;
    delete current.dates[id];
    setCurrentRows({ ...current });
  };

  useEffect(() => {
    if (Object.keys(currentRows.dates).length === 0) {
      addNewRow();
    }
  }, []);

  const [editorStateDisclaimer, setEditorStateDisclaimer] = useState('');

  const handleChangeDisclaimer = (value: string) => {
    setEditorStateDisclaimer(value);
  };

  const [editorStateDescription, setEditorStateDescription] = useState('');

  const handleChangeDescription = (value: string) => {
    setEditorStateDescription(value);
  };

  const handleClickNext = (formik: any) => {
    formik.setTouched(setNestedObjectValues(formik.values, true));
  };

  const handleSubmit = async (values: any) => {
    let dates = [];

    for (const property in values.dates) {
      dates.push(values.dates[property].date);
    }

    axios
      .post(`${BASE_URL}/learning/session-create`, {
        title: values.title,
        dates: dates,
        sessionLink: values.sessionLink,
        bannerImage: values.bannerImage,
        shortDescription: values.shortDescription,
        longDescription: values.longDescription,
        description: editorStateDescription,
        basePricePerSession: values.basePrice,
        disclaimer: editorStateDisclaimer
      })
      .then(() => {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Session is created successfully',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
        dispatch(getProgramSessions());
        // console.log(values);
      });
    handleClose();
  };
  return (
    <div>
      <Formik initialValues={currentRows} validationSchema={new SessionValidationSchema().sessionSchema} onSubmit={handleSubmit}>
        {(formik) => {
          return (
            <Form>
              <DialogTitle>Create Sessions</DialogTitle>
              <DialogContent>
                <MainCard sx={{ overflow: 'auto' }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="name">Session Name</InputLabel>
                        <TextField
                          fullWidth
                          id="title"
                          name="title"
                          placeholder="Enter your session name"
                          type="title"
                          value={formik.values.title}
                          onChange={formik.handleChange}
                          error={formik.touched.title && Boolean(formik.errors.title)}
                          helperText={formik.touched.title && formik.errors.title}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      {Object.keys(currentRows.dates).length !== 0 && (
                        <>
                          {Object.keys(currentRows.dates).map((id, index) => (
                            <DateTimeComponent id={id} index={index} key={id} deleteRow={deleteRow} />
                          ))}
                        </>
                      )}
                      <Button
                        variant="text"
                        size="large"
                        startIcon={<AddOutlinedIcon />}
                        sx={{ px: 1, py: 1.5, m: 0, color: '#000' }}
                        onClick={() => addNewRow(formik.setFieldValue, formik.values)}
                      >
                        Add More
                      </Button>
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
                </MainCard>
              </DialogContent>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default CreateSession;
