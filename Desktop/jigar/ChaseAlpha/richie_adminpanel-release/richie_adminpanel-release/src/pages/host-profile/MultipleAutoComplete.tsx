import React, { useState } from 'react';
import { FastField, FieldHookConfig, useField, useFormikContext } from 'formik';
import { Autocomplete, Checkbox, TextField } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import FormElement from './FormElement';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const MultipleAutoComplete: React.FC<IProps & FieldHookConfig<{}>> = (props) => {
  const [field] = useField<{}>({ ...props, as: FastField });
  const { setFieldValue } = useFormikContext<{}>();
  const [selectedOptions, setSelectedOptions] = useState<IOption[]>([]);

  return (
    <FormElement
      field={field}
      label={props.label}
      helperText={props.helperText}
      required={props.required}
      displayFormError={props.displayFormError}
    >
      <Autocomplete
        multiple
        disableCloseOnSelect
        disableClearable
        options={props.options}
        {...field}
        value={selectedOptions}
        getOptionLabel={(option) => option.displayName}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
            {option.displayName}
          </li>
        )}
        renderInput={(params) => <TextField {...params} />}
        onChange={(e, updatedValues) => {
          if (Array.isArray(updatedValues)) {
            const nonEmptySelectedOptions = updatedValues.filter((value) => value.displayName.trim() != '');
            const idsOfSelectedOptions: string[] = [];
            nonEmptySelectedOptions.map((value) => {
              idsOfSelectedOptions.push(value.id);
            });
            setFieldValue(field.name, idsOfSelectedOptions);
            setSelectedOptions(updatedValues);
          }
        }}
      />
    </FormElement>
  );
};

export interface IOption {
  id: string;
  displayName: string;
}

interface IProps {
  label?: string;
  error?: boolean;
  helperText?: any;
  disabled?: boolean;
  required?: boolean;
  inputProps?: object;
  options: Array<IOption>;
  displayFormError?: boolean;
}

export default MultipleAutoComplete;
