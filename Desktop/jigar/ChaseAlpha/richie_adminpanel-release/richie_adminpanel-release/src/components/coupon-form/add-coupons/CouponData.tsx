import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Stack } from '@mui/material';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import GeneralTab from './GeneralTab';
import UsageRestrictionTab from './UsageRestrictionTab';
import UsageLimitTab from './UsageLimitTab';

const BgTabColor = '#ECEFFF';
const Tabcolor = {
  maxWidth: '500px',
  flex: 1,
  fontWeight: 600,
  bgcolor: '#F6F7FF',
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

function a11yProps(index: number) {
  return {
    id: `activity-tab-${index}`,
    'aria-controls': `activity-tabpanel-${index}`
  };
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Stack sx={{ p: 3 }}>{children}</Stack>}
    </div>
  );
}

const CouponData = ({ formik }: any) => {
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Accordion
        sx={{ border: 'none', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)', borderTopRightRadius: '15px', borderTopLeftRadius: '15px' }}
        defaultExpanded={true}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{ flexDirection: 'row', background: '#ECEFFF', borderTopRightRadius: '15px', borderTopLeftRadius: '15px', border: 'none' }}
        >
          <Typography variant="h4">Coupon Data</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack sx={{ width: '100%' }}>
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
              <Tab sx={Tabcolor} icon={<HourglassFullIcon />} iconPosition="start" label="General" {...a11yProps(0)} />
              <Tab sx={Tabcolor} icon={<NotInterestedIcon />} iconPosition="start" label="Usage Restriction" {...a11yProps(1)} />
              <Tab sx={Tabcolor} icon={<CompareArrowsIcon />} iconPosition="start" label="Usage Limit" {...a11yProps(2)} />
            </Tabs>
            <TabPanel value={value} index={0}>
              <GeneralTab formik={formik} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <UsageRestrictionTab formik={formik} />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <UsageLimitTab formik={formik} />
            </TabPanel>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default CouponData;
