import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Dialog, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
//import SessionItem from './SessionItem';
import CreateSession from './CreateSession';
import { useDispatch, useSelector } from 'store';
import { useNavigate } from 'react-router-dom';
import Loader from 'components/Loader';
import { getProgramSessions } from 'store/reducers/programSessions';
import { reset as programPlansReset } from 'store/reducers/programPlans';
import CalenderView from '../CalenderLayout/CalenderView';
import ContextWrapper from 'contexts/CalenderContext/ContextWrapper';

// ==============================|| SPECIAL PROGRAM PAGE ||============================== //

const SessionList = () => {
  const [open, setOpen] = useState(false);
  const { programSessions } = useSelector((state) => state.programSessions);
  const dispatch = useDispatch();
  const history = useNavigate();
  const bgColor = { background: 'linear-gradient(103.4deg, #2D00D2 12.04%, #2C00D3 30.87%, #3700C8 46.11%, #3E00C0 63.54%, #4B00B4 80.82%, #5400AA 93.76%)', color: " #FFFFFF", borderRadius: "10px" }

  const init = async () => {
    try {
      dispatch(programPlansReset());
      await dispatch(getProgramSessions());
    } catch (error) {
      console.log({ error: error });
    }
  };

  useEffect(() => {
    init();
  }, [open]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async () => {
    setOpen(false);
  };

  const handleOnClick = () => {
    history('/session-plans');
  };

  if (!programSessions) {
    return <Loader />;
  }

  return (
    <MainCard content={false} sx={{ width: '100%', background: "transparent" }} >
      <Stack spacing={3}>
        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ p: 3, pb: 3 }}>
          <Typography variant="h4">{`Sessions`}</Typography>
          <Stack direction="row" spacing={2}>
            <Button sx={bgColor} startIcon={<PlusOutlined />} onClick={handleClickOpen}>
              New Session
            </Button>
            <Button sx={bgColor} onClick={handleOnClick}>
              Session Plans
            </Button>
          </Stack>
        </Stack>
      </Stack>
      {/* {programSessions &&
        programSessions.map((session: any, index: number) => {
          return <SessionItem {...session} />;
        })} */}
      <ContextWrapper>
        <CalenderView />
      </ContextWrapper>
      <Dialog
        onClose={(_: any, reason: string) => {
          if (reason !== 'backdropClick') {
            handleClose();
          }
        }}
        open={open}
      >
        {open && <CreateSession handleClose={handleClose} />}
      </Dialog>
    </MainCard>
  );
};

export default SessionList;
