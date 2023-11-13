// material-ui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Grid, List, ListItem, Stack, Typography, Button, DialogActions, DialogContent } from '@mui/material';
// project import
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import { useSelector } from 'store';

// ==============================|| SPECIAL PROGRAM - VIEW ||============================== //
interface Props {
  handleClose: () => void;
}

const ViewSpecialProgram = ({ handleClose }: Props) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));
  const { currentProgramDetails } = useSelector((state) => state.specialProgram);

  return (
    <>
      {currentProgramDetails && (
        <MainCard title={currentProgramDetails.programTitle} sx={{ overflow: 'auto' }}>
          <DialogContent>
            <List sx={{ py: 0 }}>
              {currentProgramDetails &&
                Object.keys(currentProgramDetails).map((key, idx) => {
                  if (key === 'programTitle') {
                    return (
                      <ListItem divider={!matchDownMD} key={idx}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <Stack spacing={0.5}>
                              <Typography color="secondary">Field Name</Typography>
                              <Typography>Program Title</Typography>
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
                                {currentProgramDetails[key]}
                              </Typography>
                            </Stack>
                          </Grid>
                        </Grid>
                      </ListItem>
                    );
                  }
                  if (key === 'shortDescription') {
                    return (
                      <ListItem divider={!matchDownMD} key={idx}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <Stack spacing={0.5}>
                              <Typography color="secondary">Field Name</Typography>
                              <Typography>Short Description</Typography>
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
                                {currentProgramDetails[key]}
                              </Typography>
                            </Stack>
                          </Grid>
                        </Grid>
                      </ListItem>
                    );
                  }
                  if (key === 'longDescription') {
                    return (
                      <ListItem divider={!matchDownMD} key={idx}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <Stack spacing={0.5}>
                              <Typography color="secondary">Field Name</Typography>
                              <Typography>Long Description</Typography>
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
                                {currentProgramDetails[key]}
                              </Typography>
                            </Stack>
                          </Grid>
                        </Grid>
                      </ListItem>
                    );
                  }
                  if (key === 'bannerImage') {
                    return (
                      <ListItem divider={!matchDownMD} key={idx}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <Stack spacing={0.5}>
                              <Typography color="secondary">Field Name</Typography>
                              <Typography>Banner Image</Typography>
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
                                {currentProgramDetails[key]}
                              </Typography>
                            </Stack>
                          </Grid>
                        </Grid>
                      </ListItem>
                    );
                  }
                })}
              {currentProgramDetails &&
                Object.keys(currentProgramDetails.faqs).map((item, idxx) => {
                  return (
                    <>
                      <ListItem divider={!matchDownMD} key={idxx}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <Stack spacing={0.5}>
                              <Typography color="secondary">Field Name</Typography>
                              <Typography>{idxx + 1}. FAQ Question</Typography>
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
                                {currentProgramDetails.faqs[item].question}
                              </Typography>
                            </Stack>
                          </Grid>
                        </Grid>
                      </ListItem>
                      <ListItem divider={!matchDownMD} key={idxx}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <Stack spacing={0.5}>
                              <Typography color="secondary">Field Name</Typography>
                              <Typography>{idxx + 1}. FAQ Answer</Typography>
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
                                {currentProgramDetails.faqs[item].answer}
                              </Typography>
                            </Stack>
                          </Grid>
                        </Grid>
                      </ListItem>
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

export default ViewSpecialProgram;
