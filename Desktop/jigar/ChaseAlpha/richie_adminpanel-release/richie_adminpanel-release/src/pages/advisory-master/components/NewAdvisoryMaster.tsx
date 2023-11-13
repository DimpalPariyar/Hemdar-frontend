import { PlusCircleFilled, CheckCircleOutlined } from '@ant-design/icons';
import { Stack, Button, TextField } from '@mui/material';
import { useState } from 'react';

function NewAdvisoryMaster({ onSubmit, dataKey }: any) {
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [formValue, setFormValue] = useState<string>('');

  const handleCancel = () => {
    setFormVisible(!formVisible);
    setFormValue('');
  };

  const handleClick = async () => {
    if (formVisible) await onSubmit({ [dataKey]: formValue });
    handleCancel();
  };

  return (
    <Stack justifyContent="flex-end" direction="row" margin={1} gap={1} marginX={2}>
      {formVisible && (
        <TextField
          placeholder="Enter..."
          sx={{ width: 280, mr: 2 }}
          value={formValue}
          onChange={(e: any) => setFormValue(e.target.value)}
        />
      )}
      <Button
        disabled={formVisible && !formValue}
        variant="text"
        color="primary"
        startIcon={formVisible ? <CheckCircleOutlined /> : <PlusCircleFilled />}
        onClick={handleClick}
      >
        {formVisible ? 'submit' : 'Add new'}
      </Button>
      {formVisible && (
        <Button variant="text" color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      )}
    </Stack>
  );
}

export default NewAdvisoryMaster;
