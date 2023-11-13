import { Box, Button, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/material';
import React, { useState } from 'react';
import { BASE_URL } from 'config';
import axios from 'utils/axios';
import SearchUser from './SearchUser';

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
  width: '150px',
  height: '40px'
};

const UserActions = () => {
  const [user, setUser] = useState('');
  const [email, setEmail] = useState<string>('');
  const [mobile, setMobile] = useState<Number | null>();
  const [isSearchUser, setIsSearchUser] = useState<boolean>(false);

  const handlelogout = async () => {
    let data = {
      contact: user
    };
    try {
      await axios.delete(`${BASE_URL}/admin/userLogout`, { data });
      setUser('');
      alert('User logout successfull');
    } catch (e: any) {
      console.log(e.message);
      alert(e?.response.data.message || 'Something went wrong');
    }
  };

  const createUser = async () => {
    let data = {
      email,
      mobile
    };
    try {
      await axios.post(`${BASE_URL}/admin/user`, data);
      setEmail('');
      setMobile(null);
      alert('User Created successfully');
    } catch (e: any) {
      console.log(e.message);
      alert(e?.response.data.message || 'Something went wrong');
    }
  };

  return (
    <div>
      {!isSearchUser && (
        <>
          <Typography variant="h5" sx={{ m: 1 }}>
            Logout User
          </Typography>
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <TextField placeholder="email or mobile" style={FastinputfieldStyle} value={user} onChange={(e) => setUser(e.target.value)} />
            <Button sx={bgColor} onClick={handlelogout}>
              Logout
            </Button>
          </Stack>
          <Box>
            <Typography variant="h5" sx={{ m: 1 }}>
              Create User
            </Typography>
            <Stack direction="row" sx={{ alignItems: 'center' }}>
              <TextField placeholder="email" style={FastinputfieldStyle} value={email} onChange={(e) => setEmail(e.target.value)} />
              <TextField
                placeholder="Mobile number"
                style={FastinputfieldStyle}
                value={mobile}
                onChange={(e) => setMobile(+e.target.value)}
              />
              <Button sx={bgColor} onClick={createUser}>
                Create User
              </Button>
            </Stack>
          </Box>
        </>
      )}
      <SearchUser setIsSearchUser={setIsSearchUser} />
    </div>
  );
};

export default UserActions;
