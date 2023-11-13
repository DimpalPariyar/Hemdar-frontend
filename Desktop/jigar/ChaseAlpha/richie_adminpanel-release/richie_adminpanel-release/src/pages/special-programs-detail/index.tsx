import { Paper, Stack, Tabs, Tab, Typography } from '@mui/material';
import { BASE_URL } from 'config';
import axios from 'utils/axios';
import { useParams } from 'react-router';
import { TabPanel } from 'pages/user-detail/ActivityTab';
import { useEffect, useState } from 'react';
import ProgramDetail from './ProgramDetail';
import Loader from 'components/Loader';
import ParticipantList from './ParticipantList';
import BroadcastList from './BroadcastList';
import QuestionAnswerList from './QuestionAnswerList';

function a11yProps(index: number) {
  return {
    id: `activity-tab-${index}`,
    'aria-controls': `activity-tabpanel-${index}`
  };
}

function SpecialProgramsDetail() {
  const [tabValue, setTabValue] = useState(0);
  const { id = '' } = useParams<{ id: string }>();
  const [session, setSession] = useState();

  const getSession = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/learning/session/${id}`);
      setSession(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSession();
  }, []);

  if (!session) {
    return <Loader />;
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  return (
    <>
      <Typography variant="h3" py={3} pt={2} mb={1} fontWeight="600">
        Live Programs
      </Typography>
      <Stack component={Paper} variant="outlined">
        <Stack sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            TabIndicatorProps={{
              sx: {
                top: 0
              }
            }}
            value={tabValue}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab sx={{ flex: 1 }} label="Details" {...a11yProps(0)} />
            <Tab sx={{ flex: 1 }} label="Participants" {...a11yProps(1)} />
            <Tab sx={{ flex: 1 }} label="Broadcast" {...a11yProps(2)} />
            <Tab sx={{ flex: 1 }} label="Q&A" {...a11yProps(3)} />
          </Tabs>
        </Stack>
        <TabPanel value={tabValue} index={0}>
          <ProgramDetail session={session} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <ParticipantList />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <BroadcastList />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <QuestionAnswerList />
        </TabPanel>
      </Stack>
    </>
  );
}

export default SpecialProgramsDetail;
