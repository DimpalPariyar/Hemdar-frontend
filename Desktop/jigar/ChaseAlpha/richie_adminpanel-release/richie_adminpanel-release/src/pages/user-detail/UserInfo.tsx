import { Button, IconButton, InputLabel, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { CheckCircleFilled, CloseCircleOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import AddToUser from './AddToUser';
import { mangeApiDetails } from './constant';
import { BASE_URL } from 'config';
import axios from 'utils/axios';

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
const CommonKeyValue = ({ label, value = '-', valuePrefix, isVerified = false, isTextArea }: any) => {
  return (
    <Stack gap={2} flexDirection="row">
      <Stack minWidth={160} px={2} py={1} component={Typography} sx={{ fontWeight: '600' }}>
        {label}
      </Stack>
      <Stack flexDirection="row" gap={1}>
        {valuePrefix && (
          <Stack component={Typography} justifyContent="center" alignItems="center" sx={grayBgColor} px={2}>
            {valuePrefix}
          </Stack>
        )}
        <Stack
          flexDirection="row"
          alignItems="flex-start"
          justifyContent="space-between"
          component={Typography}
          pl={2}
          pt={1}
          minWidth={200}
          sx={grayBgColor}
          height={isTextArea ? 200 : 'auto'}
        >
          {value}
          {isVerified && (
            <Tooltip title="Verified">
              <IconButton sx={{ padding: 0 }} color="success">
                <CheckCircleFilled />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
const UserInfo = ({ info = {} }: any) => {
  const udpateCustomnotification = async () => {
    const userId = info?._id;
    const response = await axios.post(`${BASE_URL}/user/updatecustomarray`, { userId });
  };
  const syncsubscription = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/sync-subscriptions/${info?._id}`);
      alert(response.data.message);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Paper sx={{ width: 'max-content', paddingBottom: '20px' }} variant="outlined">
      <Stack flexDirection="row" p={2} justifyContent="flex-end" gap={2}>
        <AddToUser
          buttonName="Manage session"
          title="Manage session List"
          apiDetail={mangeApiDetails.session}
          sx={{ backgroundColor: 'red' }}
        />
        <AddToUser buttonName="Manage Advisory" title="Manage Advisory List" apiDetail={mangeApiDetails.advisory} />
      </Stack>
      <Stack p={3} my={2} justifyContent="space-between" flexDirection="row">
        <Stack flexDirection="column" gap={2}>
          <CommonKeyValue label="Name" value={info.name} isVerified={!!info.name} />
          <CommonKeyValue label="Email" value={info.email} isVerified={!!info.email} />
          <CommonKeyValue label="Aadhar No" value={info.aadharNo} />
          <CommonKeyValue label="Address" value={info.address} />
          <CommonKeyValue label="App Version" value={info?.appVersion} />
          <Stack direction="row" justifyContent="space-between" pl={2} gap={2}>
            <InputLabel minWidth={145} justifyContent="center" component={Typography} sx={{ fontWeight: '600' }}>
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
            <Button sx={bgColor} onClick={syncsubscription}>
              Sync Subscription
            </Button>
          </Stack>
        </Stack>
        <Stack flexDirection="column" gap={2}>
          <CommonKeyValue label="Date Of Birth" value={info.dob && format(new Date(info.dob), 'dd MMM yyyy')} isVerified={!!info.dob} />
          <CommonKeyValue label="Mobile Number" valuePrefix="+91" value={info.mobile} isVerified={!!info.mobile} />
          <CommonKeyValue label="Whatsapp Number" value={info.whatsappnumber} isVerified={!!info.whatsappnumber} />
          <CommonKeyValue label="PAN No" value={info.panNumber} isVerified={!!info.kycStatus?.value} />
          <CommonKeyValue label="Last Risk" value={info.score || 0} />
        </Stack>
      </Stack>
      <Stack direction="row" gap={2} pl={2} pr={2}>
        {info?.customNotification?.map((notification: any) => {
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
    </Paper>
  );
};

export default UserInfo;
