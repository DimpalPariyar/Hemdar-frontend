// material-ui
import { CloseOutlined, EyeTwoTone, EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { Button, CardMedia, Grid, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import axios from 'utils/axios';
import { BASE_URL } from 'config';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// assets
import Dashboard1 from 'assets/images/widget/dashborad-1.jpg';

const mediaSX = {
  width: 150,
  height: 150,
  borderRadius: 1
};

const HostProfileWidget = ({ hostProfile, handleClickOpen, handleClickOpenUpdate, handleDelete }: any) => {
  const theme = useTheme();

  const collapseIcon = false ? (
    <CloseOutlined style={{ color: theme.palette.error.main }} />
  ) : (
    <EyeTwoTone twoToneColor={theme.palette.secondary.main} />
  );

  const handleDeleteProfile = async (id: string) => {
    axios.delete(`${BASE_URL}/hostProfile/${id}`).then(async () => {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Host Profile is deleted successfully',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: true
        })
      );
      handleDelete();
    });
  };
  return (
    <Grid container spacing={3} sx={{ p: 3, pt: 0 }}>
      <Grid item xs={12}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <CardMedia component="img" image={Dashboard1 || hostProfile?.hostProfileImage} title="image" sx={mediaSX} />
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  align="left"
                  variant="h4"
                  sx={{ maxWidth: '450px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {hostProfile?.hostName}
                </Typography>
                <Typography align="left" sx={{ maxWidth: '450px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {hostProfile?.shortDescription}
                </Typography>
              </Grid>
            </Grid>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={0}>
              <Typography align="left" sx={{ maxWidth: '250px' }} variant="subtitle2">
                Host Types
              </Typography>
              <Typography align="left" sx={{ maxWidth: '150px' }} variant="subtitle2">
                {hostProfile?.type.map(({ label }: any) => label).join(',')}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="left" justifyContent="left" spacing={0}>
              <Tooltip title="View">
                <Button color="secondary" size="small" startIcon={collapseIcon} onClick={handleClickOpen}>
                  View
                </Button>
              </Tooltip>
              <Tooltip title="Edit">
                <Button
                  color="primary"
                  size="small"
                  startIcon={<EditTwoTone twoToneColor={theme.palette.primary.main} />}
                  onClick={handleClickOpenUpdate}
                >
                  Edit
                </Button>
              </Tooltip>
              <Tooltip title="Delete">
                <Button
                  color="error"
                  size="small"
                  startIcon={<DeleteTwoTone twoToneColor={theme.palette.error.main} />}
                  onClick={() => handleDeleteProfile(hostProfile._id)}
                >
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

export default HostProfileWidget;
