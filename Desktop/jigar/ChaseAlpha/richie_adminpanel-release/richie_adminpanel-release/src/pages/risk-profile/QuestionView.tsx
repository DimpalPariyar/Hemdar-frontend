// material-ui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Grid, List, ListItem, Stack, TableCell, TableRow, Typography } from '@mui/material';
// project import
import MainCard from 'components/MainCard';

// ==============================|| Question - VIEW ||============================== //

const QuestionView = ({ data }: any) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <TableRow sx={{ '&:hover': { bgcolor: `transparent !important` } }}>
      <TableCell colSpan={8} sx={{ p: 2.5 }}>
        <Grid container spacing={2.5} sx={{ pl: { xs: 0, sm: 5, md: 6, lg: 10, xl: 12 } }}>
          <Grid item xs={12} sm={7} md={8} lg={9}>
            <Stack spacing={2.5}>
              <MainCard title="Question Details">
                <Typography color="secondary" sx={{ p: 1, maxWidth: '600px', wordWrap: 'break-word' }}>
                  {data?.questionDescription}
                </Typography>
                <List sx={{ py: 0 }}>
                  {data?.options.map((option: any) => {
                    return (
                      <ListItem divider={!matchDownMD}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <Stack spacing={0.5}>
                              <Typography color="secondary">Option Name</Typography>
                              <Typography>{option.optionName}</Typography>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Stack spacing={0.5}>
                              <Typography color="secondary">Option Value</Typography>
                              <Typography>{option.optionValue}</Typography>
                            </Stack>
                          </Grid>
                        </Grid>
                      </ListItem>
                    );
                  })}
                </List>
              </MainCard>
            </Stack>
          </Grid>
        </Grid>
      </TableCell>
    </TableRow>
  );
};

export default QuestionView;
