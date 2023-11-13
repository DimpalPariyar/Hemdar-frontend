import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import AdvisoryMasterItem from './AdvisoryMasterItem';
import NewAdvisoryMaster from './NewAdvisoryMaster';
import useActivityMaster from '../../../hooks/useActivityMaster';

function AdvisoryMasterLayout({ apiUrl, dataKey, header }: any) {
  const { data, createItem, updateItem, deleteItem } = useActivityMaster({ apiUrl });

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">{header}</Typography>
        <NewAdvisoryMaster onSubmit={createItem} dataKey={dataKey} />
      </Box>
      {data.length === 0 && (
        <Box component="span" borderRadius={2} my={2} sx={{ px: 2, py: 4, border: '1px dashed grey' }}>
          <Typography variant="h4" textAlign="center">
            No Items Found
          </Typography>
        </Box>
      )}
      <Box display="flex" flexWrap="wrap">
        {data.map((item: any) => (
          <AdvisoryMasterItem item={item} updateItem={updateItem} dataKey={dataKey} deleteItem={deleteItem} key={item.id} />
        ))}
      </Box>
    </Box>
  );
}

export default AdvisoryMasterLayout;
