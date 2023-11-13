// material-ui
import { CloseOutlined, EyeTwoTone, EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { Button, CardMedia, Grid, Stack, Tooltip, Typography, useTheme } from '@mui/material';
// assets
import Dashboard1 from 'assets/images/widget/dashborad-1.jpg';

const mediaSX = {
  width: 150,
  height: 150,
  borderRadius: 1
};

// ===========================|| DATA WIDGET - LATEST POSTS ||=========================== //

const SpecialProgramCard = ({}) => {
  const theme = useTheme();

  const collapseIcon = false ? (
    <CloseOutlined style={{ color: theme.palette.error.main }} />
  ) : (
    <EyeTwoTone twoToneColor={theme.palette.secondary.main} />
  );
  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      <Grid item xs={12}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <CardMedia component="img" image={Dashboard1} title="image" sx={mediaSX} />
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  align="left"
                  variant="h4"
                  sx={{ maxWidth: '450px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  Online Trading Program
                </Typography>
                <Typography align="left" sx={{ maxWidth: '450px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Video 14 minutes ago Video 14 minutes ago Video 14 minutes ago Video 14 minutes ago Video 14 minutes ago Video 14 minutes
                  ago Video 14 minutes ago Video 14 minutes ago ago Video 14 minutes ago Video 14 minutes ago ago Video 14 minutes ago Video
                  14 minutes ago ago Video 14 minutes ago Video 14 minutes ago ago Video 14 minutes ago Video 14 minutes ago ago Video 14
                  minutes ago Video 14 minutes ago ago Video 14 minutes ago Video 14 minutes ago ago Video 14 minutes ago Video 14 minutes
                  ago ago Video 14 minutes ago Video 14 minutes ago ago Video 14 minutes ago Video 14 minutes ago
                </Typography>
                <Typography align="left" sx={{ maxWidth: '450px' }} variant="caption" color="secondary">
                  Video | 14 minutes ago
                </Typography>
                <Typography align="left" sx={{ maxWidth: '450px' }} variant="subtitle2">
                  Up unpacked friendly
                </Typography>
              </Grid>
            </Grid>
            <Stack direction="row" alignItems="left" justifyContent="left" spacing={0}>
              <Tooltip title="View">
                <Button color="secondary" size="small" startIcon={collapseIcon}>
                  View
                </Button>
              </Tooltip>
              <Tooltip title="Edit">
                <Button color="primary" size="small" startIcon={<EditTwoTone twoToneColor={theme.palette.primary.main} />}>
                  Edit
                </Button>
              </Tooltip>
              <Tooltip title="Delete">
                <Button color="error" size="small" startIcon={<DeleteTwoTone twoToneColor={theme.palette.error.main} />}>
                  Delete
                </Button>
              </Tooltip>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SpecialProgramCard;
