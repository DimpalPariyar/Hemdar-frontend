import React from 'react';
import { FormControl, FormHelperText, InputLabel } from '@mui/material';
import { FieldInputProps, getIn, useFormikContext } from 'formik';

const FormElement: React.FC<IProps> = (props) => {
  const { touched, errors } = useFormikContext<{}>();
  const isTouched = getIn(touched, props.field.name);
  const error = getIn(errors, props.field.name);
  return (
    <FormControl error={isTouched && !!error} style={{ width: '100%' }}>
      {props.label && <InputLabel required={props.required}>{props.label}</InputLabel>}
      {props.children}
      {!props.displayFormError && isTouched && !!error && <FormHelperText>{error}</FormHelperText>}
      {props.field.value && props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
    </FormControl>
  );
};

interface IProps {
  field: FieldInputProps<{}>;
  label?: string;
  helperText?: any;
  required?: boolean;
  displayFormError?: boolean;
}

export default FormElement;
