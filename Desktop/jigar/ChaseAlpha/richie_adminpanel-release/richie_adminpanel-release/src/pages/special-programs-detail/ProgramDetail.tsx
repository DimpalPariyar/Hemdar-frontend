import { useMediaQuery, ListItem, Grid, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MainCard from 'components/MainCard';

function ProgramDetail({ session }: any) {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <MainCard title={session.sessionName} border={false} sx={{ overflow: 'auto' }}>
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
    </MainCard>
  );
}

export default ProgramDetail;
