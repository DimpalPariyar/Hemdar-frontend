import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Button, InputLabel, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { riskColumns, subscriptionColumns, subscribedNotifications, WhatsappMessage,CouponList } from './constant';
import ActivityView from './ActivityView';
import axios from 'utils/axios';
import { BASE_URL } from 'config';
import { useParams } from 'react-router';
import { columns as OrderColumns } from 'pages/order-list/constant';
import CkycTab from './CkycTab';
import Engagement from './Engagement';
import Offers from './Offers';
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const bgColor = {
  background: 'linear-gradient(103.4deg, #2D00D2 12.04%, #2C00D3 30.87%, #3700C8 46.11%, #3E00C0 63.54%, #4B00B4 80.82%, #5400AA 93.76%)',
  color: ' #FFFFFF',
  borderRadius: '10px',
  width: '150px',
  height: '40px',
  fontSize: '10px'
};

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

export default function ActivityTab({ userInfo }: any) {
  const { id = '' } = useParams<{ id: string }>();
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [subscriptions, setSubscriptions] = useState<any>({});
  const [whatsappmsg, setWhatsappMsg] = useState<any>({});
  const [showWhatsappMsg, setshowWhatsappMsg] = useState(false);
  const [orders, setOrders] = useState<any>({});
  const [notifications, setNotifications] = useState<any>({});
  const [ckycdata, setCkycdata] = useState<any>({});
  const [pagecount, setpagecount] = useState(0);
  const [trades, settrades] = useState(true);
  const [couponlist, setcouponlist] = useState<any>([]);
  const [showCouponlist, setshowCouponlist] = useState(true)
  const [refetchWhatsapp, setrefetchWhatsapp] = useState(false);
  const [refetchcoupon, setrefetchcoupon] = useState(false);
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
  const initSubscription = async (page: number = 1) => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: 10,
        userId: id
      };
      const response = await axios.get(`${BASE_URL}/admin/subscriptions?${new URLSearchParams(params).toString()}`);
      setSubscriptions(response.data || []);
      const ckycresponse = await axios.get(`${BASE_URL}/admin/user-ckyc/${id}`);
      setCkycdata(ckycresponse?.data || []);
    } catch (error) {
      console.log({ error: error });
    } finally {
      setLoading(false);
    }
  };
  const initWhatsappMsg = async (page: number = 1) => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: 10,
        userId: id
      };
      const response = await axios.get(`${BASE_URL}/user/whatsappMsg?${new URLSearchParams(params).toString()}`);
      setWhatsappMsg(response.data.items || []);
    } catch (error) {
      console.log({ error: error });
    } finally {
      setLoading(false);
    }
  };
  const inituserCounponlist = async (page: number = 1) => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: 10,
        userId: id
      };
      const response = await axios.get(`${BASE_URL}/coupon?${new URLSearchParams(params).toString()}`);
      setcouponlist(response.data || []);
    } catch (error) {
      console.log({ error: error });
    } finally {
      setLoading(false);
    }
  };
  const initOrders = async (page: number = 1) => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: 10,
        userId: id
      };
      const response = await axios.get(`${BASE_URL}/admin/orders?${new URLSearchParams(params).toString()}`);
      setOrders(response.data || []);
    } catch (error) {
      console.log({ error: error });
    } finally {
      setLoading(false);
    }
  };
  const initNotifications = async (page: number = 1) => {
    try {
      setLoading(true);
      const params: any = {
        skip: page,
        limit: 10,
        subscribedUsers: id,
        trades: trades
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
  useEffect(() => {
    initSubscription();
    initOrders();
    initNotifications();
    initWhatsappMsg();
    inituserCounponlist();
    if (Object.keys(orders).length > 0 && Object.keys(subscriptions).length > 0) {
      setSubscriptions(() => {
        subscriptions.items[0].type = orders.items[0].type;
        return subscriptions;
      });
    }
  }, []);
  useEffect(() => {
    initNotifications();
  }, [trades]);
  useEffect(() => {
    initWhatsappMsg();
  }, [refetchWhatsapp]);
  useEffect(() => {
    inituserCounponlist();
  }, [refetchcoupon]);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
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
          <Tab sx={Tabcolor} label="Order" {...a11yProps(0)} />
          <Tab sx={Tabcolor} label="Subscription" {...a11yProps(1)} />
          <Tab sx={Tabcolor} label="Risk Profile History" {...a11yProps(2)} />
          <Tab sx={Tabcolor} label="Communication" {...a11yProps(3)} />
          <Tab sx={Tabcolor} label="CKYC Information" {...a11yProps(4)} />
          <Tab sx={Tabcolor} label="Engagement" {...a11yProps(5)} />
          <Tab sx={Tabcolor} label="Offers" {...a11yProps(6)} />
        </Tabs>
      </Stack>
      <TabPanel value={value} index={0}>
        <ActivityView
          data={orders.items}
          currentPage={orders.page}
          loading={loading}
          totalPage={orders.pageTotal}
          onPageChange={initOrders}
          columns={OrderColumns()}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ActivityView
          loading={loading}
          data={subscriptions.items}
          totalPage={subscriptions.pageTotal}
          onPageChange={initSubscription}
          currentPage={subscriptions.page}
          columns={subscriptionColumns}
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ActivityView data={userInfo?.riskTest} columns={riskColumns} />
      </TabPanel>

      <TabPanel value={value} index={3}>
        {!showWhatsappMsg && (
          <>
            <Stack direction="row" justifyContent="space-between">
              <div></div>
              <InputLabel sx={{ fontSize: '18px', fontWeight: '800' }}>----App Notification----</InputLabel>
              <Stack direction="row" gap={2}>
                <Button sx={bgColor} onClick={() => settrades(!trades)}>
                  {trades ? 'information notification' : 'Trades Notification'}
                </Button>
                <Button sx={bgColor} onClick={() => setshowWhatsappMsg(!showWhatsappMsg)}>
                  {'Whatapp Message'}
                </Button>
              </Stack>
            </Stack>
            <ActivityView
              data={notifications}
              currentPage={pagecount}
              loading={loading}
              totalPage={100}
              onPageChange={initNotifications}
              columns={subscribedNotifications}
            />
          </>
        )}
        {showWhatsappMsg && (
          <>
            <Stack direction="row" justifyContent="space-between">
              <div></div>
              <InputLabel sx={{ fontSize: '18px', fontWeight: '800' }}>----Whatsapp Notification----</InputLabel>
              <Button sx={bgColor} onClick={() => setshowWhatsappMsg(!showWhatsappMsg)}>
                {'Show App Notifications'}
              </Button>
            </Stack>
            <ActivityView
              data={whatsappmsg}
              currentPage={pagecount}
              loading={loading}
              totalPage={100}
              onPageChange={initWhatsappMsg}
              columns={WhatsappMessage}
            />
          </>
        )}
      </TabPanel>
      <TabPanel value={value} index={4}>
        <CkycTab data={ckycdata} />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <Engagement data={userInfo} setrefetchWhatsapp={setrefetchWhatsapp} />
      </TabPanel>
      <TabPanel value={value} index={6}>
        <Stack direction="row" justifyContent="space-between">
          <div></div>
          <InputLabel sx={{ fontSize: '18px', fontWeight: '800' }}>----Coupon list ----</InputLabel>
          <Stack direction="row" gap={2}>
            <Button sx={bgColor} onClick={() => setshowCouponlist(true)}>
              {`Users Coupon list`}
            </Button>
            <Button sx={bgColor} onClick={() => setshowCouponlist(false)}>
              {'Create Coupon for User'}
            </Button>
          </Stack>
        </Stack>
        {showCouponlist && (
          <>
            <ActivityView
              data={couponlist.items}
              currentPage={couponlist.page}
              loading={loading}
              totalPage={couponlist.pageTotal}
              onPageChange={inituserCounponlist}
              columns={CouponList}
            />
          </>
        )}
        {!showCouponlist && <Offers email={userInfo._id} setrefetchcoupon={setrefetchcoupon}/>}
      </TabPanel>
    </>
  );
}
