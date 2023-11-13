import { Box } from '@mui/system';
import AdvisoryMasterLayout from './components/AdvisoryMasterLayout';

function AdvisoryMaster() {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <AdvisoryMasterLayout apiUrl="market" header="Market" dataKey="name" />
      <AdvisoryMasterLayout apiUrl="exchange" header="Exchange" dataKey="name" />
      <AdvisoryMasterLayout apiUrl="instrument" header="Instrument" dataKey="name" />
      <AdvisoryMasterLayout apiUrl="product-type" header="Product Type" dataKey="name" />
      <AdvisoryMasterLayout apiUrl="volatility" header="Volatility" dataKey="name" />
      <AdvisoryMasterLayout apiUrl="time-frame" header="Time Frame" dataKey="name" />
    </Box>
  );
}

export default AdvisoryMaster;
