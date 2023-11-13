import { CheckCircleOutlined, DeleteOutlined, EditOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Stack, OutlinedInput, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';

function AdvisoryMasterItem({ updateItem, dataKey, item, deleteItem }: any) {
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [formValue, setFormValue] = useState<string>(item[dataKey]);

  useEffect(() => {
    setFormValue(item[dataKey]);
  }, [item, dataKey]);

  const handleCancel = () => {
    setIsEditable(!isEditable);
    setFormValue(item[dataKey]);
  };

  const handleUpdate = async () => {
    if (isEditable) await updateItem(item._id, { [dataKey]: formValue });
    handleCancel();
  };

  const handleDelete = async () => {
    await deleteItem(item._id);
  };

  return (
    <Stack justifyContent="flex-end" alignItems="center" direction="row" margin={1} gap={1}>
      <OutlinedInput
        disabled={!isEditable}
        placeholder="Enter..."
        sx={{ width: 280 }}
        value={formValue}
        onChange={(e: any) => setFormValue(e.target.value)}
      />
      <Stack justifyContent="flex-end" direction="row" margin={1}>
        {!isEditable && (
          <IconButton onClick={handleDelete} color="error" aria-label="delete">
            <DeleteOutlined />
          </IconButton>
        )}
        <IconButton color="primary" onClick={handleUpdate} aria-label="edit">
          {isEditable ? <CheckCircleOutlined /> : <EditOutlined />}
        </IconButton>
        {isEditable && (
          <IconButton onClick={handleCancel} color="secondary" aria-label="delete">
            <CloseCircleOutlined />
          </IconButton>
        )}
      </Stack>
    </Stack>
  );
}

export default AdvisoryMasterItem;
