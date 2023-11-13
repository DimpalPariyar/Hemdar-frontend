// import { useMemo } from 'react';

// material-ui
import { Theme } from '@mui/material/styles';
import { Box, useMediaQuery } from '@mui/material';

// project import
// import useConfig from 'hooks/useConfig';
import Search from './Search';
import Message from './Message';
import Profile from './Profile';
import Notification from './Notification';
import Customization from './Customization';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {

  const matchesXs = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  return (
    <>
      {!matchesXs && <Search />}
      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}

      <Notification />
      <Message />
      <Customization />
      {!matchesXs && <Profile />}
    </>
  );
};

export default HeaderContent;
