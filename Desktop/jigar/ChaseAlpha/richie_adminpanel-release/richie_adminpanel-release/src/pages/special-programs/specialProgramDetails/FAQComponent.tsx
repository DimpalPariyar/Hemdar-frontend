import React from 'react';
import { IconButton, FormControl, Grid, TextField } from '@mui/material';
import { InputLabel, Stack } from '@mui/material';
import { getIn, useFormikContext } from 'formik';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const FAQComponent = (props: IProps) => {
  const { values, touched, setFieldValue, errors, handleChange, handleBlur } = useFormikContext();

  const isTouched = getIn(touched, `faqs.${props.id}.faqQuestion`);
  const error = {
    faqQuestion: getIn(errors, `faqs.${props.id}.faqQuestion`),
    faqAnswer: getIn(errors, `faqs.${props.id}.faqAnswer`)
  };
  const value = {
    faqQuestion: getIn(values, `faqs.${props.id}.faqQuestion`),
    faqAnswer: getIn(values, `faqs.${props.id}.faqAnswer`)
  };

  return (
    <>
      <Grid item xs={12}>
        <Stack spacing={0.5}>
          <InputLabel>{props.index + 1}. FAQ Question</InputLabel>
          <FormControl>
            <TextField
              fullWidth
              id={`faqs.${props.id}.faqQuestion`}
              name={`faqs.${props.id}.faqQuestion`}
              value={value.faqQuestion}
              onChange={handleChange}
              error={isTouched && Boolean(error.faqQuestion)}
              helperText={isTouched && error.faqQuestion}
              onBlur={handleBlur}
            />
          </FormControl>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={0.5}>
          <InputLabel>{props.index + 1}. FAQ Answer</InputLabel>
          <FormControl>
            <TextField
              id={`faqs.${props.id}.faqAnswer`}
              name={`faqs.${props.id}.faqAnswer`}
              value={value.faqAnswer}
              onChange={handleChange}
              error={isTouched && Boolean(error.faqAnswer)}
              helperText={isTouched && error.faqAnswer}
              onBlur={handleBlur}
            />
          </FormControl>
        </Stack>
      </Grid>
      <Grid container justifyContent="flex-end">
        <IconButton
          size="large"
          // disabled={Number(props.index) < 2 && true}
          sx={{ mt: 3 }}
          onClick={() => props.deleteRow(props.id, setFieldValue)}
        >
          <DeleteOutlineOutlinedIcon />
        </IconButton>
      </Grid>
    </>
  );
};

interface IProps {
  id: string;
  index: number;
  deleteRow: (id: string, setFieldValue: any) => void;
}

export default FAQComponent;
