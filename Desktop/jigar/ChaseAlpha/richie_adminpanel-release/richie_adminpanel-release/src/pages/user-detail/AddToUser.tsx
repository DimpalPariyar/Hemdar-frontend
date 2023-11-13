import ScrollX from 'components/ScrollX';
import Loader from 'components/Loader';
import axios from 'utils/axios';
import { BASE_URL } from 'config';
import { useEffect, useState } from 'react';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack, Typography, Alert, TextField } from '@mui/material';
import Autocomplete from 'components/AutoComplete';
import { useParams } from 'react-router';
import { keyBy, uniqBy } from 'lodash';
import moment from 'moment';

const AddToUser = ({ buttonName, title, apiDetail }: any) => {
  const theme = useTheme();
  const { id: userId = '' } = useParams<{ id: string }>();
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitLoader, setSubmitLoader] = useState<boolean>(false);
  const [options, setOptions] = useState<any>([]);
  const [currentSelection, setCurrentSelection] = useState<any>([]);
  const [previousSelection, setPreviousSelection] = useState<any>([]);
  const [startDate, setStartDate] = useState<Date | string>(moment(new Date()).format('yyyy-MM-dd'));
  const [endDate, setendDate] = useState<Date | string>(moment(new Date()).format('yyyy-MM-dd'));
  const [duration, setDuration] = useState<Number>();
  const [subscriptionResponse, setSubscriptionResponse] = useState<any>([]);
  const updateItem = async () => {
    try {
      const currentValue = currentSelection.map((item: any) => item.value);
      const previousSelectionValue = previousSelection.map((item: any) => item.value);
      const currentValueWithDate = currentSelection.map((item: any) => {
        return {
          startdate: item.startDate,
          enddate: item.endDate,
          value: item.value,
          ...item
        };
      });
      const previousValueWithDate = previousSelection.map((item: any) => {
        return {
          startdate: item.startDate,
          enddate: item.endDate,
          value: item.value,
          ...item
        };
      });
      setSubmitLoader(true);
      setLoading(true);
      await axios.put(`${BASE_URL}/${apiDetail.update}`, {
        userId,
        [apiDetail.updateKey]: [...currentValue, ...previousSelectionValue],
        advisoryValue: [...currentValueWithDate, ...previousValueWithDate]
      });
      setShowDialog(false);
      setCurrentSelection([]);
    } catch (error) {
      console.log({ error: error });
    } finally {
      setSubmitLoader(false);
      setLoading(false);
    }
  };

  const initSearchItem = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/${apiDetail.search}?userId=${userId}`);
      const data = (response.data || []).map((item: any) => ({
        label: item[apiDetail.searchDataKey],
        value: item._id,
        duration: duration,
        startDate: startDate,
        endDate: endDate,
        ...item
      }));
      setOptions(data);
    } catch (error) {
      console.log({ error: error });
    } finally {
      setLoading(false);
    }
  };

  const initExistingItem = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/${apiDetail.existing}?userId=${userId}`);
      const data = (response.data || []).map((item: any) => ({ label: item[apiDetail.searchDataKey], value: item._id }));
      const subscribtionresponse = await axios.get(`${BASE_URL}/admin/subscriptions?userId=${userId}`);
      setSubscriptionResponse(subscribtionresponse.data.items);
      setPreviousSelection(data);
    } catch (error) {
      console.log({ error: error });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initSearchItem();
    initExistingItem();
  }, [showDialog]);

  const onItemChange = (event: any, value: any) => {
    value &&
      setCurrentSelection((existingItem: any) => {
        value.map((x: any) => (x.startDate = startDate));
        value.map((x: any) => (x.endDate = endDate));
        value.map((x: any) => (x.duration = duration));
        return uniqBy([...value, ...existingItem], 'value');
      });
    setStartDate(moment(new Date()).format('yyyy-MM-dd'));
    setendDate(moment(new Date()).format('yyyy-MM-dd'));
    setDuration(NaN);
  };

  const handleDialogAction = () => setShowDialog(!showDialog);

  const handlePreviousDelete = (index: number) => {
    const list = [...previousSelection];
    list.splice(index, 1);
    setPreviousSelection(list);
  };
  const handleCurrentsDelete = (index: number) => {
    const list = [...currentSelection];
    list.splice(index, 1);
    setCurrentSelection(list);
  };
  return (
    <>
      <Button
        variant="contained"
        onClick={handleDialogAction}
        sx={{ backgroundColor: '#2D00D2', '&:hover': { bgcolor: '#ECEFFF', color: 'black' } }}
      >
        {buttonName}
      </Button>
      <Dialog open={showDialog} onClose={handleDialogAction}>
        {loading && <Loader />}
        <Stack minWidth={700}>
          <DialogTitle id="alert-dialog-title">
            <Typography variant="h3">{title}</Typography>
          </DialogTitle>
          <DialogContent>
            <Stack direction="row" spacing={1}>
              <Typography variant="h5" sx={{ flex: 1, bgcolor: '#ECEFFF', height: '45px', p: '12px', borderTopLeftRadius: '15px' }}>
                Start date
              </Typography>
              <Typography variant="h5" sx={{ flex: 1, bgcolor: '#ECEFFF', height: '45px', p: '12px' }}>
                Duration
              </Typography>
              <Typography variant="h5" sx={{ flex: 1, bgcolor: '#ECEFFF', height: '45px', p: '12px' }}>
                End Date
              </Typography>
              <Typography variant="h5" sx={{ flex: 1, bgcolor: '#ECEFFF', height: '45px', p: '12px', borderTopRightRadius: '15px' }}>
                Product
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <TextField
                type="date"
                name="startDate"
                value={moment(startDate).format().slice(0, 10)}
                onChange={(e) => setStartDate(moment(e.target.value).toDate())}
                style={{ marginTop: '10px' }}
                sx={{ flex: 1, bgcolor: '#FAFAFA' }}
              />
              <TextField
                type="number"
                name="duration"
                value={duration}
                onChange={(e) => {
                  setendDate(moment(startDate).add(+e.target.value, 'days').toDate());
                  return setDuration(+e.target.value);
                }}
                style={{ marginTop: '10px' }}
                sx={{ flex: 1, bgcolor: '#F0EFEF' }}
              />
              <TextField
                type="date"
                name="endDate"
                value={moment(endDate).format().slice(0, 10)}
                onChange={(e) => setendDate(e.target.value)}
                style={{ marginTop: '10px' }}
                sx={{ flex: 1, bgcolor: '#FAFAFA' }}
              />
              <Autocomplete
                name="nameOfUnderlying"
                multiple
                value={[]}
                clearOnBlur
                disableCloseOnSelect={false}
                onChange={onItemChange}
                options={options}
                style={{ marginTop: '10px' }}
                sx={{ flex: 1, bgcolor: '#F0EFEF', mt: 1 }}
              />
            </Stack>
            <Stack flexDirection="column">
              <Typography variant="h4">Current Selection</Typography>
              {currentSelection.length === 0 && (
                <Stack component={Alert} mt={2} p={2} flexDirection="row" severity="info">
                  No item selected
                </Stack>
              )}

              <Stack direction="row" flexWrap="wrap" my={3} gap={2}>
                {currentSelection.map((item: any, i: number) => (
                  <Chip
                    sx={{ minWidth: 100, justifyContent: 'space-between', height: 'max-content', p: 1, borderRadius: '10px' }}
                    label={
                      <>
                        <Typography sx={{ fontSize: '13px' }}>{item.label}</Typography>
                        <Stack direction="row" spacing={3}>
                          <Typography sx={{ fontSize: '10px' }}>{`${moment(item.startDate).format('MMMM Do YYYY')} --- ${moment(
                            item.endDate
                          ).format('MMMM Do YYYY')}`}</Typography>
                          <Typography sx={{ fontSize: '10px' }}>{`${item.duration}day`}</Typography>
                        </Stack>
                      </>
                    }
                    onDelete={() => handleCurrentsDelete(i)}
                  />
                ))}
              </Stack>
            </Stack>
            <ScrollX>
              <Typography variant="h4">Existing Selection</Typography>
              {previousSelection.length === 0 && (
                <Stack component={Alert} mt={2} p={2} flexDirection="row" severity="info">
                  No item selected
                </Stack>
              )}
              {/* <Stack flex={1} my={3}>
                {previousSelection.map((item: any, i: number) => (
                  <Stack
                    alignItems="center"
                    justifyContent="space-between"
                    flexDirection="row"
                    gap={2}
                    component={Paper}
                    sx={{ maxWidth: 200 }}
                    variant="outlined"
                  >
                    <Typography
                      variant="subtitle1"
                      marginLeft={1}
                      sx={{
                        maxWidth: '200px',
                        whiteSpace: 'nowrap',
                        wordWrap: 'break-word',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handlePreviousDelete(i)}>
                        <DeleteTwoTone twoToneColor={theme.palette.error.main} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                ))}
              </Stack> */}

              <Stack direction="row" flexWrap="wrap" my={3} gap={2}>
                {previousSelection.map((item: any, i: number) => (
                  <Chip
                    sx={{
                      minWidth: 100,
                      justifyContent: 'space-between',
                      height: 'max-content',
                      p: 1,
                      borderRadius: '10px',
                      bgcolor: '#ECEFFF'
                    }}
                    label={
                      <>
                        <Typography sx={{ fontSize: '13px' }}>{item.label}</Typography>
                        <Stack direction="row" spacing={3}>
                          <Typography sx={{ fontSize: '10px' }}>
                            {subscriptionResponse?.map((adviceId: any) => {
                              if (adviceId?.advisoryId?._id === item.value) {
                                return (
                                  <>
                                    <Typography key={adviceId?._id} sx={{ fontSize: '10px' }}>{`${moment(adviceId.startTime).format(
                                      'MMMM Do YYYY'
                                    )} --- ${moment(adviceId.endTime).format('MMMM Do YYYY')}`}</Typography>
                                    <Typography>{adviceId.active ? 'active' : 'expired'}</Typography>
                                  </>
                                );
                              }
                            })}
                          </Typography>
                        </Stack>
                      </>
                    }
                    onDelete={() => handlePreviousDelete(i)}
                  />
                ))}
              </Stack>
            </ScrollX>
            <Stack justifyContent="flex-end" flexDirection="row" gap={2} alignItems="flex-end" component={DialogActions} mt={2}>
              <Button color="error" onClick={handleDialogAction}>
                Close
              </Button>
              <Button disabled={submitLoader} variant="contained" onClick={updateItem}>
                Submit
              </Button>
            </Stack>
          </DialogContent>
        </Stack>
      </Dialog>
    </>
  );
};

export default AddToUser;
