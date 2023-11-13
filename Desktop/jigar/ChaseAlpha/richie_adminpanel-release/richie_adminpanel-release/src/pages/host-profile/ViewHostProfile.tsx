/* eslint-disable  @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
// material-ui
import {
  Stack,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
// project import
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';

interface Props {
  handleClose: () => void;
  hostProfile: any;
}

const ViewHostProfile = ({ handleClose, hostProfile }: Props) => {
  const [profile, setProfile] = useState<any>();

  useEffect(() => {
    setProfile(hostProfile);
  }, []);

  const CustomListItem = ({ fieldName, fieldValue }: any) => {
    const theme = useTheme();
    const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));

    return (
      <ListItem divider={!matchDownMD}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack spacing={0.5}>
              <Typography color="secondary">Field Name</Typography>
              <Typography>{fieldName}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={0.5}>
              <Typography color="secondary">Field Value</Typography>
              <Typography
                sx={{
                  maxWidth: '450px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {fieldValue}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </ListItem>
    );
  };

  return (
    <MainCard sx={{ overflow: 'auto' }}>
      <DialogTitle>{`Instructor Name - ${profile?.hostName}`}</DialogTitle>
      <DialogContent>
        <List sx={{ py: 0 }}>
          {profile && (
            <>
              <CustomListItem fieldName={'Instructor Name'} fieldValue={profile?.hostName} />
              <CustomListItem fieldName={'Role'} fieldValue={profile?.role} />
              <CustomListItem fieldName={'Short Description'} fieldValue={profile?.shortDescription} />
              <CustomListItem fieldName={'Profile Image'} fieldValue={profile?.profileImage} />
              <CustomListItem fieldName={'Email Address'} fieldValue={profile?.email} />
              <CustomListItem fieldName={'Phone Number'} fieldValue={profile?.phoneNumber} />
              <CustomListItem fieldName={'Privileges'} fieldValue={profile?.type.join(',')} />
            </>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <AnimateButton>
            <Button variant="contained" onClick={handleClose}>
              Close
            </Button>
          </AnimateButton>
        </Stack>
      </DialogActions>
    </MainCard>
  );
};

export default ViewHostProfile;
