
import { Dialog, DialogActions, DialogContent, Tooltip, Typography } from '@mui/material'
import { IconButton } from '@mui/material';
import { Paper } from '@mui/material'
import { Box, Stack } from '@mui/system';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { EyeTwoTone } from '@ant-design/icons';
import EditIcon from '@mui/icons-material/Edit';
import UpdateSession from '../sessions/UpdateSession';
import { BASE_URL } from 'config';
import { DialogTitle } from '@mui/material';
import { DialogContentText } from '@mui/material';
import { Button } from '@mui/material';
import { openSnackbar } from 'store/reducers/snackbar';
import { getProgramSessions } from 'store/reducers/programSessions';
import { useDispatch } from 'store';
import axios from 'utils/axios';

const PaperStyles = {
    maxWidth: "-webkit-fill-available", overflow: "hidden", height: "60px",
    background: 'linear-gradient(97.01deg, rgba(233, 255, 231, 0.6) 0%, rgba(15, 173, 0, 0.366) 93.34%)', position: "relative",
    borderLeft: "2px solid #117D07", borderRadius: "4px", mb: 1, ml: 1, mr: 1
}
const SetIconStyles = { width: "100%", height: "100%", pt: 1, "&:hover": { display: "flex", backdropFilter: "blur(3px)", position: "absolute" } }

interface SessionProps {
    Sessionitems: any
}


const CalenderItems = ({ Sessionitems }: SessionProps) => {
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [style, setStyle] = useState<any>({ display: 'none' })
    const dispatch = useDispatch();

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
        axios.delete(`${BASE_URL}/learning/session/${Sessionitems._id}`).then(async () => {
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






    return (
        <>
            <Paper sx={PaperStyles}
                onMouseEnter={e => {
                    setStyle(SetIconStyles);
                }}
                onMouseLeave={e => {
                    setStyle({ display: 'none' })
                }}
            >
                <Stack sx={style} direction="row" spacing={2} >
                    <Tooltip title="view" placement='top'>
                        <IconButton href={`/special-programs/${Sessionitems._id}`} >
                            <EyeTwoTone />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="edit" placement='top' onClick={handleClickOpenUpdateDialog} >
                        <IconButton >
                            <EditIcon />
                        </IconButton>
                    </Tooltip >
                    <Tooltip title="delete" placement='top'>
                        <IconButton sx={{ color: '#B41D1D' }} onClick={handleClickDeleteOpen}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
                <Stack sx={{ textAlign: 'left' }}>
                    <Typography sx={{ color: "#117D07", fontSize: "12px" }}>{Sessionitems.sessionName}</Typography>
                    <Typography sx={{ color: "#8C8C8C", fontSize: "11px", overflow: "hidden", maxHeight: "14px" }}>{Sessionitems.sessionLink}</Typography>
                    <Typography sx={{ color: "black", fontSize: "11px" }}>{Sessionitems.date.split("T")[1]}</Typography>
                </Stack>
            </Paper>
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
                {openUpdateDialog && <UpdateSession session={Sessionitems} handleClose={handleCloseUpdateDialog} />}
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
                    <DialogTitle id="alert-dialog-title">Delete {Sessionitems.sessionName}</DialogTitle>
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
        </>
    )
}

export default CalenderItems