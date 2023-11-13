/* eslint-disable  @typescript-eslint/no-unused-vars */
// ==============================|| SPECIAL PROGRAM ||============================== //
import { useTheme } from '@mui/material/styles';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Form, Formik, setNestedObjectValues } from 'formik';
import { useDispatch } from 'store';

// material-ui
import { Button, Grid, InputLabel, Stack, TextField } from '@mui/material';
import { Box, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

// project imports
import AnimateButton from 'components/@extended/AnimateButton';
import { openSnackbar } from 'store/reducers/snackbar';

// third-party
import { useEffect, useState } from 'react';
import { BASE_URL } from 'config';
import axios from 'utils/axios';
import { getProgramList } from 'store/reducers/specialProgram';
import { v4 as UIDV4 } from 'uuid';
import FAQComponent from './FAQComponent';
import FAQValidationSchema from './FAQValidationSchema';

interface Props {
  handleClose: () => void;
}
const CreateProgram = ({ handleClose }: Props) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const [currentRows, setCurrentRows] = useState<any>({
    programTitle: '',
    shortDescription: '',
    bannerImage: '',
    faqTitle: '',
    faqs: {}
  });

  const addNewRow = (setFieldValue?: any) => {
    const id = UIDV4();
    const current = currentRows;
    const emptyRow = {
      faqQuestion: '',
      faqAnswer: ''
    };
    if (setFieldValue) {
      setFieldValue(`faqs.${id}`, { ...emptyRow }, true);
    }
    current.faqs[id] = { ...emptyRow };
    setCurrentRows({ ...current });
  };

  const deleteRow = (id: string, setFieldValue: any) => {
    setFieldValue(`faqs.${id}`, undefined, true);
    const current = currentRows;
    delete current.faqs[id];
    setCurrentRows({ ...current });
  };

  useEffect(() => {
    if (Object.keys(currentRows.faqs).length === 0) {
      addNewRow();
      // addNewRow();
    }
  }, []);

  const [description, setDescription] = useState('Lorem Ipsum');
  const handleChange = (value: string) => {
    setDescription(value);
  };

  const handleClickNext = (formik: any) => {
    formik.setTouched(setNestedObjectValues(formik.values, true));
  };

  const handleSubmit = async (values: any) => {

    let faqs = [];

    for (const property in values.faqs) {
      faqs.push({
        question: values.faqs[property].faqQuestion,
        answer: values.faqs[property].faqAnswer
      });
    }

    axios
      .post(`${BASE_URL}/learning/program`, {
        programTitle: values.programTitle,
        shortDescription: values.shortDescription,
        bannerImage: values.bannerImage,
        longDescription: description,
        faqs: faqs
      })
      .then(async () => {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Special Program is created successfully',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
        await dispatch(getProgramList());
      });
    handleClose();
  };

  return (
    <div>
      <Formik initialValues={currentRows} validationSchema={new FAQValidationSchema().faqSchema} onSubmit={handleSubmit}>
        {(formik) => {
          return (
            <Form>
              <Box sx={{ p: 1, py: 1.5 }}>
                <DialogTitle>Add New Special Program</DialogTitle>
                <DialogContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="programTitle">Program Title</InputLabel>
                        <TextField
                          fullWidth
                          id="programTitle"
                          name="programTitle"
                          placeholder="Enter programTitle"
                          value={formik.values.programTitle}
                          onChange={formik.handleChange}
                          error={formik.touched.programTitle && Boolean(formik.errors.programTitle)}
                          helperText={formik.touched.programTitle && formik.errors.programTitle}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="email">bannerImage</InputLabel>
                        <TextField
                          fullWidth
                          id="bannerImage"
                          name="bannerImage"
                          placeholder="Enter your link"
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
                          id="shortDescription"
                          name="shortDescription"
                          placeholder="Enter Short Description"
                          multiline
                          rows={3}
                          type="shortDescription"
                          value={formik.values.shortDescription}
                          onChange={formik.handleChange}
                          error={formik.touched.shortDescription && Boolean(formik.errors.shortDescription)}
                          helperText={formik.touched.shortDescription && formik.errors.shortDescription}
                        />
                      </Stack>
                    </Grid>
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
                      <InputLabel sx={{ pb: 1 }}>Long Description</InputLabel>
                      <ReactQuill value={description} onChange={handleChange} />
                    </Grid>
                    {Object.keys(currentRows.faqs).length !== 0 && (
                      <>
                        {Object.keys(currentRows.faqs).map((id, index) => (
                          <FAQComponent id={id} index={index} key={id} deleteRow={deleteRow} />
                        ))}
                      </>
                    )}
                    <Stack direction="row" justifyContent="flex-end" sx={{ p: 3, pb: 0 }}>
                      <Button
                        variant="text"
                        size="large"
                        startIcon={<AddOutlinedIcon />}
                        sx={{ px: 2, py: 1.5, color: '#000' }}
                        onClick={() => addNewRow(formik.setFieldValue)}
                      >
                        Add More
                      </Button>
                    </Stack>
                  </Grid>
                </DialogContent>
                <DialogActions>
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
                </DialogActions>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default CreateProgram;
