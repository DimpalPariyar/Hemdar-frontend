import { ReactNode } from 'react';
import { Grid, Stack, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface Props {
  title: String;
  children: ReactNode;
}

const RichieHeader = ({ title, children }: Props) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stack spacing={3} sx={{ minHeight: '100px' }}>
      <Stack direction={matchDownSM ? 'column' : 'row'} spacing={1} justifyContent="space-between" alignItems="center" sx={{ p: 3, pb: 0 }}>
        <Grid container direction="row" justifyContent="space-between">
          <Typography variant="h4">{title}</Typography>
          {children}
        </Grid>
      </Stack>
    </Stack>
  );
};

export default RichieHeader;
