import { InputLabel, Stack } from '@mui/material';
import FastInputField from 'components/FastInputField';
import { thirdFormSet } from './constant';

const TargetForm = ({ values, formik, isUpdateMode, isPermited }: any) => {
  const FastinputfieldStyle = {
    bgcolor: '#ECEFFF',
    borderRadius: '10px',
    padding: '8px 10px',
    '&:hover': {
      border: '1px solid #2D00D2',
      height: '41px'
    }
  };
  return (
    <Stack direction="row" flexWrap="wrap" mt={4} gap={2}>
      {thirdFormSet.map((field) => (
        <Stack key={field.name} spacing={1} width={260}>
          <InputLabel sx={{ mt: 1 }}>{field.label}</InputLabel>
          <FastInputField
            style={FastinputfieldStyle}
            name={field.name}
            type={field.type}
            value={values?.[field.name]}
            onChange={formik.setFieldValue}
            shouldDisable={!isPermited}
          />
        </Stack>
      ))}
    </Stack>
  );
};

export default TargetForm;
