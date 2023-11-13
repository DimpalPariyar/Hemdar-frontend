import React, { useEffect } from 'react';
import { Box, Button, Grid, Stack, TextField } from '@mui/material';
import { DialogActions, DialogTitle } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { v4 as UIDV4 } from 'uuid';
// third-party
import { Form, Formik, setNestedObjectValues } from 'formik';
import Option from './option';
import OptionValidationSchema from './optionValidationSchema';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/reducers/snackbar';
import axios from 'utils/axios';
import { BASE_URL } from 'config';
import AnimateButton from 'components/@extended/AnimateButton';

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

const UpdateRiskProfileQuestion = (props: any) => {
  const [currentRows, setCurrentRows] = React.useState<IOptionsWithIds>({ question: '', option: {} });
  const dispatch = useDispatch();

  useEffect(() => {
    const current = currentRows;
    current.question = props?.currentQuestion?.original?.questionDescription;
    props?.currentQuestion?.original?.options.map((option: any) => {
      const id = UIDV4();
      const newRow = {
        optionName: option?.optionName,
        optionValue: option?.optionValue
      } as detail;
      current.option[id] = { ...newRow };
    });
    setCurrentRows({ ...current });
    // console.log(current);
  }, []);

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
    }
  }, []);

  const handleClickNext = (formik: any) => {
    formik.setTouched(setNestedObjectValues(formik.values, true));
  };

  const handleSubmit = async (values: IOptionsWithIds) => {
    const questionId = props?.currentQuestion?.original?.questionId;
    let question: any = {};

    let questionDescriptionObj = { questionDescription: values.question };
    question = Object.assign(question, questionDescriptionObj, { options: [] });

    for (const property in values.option) {
      values.option[property].optionValue = Number(values.option[property].optionValue);
      question.options.push(values.option[property]);
    }
    axios.put(`${BASE_URL}/riskprofile/question/${questionId}/update`, { question }).then((response) => {
      console.log(response.data);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Question is updated successfully.',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );
      props.handleClose();
    });
  };

  return (
    <Formik initialValues={currentRows} validationSchema={new OptionValidationSchema().optionsSchema} onSubmit={handleSubmit}>
      {(formik) => {
        return (
          <Form>
            <Box sx={{ p: 1, py: 1.5 }}>
              <DialogTitle>Update a Question</DialogTitle>
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
              <Grid container margin={1}>
                <Grid item xs>
                  <Button
                    variant="text"
                    size="large"
                    startIcon={<AddOutlinedIcon />}
                    sx={{ px: 2, py: 1.5, color: '#000' }}
                    onClick={() => addNewRow(formik.setFieldValue)}
                  >
                    Add More
                  </Button>
                </Grid>
              </Grid>
              <DialogActions>
                <Stack direction="row" justifyContent="flex-end" spacing={1}>
                  <AnimateButton>
                    <Button variant="outlined" onClick={() => props.handleClose()}>
                      Close
                    </Button>
                  </AnimateButton>
                  <AnimateButton>
                    <Button variant="contained" type="submit" onClick={() => handleClickNext(formik)}>
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
  );
};

export default UpdateRiskProfileQuestion;
