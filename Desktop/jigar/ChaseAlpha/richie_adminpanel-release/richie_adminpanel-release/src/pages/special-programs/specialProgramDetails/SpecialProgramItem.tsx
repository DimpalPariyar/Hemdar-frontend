import { CloseOutlined, EyeTwoTone, EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import {
  Box,
  Button,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Stack,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
// assets
import axios from 'utils/axios';
import { BASE_URL } from 'config';
import { openSnackbar } from 'store/reducers/snackbar';
import Dashboard1 from 'assets/images/widget/dashborad-1.jpg';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'store';
import { getProgramList } from 'store/reducers/specialProgram';
import { getCurrentProgram, setProgramId, setProgramName } from 'store/reducers/specialProgram';
import UpdateProgram from './UpdateSpecialProgram';
import ViewSpecialProgram from './ViewSpecialProgramDetails';

const mediaSX = {
  width: 150,
  height: 150,
  borderRadius: 1
};

const SpecialProgramCard = ({ programId, programTitle }: any) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useNavigate();

  const [open, setOpen] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const collapseIcon = false ? (
    <CloseOutlined style={{ color: theme.palette.error.main }} />
  ) : (
    <EyeTwoTone twoToneColor={theme.palette.secondary.main} />
  );

  const handleOnClick = () => {
    dispatch(setProgramId({ programId: programId }));
    dispatch(setProgramName({ programName: programTitle }));
    history('/session-list');
  };

  const handleClickOpen = async () => {
    await dispatch(getCurrentProgram(programId));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenUpdateDialog = async () => {
    dispatch(setProgramId({ programId: programId }));
    dispatch(setProgramName({ programName: programTitle }));
    await dispatch(getCurrentProgram(programId));
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = async () => {
    // await dispatch(getProgramList());
    setOpenUpdateDialog(false);
  };

  const handleClickDeleteOpen = () => {
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  const handleDeleteApi = async () => {
    axios.delete(`${BASE_URL}/learning/program/${programId}`).then(async () => {
      dispatch(
        openSnackbar({
          open: true,
          message: 'OTP Plan is deleted successfully',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: true
        })
      );
      await dispatch(getProgramList());
      handleDeleteClose();
    });
  };

  return (
    <Grid container spacing={3} sx={{ p: 3 }} key={programId}>
      <Grid item xs={12}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <CardMedia component="img" image={Dashboard1} title="image" sx={mediaSX} />
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button onClick={handleOnClick}>
                  <Typography
                    variant="h4"
                    sx={{
                      maxWidth: '450px',
                      textDecoration: 'underline',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {programTitle}
                  </Typography>
                </Button>
              </Grid>
            </Grid>
            <Stack direction="row" alignItems="left" justifyContent="left" spacing={0}>
              <Tooltip title="View">
                <Button color="secondary" onClick={handleClickOpen} size="small" startIcon={collapseIcon}>
                  View
                </Button>
              </Tooltip>
              <Tooltip title="Edit">
                <Button
                  color="primary"
                  size="small"
                  onClick={handleClickOpenUpdateDialog}
                  startIcon={<EditTwoTone twoToneColor={theme.palette.primary.main} />}
                >
                  Edit
                </Button>
              </Tooltip>
              <Tooltip title="Delete">
                <Button
                  color="error"
                  size="small"
                  startIcon={<DeleteTwoTone twoToneColor={theme.palette.error.main} />}
                  onClick={handleClickDeleteOpen}
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
        {open && <ViewSpecialProgram handleClose={handleClose} />}
      </Dialog>
      <Dialog
        fullWidth
        maxWidth="sm"
        onClose={(_: any, reason: string) => {
          if (reason !== 'backdropClick') {
            handleCloseUpdateDialog();
          }
        }}
        open={openUpdateDialog}
      >
        {openUpdateDialog && <UpdateProgram handleClose={handleCloseUpdateDialog} />}
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
          <DialogTitle id="alert-dialog-title">Delete {programTitle}?</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Do you want to delete OTP Program completely? You will lose session and plan details completely
            </DialogContentText>
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

export default SpecialProgramCard;
