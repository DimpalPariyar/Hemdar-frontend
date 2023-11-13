import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Dialog, Stack } from '@mui/material';
import SpecialProgramItem from './SpecialProgramItem';
import { useEffect, useState } from 'react';
import CreateProgram from './CreateSpecialProgram';
import { getProgramList, reset as specialProgramReset } from 'store/reducers/specialProgram';
import { reset as programPlansReset } from 'store/reducers/programPlans';
import { reset as programSessionsReset } from 'store/reducers/programSessions';
import { useDispatch, useSelector } from 'store';

// ==============================|| SPECIAL PROGRAM PAGE ||============================== //

const SpecialProgramList = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { programList } = useSelector((state) => state.specialProgram);
  // const { reset } = useSelector((state) => state.programSessions);

  const init = async () => {
    try {
      dispatch(specialProgramReset());
      dispatch(programPlansReset());
      dispatch(programSessionsReset());
      await dispatch(getProgramList());
    } catch (error) {
      console.log({ error: error });
    }
  };

  useEffect(() => {
    init();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async () => {
    await dispatch(getProgramList());
    setOpen(false);
  };
  return (
    <MainCard content={false}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ p: 3, pb: 3 }}>
          <Typography variant="h4">Special Program Details</Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="info" startIcon={<PlusOutlined />} onClick={handleClickOpen}>
              New Program
            </Button>
          </Stack>
        </Stack>
      </Stack>
      {programList &&
        programList.map((program: any, index: number) => {
          return <SpecialProgramItem programTitle={program.programTitle} programId={program.programId} />;
        })}
      <Dialog
        onClose={(_: any, reason: string) => {
          if (reason !== 'backdropClick') {
            handleClose();
          }
        }}
        open={open}
      >
        {open && <CreateProgram handleClose={handleClose} />}
      </Dialog>
    </MainCard>
  );
};

export default SpecialProgramList;
