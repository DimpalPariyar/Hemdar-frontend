import { PlusOutlined } from '@ant-design/icons';
import { Stack, Typography, Button, Dialog } from '@mui/material';
import axios from 'utils/axios';
import MainCard from 'components/MainCard';
import { BASE_URL } from 'config';
import { useState, useEffect } from 'react';
import HostProfileWidget from './HostProfileWidget';
import ViewHostProfile from './ViewHostProfile';
import CreateHostProfile from './CreateHostProfile';
import UpdateHostProfile from './UpdateHostProfile';

const HostProfile = () => {
  const [hostProfiles, setHostProfiles] = useState<any>([]);

  const [open, setOpen] = useState(false);
  const [currentHostProfile, setCurrentHostProfile] = useState<any>();

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const init = async () => {
    try {
      await axios.get(`${BASE_URL}/hostProfile/all`).then((response: any) => {
        setHostProfiles(response.data || []);
      });
    } catch (error) {
      setHostProfiles([]);
      console.log({ error: error });
    }
  };

  useEffect(() => {
    init();
  }, []);

  const handleClickOpenCreate = () => {
    setOpenCreate(true);
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
    init();
  };

  const handleClickOpenUpdate = (index: any) => {
    setOpenUpdate(true);
    setCurrentHostProfile(hostProfiles[index]);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
    setCurrentHostProfile('');
    init();
  };

  const handleClickOpen = (index: any) => {
    setOpen(true);
    setCurrentHostProfile(hostProfiles[index]);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentHostProfile('');
  };

  const handleDelete = () => {
    init();
  };

  return (
    <MainCard content={false}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ p: 3, pb: 3 }}>
          <Typography variant="h4">Instructors List</Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleClickOpenCreate}>
              Add New Instructor
            </Button>
          </Stack>
        </Stack>
      </Stack>
      {hostProfiles &&
        hostProfiles.map((hostProfile: any, index: number) => {
          return (
            <HostProfileWidget
              hostProfile={hostProfile}
              key={index}
              open={open}
              handleClickOpen={() => handleClickOpen(index)}
              handleClickOpenUpdate={() => handleClickOpenUpdate(index)}
              handleClose={handleClose}
              handleDelete={handleDelete}
            />
          );
        })}
      <Dialog
        fullWidth
        maxWidth={'md'}
        onClose={(_, reason) => {
          if (reason !== 'backdropClick') {
            handleClose();
          }
        }}
        open={open}
        sx={{ '& .MuiDialog-paper': { p: 0 } }}
      >
        {open && <ViewHostProfile hostProfile={currentHostProfile} handleClose={handleClose} />}
      </Dialog>
      <Dialog
        fullWidth
        maxWidth={'md'}
        onClose={(_, reason) => {
          if (reason !== 'backdropClick') {
            handleCloseCreate();
          }
        }}
        open={openCreate}
        sx={{ '& .MuiDialog-paper': { p: 0 } }}
      >
        {openCreate && <CreateHostProfile handleClose={handleCloseCreate} />}
      </Dialog>
      <Dialog
        fullWidth
        maxWidth={'md'}
        onClose={(_, reason) => {
          if (reason !== 'backdropClick') {
            handleCloseUpdate();
          }
        }}
        open={openUpdate}
        sx={{ '& .MuiDialog-paper': { p: 0 } }}
      >
        {openUpdate && <UpdateHostProfile hostProfile={currentHostProfile} handleClose={handleCloseUpdate} />}
      </Dialog>
    </MainCard>
  );
};

export default HostProfile;
