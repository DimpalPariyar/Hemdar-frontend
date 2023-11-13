import { Box, Button, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/material';
import React, { useState } from 'react';
import { BASE_URL } from 'config';
import axios from 'utils/axios';
import Loader from 'components/Loader';

const FastinputfieldStyle = {
  bgcolor: '#ECEFFF',
  borderRadius: '10px',
  padding: '8px 10px',
  width: '334px',
  '&:hover': {
    border: '1px solid #2D00D2'
  }
};

const bgColor = {
  background: 'linear-gradient(103.4deg, #2D00D2 12.04%, #2C00D3 30.87%, #3700C8 46.11%, #3E00C0 63.54%, #4B00B4 80.82%, #5400AA 93.76%)',
  color: ' #FFFFFF',
  borderRadius: '10px',
  width: '250px',
  height: '50px'
};

const Process = () => {
  const [loading, setLoading] = useState(false);
  const updatebhavcopy = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/jobs/fetch-new-bhavcopy`);
      console.log(response.data);
      alert(`request sent successfully and here is the response ${response.data}`);
    } catch (e) {
      console.log(e);
    }
  };
  const createInvoice = async () => {
    setLoading(true);
    const response = await axios.get(`${BASE_URL}/payments/invoiceforall`);
    const data = await response.data;
    if (data) {
      setLoading(false);
    }
    alert(data.message);
  };
  const updategstNo = async () => {
    const response = await axios.get(`${BASE_URL}/admin/updategstno`);
  };
  const updateriskScores = async () => {
    const response = await axios.get(`${BASE_URL}/riskprofile/risktestUsermap`);
  };
  const sendcybersecurityemail = async () => {
    const response = await axios.get(`${BASE_URL}/admin/cybersecurityupdates`);
    alert('email send successfully');
  };
  return (
    <div>
      {loading && <Loader />}
      <Stack direction="column" sx={{ alignItems: 'center' }} spacing={2}>
        <Button sx={bgColor} onClick={updatebhavcopy}>
          Update Bhav Copy
        </Button>
        <Button sx={bgColor} onClick={createInvoice}>
          Create Invoice{' '}
        </Button>
        <Button sx={bgColor} onClick={updategstNo}>
          Update GST NO To Orders{' '}
        </Button>
        <Button sx={bgColor} onClick={updateriskScores}>
          Update Users Risk Scores{' '}
        </Button>
        <Button sx={bgColor} onClick={sendcybersecurityemail}>
          Send Cyber Security Email{' '}
        </Button>
      </Stack>
    </div>
  );
};

export default Process;
