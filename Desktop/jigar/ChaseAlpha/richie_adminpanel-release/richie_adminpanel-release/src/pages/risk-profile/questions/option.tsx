import React from 'react';
import { FormControl, Grid, IconButton, TextField } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { InputLabel, Stack } from '@mui/material';
// third-party
import { getIn, useFormikContext } from 'formik';

const Option = (props: IProps) => {
  const { values, touched, setFieldValue, errors, handleChange, handleBlur } = useFormikContext();

  const isTouched = getIn(touched, `option.${props.id}.optionName`);
  const error = {
    optionName: getIn(errors, `option.${props.id}.optionName`),
    optionValue: getIn(errors, `option.${props.id}.optionValue`)
  };
  const value = {
    optionName: getIn(values, `option.${props.id}.optionName`),
    optionValue: getIn(values, `option.${props.id}.optionValue`)
  };

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12} lg={4}>
        <Stack spacing={0.5}>
          <InputLabel>Option Name</InputLabel>
          <FormControl>
            <TextField
              fullWidth
              id={`option.${props.id}.optionName`}
              name={`option.${props.id}.optionName`}
              value={value.optionName}
              onChange={handleChange}
              error={isTouched && Boolean(error.optionName)}
              helperText={isTouched && error.optionName}
              onBlur={handleBlur}
            />
          </FormControl>
        </Stack>
      </Grid>
      <Grid item xs={12} lg={4}>
        <Stack spacing={0.5}>
          <InputLabel>Option Value</InputLabel>
          <FormControl>
            <TextField
              fullWidth
              id={`option.${props.id}.optionValue`}
              name={`option.${props.id}.optionValue`}
              value={value.optionValue}
              onChange={handleChange}
              error={isTouched && Boolean(error.optionValue)}
              helperText={isTouched && error.optionValue}
              onBlur={handleBlur}
            />
          </FormControl>
        </Stack>
      </Grid>
      <Grid item>
        <Stack spacing={0.5}>
          <IconButton
            size="large"
            disabled={Number(props.index) < 2 && true}
            sx={{ mt: 3 }}
            onClick={() => props.deleteRow(props.id, setFieldValue)}
          >
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </Stack>
      </Grid>
    </Grid>
  );
};

interface IProps {
  id: string;
  index: number;
  deleteRow: (id: string, setFieldValue: any) => void;
}

export default Option;
