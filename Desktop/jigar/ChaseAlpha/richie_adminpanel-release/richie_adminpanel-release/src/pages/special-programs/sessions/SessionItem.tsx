// material-ui
import { CloseOutlined, EyeTwoTone, EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { Button, CardMedia, Dialog, Grid, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { Box, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { format } from 'date-fns';
import axios from 'utils/axios';
import { BASE_URL } from 'config';
// assets
import Dashboard1 from 'assets/images/widget/dashborad-1.jpg';
import { useState } from 'react';
import { useDispatch } from 'store';
import UpdateSession from './UpdateSession';
import ViewSession from './ViewSession';
import { openSnackbar } from 'store/reducers/snackbar';
import { getProgramSessions } from 'store/reducers/programSessions';

const mediaSX = {
  width: 150,
  height: 150,
  borderRadius: 1
};

const SessionItem = (session: any) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenUpdateDialog = () => {
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
  };

  const handleClickDeleteOpen = () => {
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  const handleDeleteApi = async () => {
    axios.delete(`${BASE_URL}/learning/session/${session._id}`).then(async () => {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Session is deleted successfully',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: true
        })
      );
      await dispatch(getProgramSessions());
      handleDeleteClose();
    });
  };
  
  const collapseIcon = false ? (
    <CloseOutlined style={{ color: theme.palette.error.main }} />
  ) : (
    <EyeTwoTone twoToneColor={theme.palette.secondary.main} />
  );
  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      <Grid item xs={12}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <CardMedia component="img" image={Dashboard1} title="image" sx={mediaSX} />
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  align="left"
                  variant="h4"
                  sx={{ maxWidth: '450px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {session.sessionName}
                </Typography>
                <Typography
                  align="left"
                  // dangerouslySetInnerHTML={{ __html: session.description }}
                  style={{ padding: 0, margin: 0, maxWidth: '450px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {session.description}
                </Typography>
                <Typography align="left" sx={{ maxWidth: '450px' }} variant="caption" color="secondary">
                  {`Link | ${session.sessionLink}`}
                </Typography>
                <Typography align="left" sx={{ maxWidth: '450px' }} variant="subtitle2">
                  {format(new Date(session.date), 'PPpp')}
                </Typography>
              </Grid>
            </Grid>
            <Stack direction="row" alignItems="left" justifyContent="left" spacing={0}>
              <Tooltip title="View">
                <Button color="secondary" size="small" startIcon={collapseIcon} href={`/special-programs/${session._id}`}>
                  View
                </Button>
              </Tooltip>
              <Tooltip title="Edit">
                <Button
                  color="primary"
                  size="small"
                  startIcon={<EditTwoTone twoToneColor={theme.palette.primary.main} />}
                  onClick={handleClickOpenUpdateDialog}
                >
                  Edit
                </Button>
              </Tooltip>
              <Tooltip title="Delete">
                <Button
                  color="error"
                  size="small"
                  onClick={handleClickDeleteOpen}
                  startIcon={<DeleteTwoTone twoToneColor={theme.palette.error.main} />}
                >
                  Delete
                </Button>
              </Tooltip>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        fullWidth
        maxWidth="sm"
        onClose={(_: any, reason: string) => {
          if (reason !== 'backdropClick') {
            handleClose();
          }
        }}
        open={open}
      >
        {open && <ViewSession session={session} handleClose={handleClose} />}
      </Dialog>
      <Dialog
        fullWidth
        maxWidth="sm"
        onClose={(_: any, reason: string) => {
          if (reason !== 'backdropClick') {
            handleClose();
          }
        }}
        open={openUpdateDialog}
      >
        {openUpdateDialog && <UpdateSession session={session} handleClose={handleCloseUpdateDialog} />}
      </Dialog>
      <Dialog
        open={openDelete}
        onClose={(_: any, reason: string) => {
          if (reason !== 'backdropClick') {
            handleDeleteClose();
          }
        }}
      >
        <Box sx={{ p: 1, py: 1.5 }}>
          <DialogTitle id="alert-dialog-title">Delete {session.sessionName}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">Do you want to delete it?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={handleDeleteClose}>
              Close
            </Button>
            <Button variant="contained" onClick={handleDeleteApi}>
              Yes, Delete it
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Grid>
  );
};

export default SessionItem;
