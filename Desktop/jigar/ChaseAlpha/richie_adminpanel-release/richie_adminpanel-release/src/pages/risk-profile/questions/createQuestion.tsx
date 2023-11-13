import React from 'react';
import { Button, Grid, Stack, TextField } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { v4 as UIDV4 } from 'uuid';
// third-party
import { Form, Formik, setNestedObjectValues } from 'formik';
import Option from './option';
import OptionValidationSchema from './optionValidationSchema';

// material-ui
import { Box, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'utils/axios';
import { BASE_URL } from 'config';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/reducers/snackbar';

export interface IOptionsWithIds {
  question: String;
  option: {
    [key: string]: detail;
  };
}

export type detail = {
  optionName: String;
  optionValue: Number;
};

interface Props {
  handleClose: () => void;
}

const RiskProfileQuestion = ({ handleClose }: Props) => {
  const [currentRows, setCurrentRows] = React.useState<IOptionsWithIds>({ question: '', option: {} });
  const dispatch = useDispatch();

  const addNewRow = (setFieldValue?: any) => {
    const id = UIDV4();
    const current = currentRows;
    const emptyRow = {
      optionName: '',
      optionValue: 0
    } as detail;
    if (setFieldValue) {
      setFieldValue(`option.${id}`, { ...emptyRow }, true);
    }
    current.option[id] = { ...emptyRow };
    setCurrentRows({ ...current });
  };

  const deleteRow = (id: string, setFieldValue: any) => {
    setFieldValue(`option.${id}`, undefined, true);
    const current = currentRows;
    delete current.option[id];
    setCurrentRows({ ...current });
  };

  React.useEffect(() => {
    if (Object.keys(currentRows.option).length === 0) {
      addNewRow();
      // addNewRow();
    }
  }, []);

  const handleClickNext = (formik: any) => {
    formik.setTouched(setNestedObjectValues(formik.values, true));
  };

  const handleSubmit = async (values: IOptionsWithIds) => {
    let question: any = {};

    let questionDescriptionObj = { questionDescription: values.question };
    question = Object.assign(question, questionDescriptionObj, { options: [] });

    for (const property in values.option) {
      values.option[property].optionValue = Number(values.option[property].optionValue);
      question.options.push(values.option[property]);
    }
    const response = await axios.post(`${BASE_URL}/riskprofile/question/add`, { question });
    console.log(response.data);
    dispatch(
      openSnackbar({
        open: true,
        message: 'Question is created successfully.',
        variant: 'alert',
        alert: {
          color: 'success'
        },
        close: false
      })
    );
    handleClose();
  };

  return (
    <div>
      <Formik initialValues={currentRows} validationSchema={new OptionValidationSchema().optionsSchema} onSubmit={handleSubmit}>
        {(formik) => {
          return (
            <Form>
              <Box sx={{ p: 1, py: 1.5 }}>
                <DialogTitle>Add New Question</DialogTitle>
                <DialogContent>
                  <Grid container spacing={3} sx={{ p: 3 }} justifyContent="center">
                    <Grid item xs={10} md={10}>
                      <TextField
                        id={'question'}
                        name={'question'}
                        fullWidth
                        label="Question Description"
                        multiline
                        value={formik.values.question}
                        onChange={formik.handleChange}
                        rows={5}
                        defaultValue="Sample Question"
                        error={formik.touched && Boolean(formik.errors.question)}
                        helperText={formik.touched && formik.errors.question}
                        onBlur={formik.handleBlur}
                      />
                    </Grid>
                  </Grid>
                  {Object.keys(currentRows.option).length !== 0 && (
                    <>
                      {Object.keys(currentRows.option).map((id, index) => (
                        <Option id={id} index={index} key={id} deleteRow={deleteRow} />
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
                </DialogContent>
                <DialogActions>
                  <Button color="error" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button variant="contained" type="submit" size="large" onClick={() => handleClickNext(formik)}>
                    Save
                  </Button>
                </DialogActions>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default RiskProfileQuestion;
