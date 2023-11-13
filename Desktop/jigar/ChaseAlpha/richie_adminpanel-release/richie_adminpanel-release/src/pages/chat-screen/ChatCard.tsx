import React, { useEffect, useState } from 'react';
import Image from '../../assets/images/Group.jpg';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, Stack } from '@mui/system';
import { Link, Paper } from '@mui/material';
import moment from 'moment';
const ChatCard = ({ message }: any) => {
  return (
    <Box
      sx={{
        // backgroundImage: `url(${Image})`,
        backgroundSize: '150%',
        opacity: '0.9',
        width: '100%',
        height: '80vh',
        borderRadius: '20px',
        zIndex: '-100',
        overflow: 'auto'
      }}
    >
      {message &&
        message.map((message: any) => (
          <>
            {message?.imageUrl ? (
              <>
                <Paper key={message._id} sx={{ maxWidth: '250px', bgcolor: '#ffffff', ml: 3, mt: 1.5 }}>
                  <Stack key={message.name} direction="column" alignItems="center">
                    <img
                      src={message.imageUrl}
                      alt={message?.name}
                      width="230"
                      height="120"
                      style={{ paddingTop: '5px', borderRadius: '10px' }}
                    />
                  </Stack>
                  <Typography variant="h6" sx={{ color: '#000000', ml: 1, mt: 1 }}>
                    {message.title}
                  </Typography>
                  <Typography sx={{ fontSize: '10px', ml: 1 }}>{message.description}</Typography>
                  <Typography sx={{ fontSize: '10px', ml: 1, width: '200px', overflow: 'hidden' }}>
                    <Link>{message.productUrl}</Link>
                  </Typography>
                  <Typography sx={{ fontSize: '10px', ml: 1, color: '#FF686B' }}>#{message.messageType}</Typography>
                </Paper>
              </>
            ) : (
              <>
                {
                  <Paper key={message._id} sx={{ maxWidth: '300px', bgcolor: '#ffffff', ml: 3, mt: 1.5, borderRadius: '10px' }}>
                    <Typography variant="h6" sx={{ color: '#000000', ml: 1, pt: 1 }}>
                      {message?.title}
                    </Typography>
                    <Typography sx={{ fontSize: '10px', ml: 1 }}>{message?.description}</Typography>
                    <Typography sx={{ fontSize: '10px', ml: 1, width: '200px', overflow: 'hidden' }}>
                      <Link>{message?.productUrl}</Link>
                    </Typography>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '10px', ml: 1, color: '#F39A26' }}>#{message.messageType}</Typography>
                      <Typography sx={{ fontSize: '8px', mr: 1, color: '#000000' }}>{moment(message.createdAt).format('lll')}</Typography>
                    </Stack>
                  </Paper>
                }
              </>
            )}
          </>
        ))}
    </Box>
  );
};

export default ChatCard;
