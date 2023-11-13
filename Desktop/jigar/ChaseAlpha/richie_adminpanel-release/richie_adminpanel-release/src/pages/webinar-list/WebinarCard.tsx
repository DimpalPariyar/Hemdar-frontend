import React from 'react';
import { Typography, Grid, Tooltip, Button, Stack, useTheme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DeleteTwoTone, EditTwoTone, EyeTwoTone } from '@ant-design/icons';
import axios from 'axios';
import { BASE_URL } from '../../config';
import { openSnackbar } from '../../store/reducers/snackbar';
import { getWebinars } from '../../store/reducers/webinars';
import { useDispatch } from '../../store';

const useStyles = makeStyles((theme) => ({
  panel: {
    height: '150px',
    backgroundColor: '#D3D3D3',
    width: '150px'
  },
  detail: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  display: {
    display: 'flex',
    gap: '10px'
  }
}));

const WebinarCard = ({ webinar }: any) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const classes = useStyles();

  const handleDeleteProduct = (id: string) => {
    axios.delete(`${BASE_URL}/learning/webinar/${id}`).then(async () => {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Product is deleted successfully',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: true
        })
      );
      dispatch(getWebinars());
    });
  };

  console.log(webinar);
  const collapseIcon = <EyeTwoTone twoToneColor={theme.palette.secondary.main} />;
  return (
    <>
      <Grid spacing={10} container direction={'row'}>
        <Grid item>
          <div className={classes.panel}></div>
        </Grid>

        <Grid item>
          <Typography variant="h4">{webinar.title}</Typography>
          <Typography>{webinar.longDescription}</Typography>
          <Typography>{webinar.shortDescription}</Typography>
          <Typography>{webinar.webinarTime}</Typography>
          <Stack direction="row" alignItems="left" justifyContent="left" spacing={0}>
            <Tooltip title="View">
              <Button href={`advisory-detail/${webinar._id}`} color="secondary" size="small" startIcon={collapseIcon}>
                View
              </Button>
            </Tooltip>
            <Tooltip title="Edit">
              <Button
                href={`webinar-edit/${webinar._id}`}
                color="primary"
                size="small"
                startIcon={<EditTwoTone twoToneColor={theme.palette.primary.main} />}
              >
                Edit
              </Button>
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                color="error"
                size="small"
                startIcon={<DeleteTwoTone twoToneColor={theme.palette.error.main} />}
                onClick={() => handleDeleteProduct(webinar?._id)}
              >
                Delete
              </Button>
            </Tooltip>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default WebinarCard;
