import { BASE_URL } from 'config';
import axios from 'utils/axios';
import { Box, Button, Chip, IconButton, InputLabel, TextField, Tooltip, Typography } from '@mui/material';
import { Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ActivityView from 'pages/user-detail/ActivityView';
import { subscriptionColumns, subscribedNotifications } from './constant';
import { height } from '@mui/system';
import { CheckCircleFilled, CloseCircleOutlined } from '@ant-design/icons';
const FastinputfieldStyle = {
  bgcolor: '#ECEFFF',
  borderRadius: '10px',
  padding: '8px 10px',
  width: '334px',
  '&:hover': {
    border: '1px solid #2D00D2'
  }
};
const grayBgColor = {
  bgcolor: (theme: any) => '#ECEFFF',
  borderRadius: '10px'
};

const bgColor = {
  background: 'linear-gradient(103.4deg, #2D00D2 12.04%, #2C00D3 30.87%, #3700C8 46.11%, #3E00C0 63.54%, #4B00B4 80.82%, #5400AA 93.76%)',
  color: ' #FFFFFF',
  borderRadius: '10px',
  width: '150px',
  height: '40px'
};
const BgTabColor = '#ECEFFF';
const Tabcolor = {
  flex: 1,
  fontWeight: 600,
  '&.Mui-selected': { color: '#2D00D2', bgcolor: 'white', borderTop: '10px solid #2D00D2' },
  '&:hover': {
    color: '#2D00D2',
    bgcolor: '#F6F7FF'
  }
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Stack sx={{ p: 3 }}>{children}</Stack>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `activity-tab-${index}`,
    'aria-controls': `activity-tabpanel-${index}`
  };
}

const SearchUser = ({ setIsSearchUser }: any) => {
  const [name, setName] = useState<string>('');
  const [data, setData] = useState<any>('');
  const [notifications, setNotifications] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [subscriptions, setSubscriptions] = useState<any>({});
  const [pagecount, setpagecount] = useState(1);
  const { id = '' } = useParams<{ id: string }>();
  const [value, setValue] = useState(0);
  const [trades, settrades] = useState(true);
  const SearchUser = async () => {
    try {
      const data = {
        name: name
      };
      const response = await axios.post(`${BASE_URL}/admin/getUserdetail`, data);
      setData(response.data);
      setIsSearchUser(true);
    } catch (e) {
      console.log(e);
    }
  };
  const syncsubscription = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/sync-subscriptions/${data?.userId}`);
      alert(response.data.message);
    } catch (e) {
      console.log(e);
    }
  };

  const initNotifications = async (page: number = 1) => {
    if (data)
      try {
        setLoading(true);
        const params: any = {
          skip: page,
          limit: 10,
          subscribedUsers: data?.userId,
          trades
        };
        const response = await axios.post(`${BASE_URL}/newnotification/user-notifications`, params);
        setNotifications(response.data.notifications || []);
        setpagecount(page);
      } catch (error) {
        console.log({ error: error });
      } finally {
        setLoading(false);
      }
  };
  const initSubscription = async (page: number = 1) => {
    if (data)
      try {
        setLoading(true);
        const params: any = {
          page,
          limit: 10,
          userId: data?.userId
        };
        const response = await axios.get(`${BASE_URL}/admin/subscriptions?${new URLSearchParams(params).toString()}`);
        setSubscriptions(response.data || []);
      } catch (error) {
        console.log({ error: error });
      } finally {
        setLoading(false);
      }
  };
  useEffect(() => {
    initNotifications();
    initSubscription();
  }, [data]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  useEffect(() => {
    initNotifications();
  }, [trades]);
  const udpateCustomnotification = async () => {
    const userId = data?.userId;
    const response = await axios.post(`${BASE_URL}/user/updatecustomarray`, { userId });
    if (response.data) {
      SearchUser();
    }
  };

  return (
    <>
      <Box>
        <Typography variant="h5" sx={{ m: 1 }}>
          Search User
        </Typography>
        <Stack direction="row" sx={{ alignItems: 'center' }}>
          <TextField
            placeholder="name | email | Mobile Number"
            style={FastinputfieldStyle}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button sx={bgColor} onClick={SearchUser}>
            Search User
          </Button>
        </Stack>
        {data && (
          <Box bgcolor="white" margin={5} pb={2}>
            <Stack direction="row" sx={{ p: 3 }} spacing={10}>
              <Stack direction="row" sx={{ alignItems: 'center' }}>
                <Typography sx={{ mr: 3 }}>Name :</Typography>
                <Chip sx={{ bgcolor: '#ECEFFF', minWidth: 160, height: 50 }} label={data?.Name} size="small" variant="light"></Chip>
              </Stack>
              <Stack direction="row" sx={{ alignItems: 'center' }}>
                <Typography sx={{ mr: 3 }}>Email :</Typography>
                <Chip sx={{ bgcolor: '#ECEFFF', minWidth: 160, height: 50 }} label={data?.email} size="small" variant="light"></Chip>
              </Stack>
              <Button sx={bgColor} onClick={syncsubscription}>
                Sync Subscription
              </Button>
            </Stack>
            <Stack direction="row" sx={{ p: 3 }} spacing={10}>
              <Stack direction="row" sx={{ alignItems: 'center' }}>
                <Typography sx={{ mr: 3 }}>Mobile :</Typography>
                <Chip sx={{ bgcolor: '#ECEFFF', minWidth: 160, height: 50 }} label={data?.mobile} size="small" variant="light"></Chip>
              </Stack>
              <Stack direction="row" sx={{ alignItems: 'center' }}>
                <Typography sx={{ mr: 3 }}>Pan Number :</Typography>
                <Chip sx={{ bgcolor: '#ECEFFF', minWidth: 160, height: 50 }} label={data?.panNumber} size="small" variant="light"></Chip>
              </Stack>
              <Stack direction="row" sx={{ alignItems: 'center' }}>
                <Typography sx={{ mr: 3 }}>App Version :</Typography>
                <Chip sx={{ bgcolor: '#ECEFFF', minWidth: 160, height: 50 }} label={data?.appVersion} size="small" variant="light"></Chip>
              </Stack>
            </Stack>
            <Stack direction="row" pl={3} pb={2}>
              <InputLabel minWidth={160} pt={2} pb={2} component={Typography} sx={{ fontWeight: '600' }}>
                CustomNotification:
              </InputLabel>
              <Stack
                flexDirection="row"
                alignItems="flex-start"
                justifyContent="space-between"
                component={Button}
                pl={2}
                pt={1}
                sx={grayBgColor}
                onClick={udpateCustomnotification}
              >
                Update Notification Type
              </Stack>
            </Stack>
            <Stack direction="row" gap={2} pl={2} pr={2}>
              {data?.customNotification?.map((notification: any) => {
                return (
                  <>
                    <Stack
                      flexDirection="row"
                      alignItems="flex-start"
                      justifyContent="space-between"
                      component={Typography}
                      pl={2}
                      pt={1}
                      maxWidth={200}
                      sx={grayBgColor}
                      // height={isTextArea ? 200 : 'auto'}
                    >
                      {notification.typeOfNotification}
                      {notification.status && (
                        <Tooltip title="Verified">
                          <IconButton sx={{ padding: 0 }} color="success">
                            <CheckCircleFilled />
                          </IconButton>
                        </Tooltip>
                      )}
                      {!notification.status && (
                        <Tooltip title="Verified">
                          <IconButton sx={{ padding: 0 }} color="error">
                            <CloseCircleOutlined />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </>
                );
              })}
            </Stack>
          </Box>
        )}

        {data && (
          <>
            <Stack sx={{ width: '100%', borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                sx={{ borderTopLeftRadius: '25px', borderTopRightRadius: '25px' }}
                TabIndicatorProps={{
                  sx: {
                    top: 0,
                    background: `${BgTabColor}`
                  }
                }}
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab sx={Tabcolor} label="Subscription" {...a11yProps(0)} />
                <Tab sx={Tabcolor} label="Subscribed Notifications" {...a11yProps(1)} />
              </Tabs>
            </Stack>
            <TabPanel value={value} index={0}>
              <ActivityView
                loading={loading}
                data={subscriptions.items}
                totalPage={subscriptions.pageTotal}
                onPageChange={initSubscription}
                currentPage={subscriptions.page}
                columns={subscriptionColumns}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Stack direction="row" justifyContent="end">
                <Button sx={bgColor} onClick={() => settrades(!trades)}>
                  {trades ? 'information notification' : 'Trades Notification'}
                </Button>
              </Stack>
              <ActivityView
                data={notifications}
                currentPage={pagecount}
                loading={loading}
                totalPage={100}
                onPageChange={initNotifications}
                columns={subscribedNotifications}
              />
            </TabPanel>
          </>
        )}
      </Box>
    </>
  );
};

export default SearchUser;
