import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import AdjustIcon from '@mui/icons-material/Adjust';
import List from '@mui/material/List';

import Dialog from '@mui/material/Dialog';
import { Box, Container } from '@mui/system';
import { Divider, Stack, Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';
import SearchInput from 'components/SearchInput';
import FilterColumn from './FilterColumn';

export interface SimpleDialogProps {
  open: boolean;
  onClose: (value: string | boolean) => void;
  data: any;
}

function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, open, data } = props;

  const handleClose = () => {
    onClose(false);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <Container sx={{ width: 'max-content' }}>
        <Box>
          <Stack spacing={2}>
            <Typography variant="h5" sx={{ m: 2, margintop: '20px' }}>
              CHOOSE YOUR COLUMN
            </Typography>
            <SearchInput />
            <Divider />
            <FilterColumn data={data} />
            <Divider />
          </Stack>
        </Box>
        <List></List>
      </Container>
    </Dialog>
  );
}

export interface EditColumDailogBox {
  headerGroups: any;
}

export default function EditColumDailogBox(props: EditColumDailogBox) {
  const { headerGroups } = props;

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string | boolean) => {
    setOpen(false);
  };

  return (
    <div>
      <Tooltip title="edit">
        <IconButton
          onClick={handleClickOpen}
          sx={{
            color: '#2C00D3',
            background: '#E5E9FF'
          }}
        >
          <AdjustIcon />
        </IconButton>
      </Tooltip>
      <SimpleDialog open={open} onClose={handleClose} data={headerGroups} />
    </div>
  );
}
