// material-ui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Grid, List, ListItem, Stack, Typography, Button, DialogActions, DialogContent } from '@mui/material';
// project import
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';

// ==============================|| Question - VIEW ||============================== //
interface Props {
  handleClose: () => void;
  session: any;
}

const ViewSession = ({ handleClose, session }: Props) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <>
      {session && (
        <MainCard title={session.sessionName} sx={{ overflow: 'auto' }}>
          <DialogContent>
            <List sx={{ py: 0 }}>
              {session &&
                Object.keys(session).map((key, idx) => {
                  return (
                    <>
                      {key !== 'hostDetails' && key !== 'hostIds' && (
                        <ListItem divider={!matchDownMD} key={idx}>
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                              <Stack spacing={0.5}>
                                <Typography color="secondary">Field Name</Typography>
                                <Typography>{key}</Typography>
                              </Stack>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Stack spacing={0.5}>
                                <Typography color="secondary">Field Value</Typography>
                                <Typography>{session[key]}</Typography>
                              </Stack>
                            </Grid>
                          </Grid>
                        </ListItem>
                      )}
                    </>
                  );
                })}
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
      )}
    </>
  );
};

export default ViewSession;
