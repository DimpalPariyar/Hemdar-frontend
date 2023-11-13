import { Stack } from '@mui/material';
import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ChatFrom from './ChatFrom';
import ChatCard from './ChatCard';
import axios from '../../utils/axios';
import { BASE_URL } from '../../config';
const fileHeader = {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
};
const ChatScreen = () => {
  const [productSelect, setproducSelect] = useState<any>([]);
  const [selectedMessage, setselectedMessage] = useState<any>([]);
  const [everyone, seteveryone] = useState(true);
  const [message, setmessage] = useState([]);
  const [refetch, setrefetch] = useState(false)
  const init = async () => {
    // const data = {
    //   limit: 100,
    //   skip: 0,
    //   productId: '63b3cabafacf539212d42b31'
    // };
    try {
      await axios.get(`${BASE_URL}/chat/allchat`).then((data) => {
        setmessage(data.data);
      });
    } catch (error) {}
  };
  const SubmitchatMessage = async (data: any, { resetForm }: any) => {
    try {
      const formData = new FormData();
      if (!data.subscription) {
        data = {
          messageTypeId: data.messageTypeId,
          messageType: data.messageType,
          title: data.title,
          description: data.description,
          imageUrl: data.imageUrl,
          subscription: false,
          productUrl: data.productUrl,
          videoUrl: data.videoUrl
        };
      }
      const payload = { ...data };
      if (data.imageUrl) {
        formData.append('image', data.imageUrl[0].file, `picture${Math.floor(Math.random() * 1000000)}-${Math.floor(Math.random() * 100)}`);
        const imageresponse = await axios.post(`${BASE_URL}/image`, formData, fileHeader);
        payload.imageUrl = imageresponse.data.url;
      }

      const response = await axios.post(`${BASE_URL}/chat/user-messages`, payload);
      if (response.data.success) {
        alert('Chat message Created Successfully');
        setproducSelect([]);
        setselectedMessage([]);
        seteveryone(false);
        setrefetch(!refetch)
    }
      resetForm({ data: '' });
    } catch (error) {
      alert(error);
      setproducSelect([]);
        setselectedMessage([]);
        seteveryone(false);
      console.log(error);
    }
  };
  useEffect(() => {
    init();
  }, [refetch]);
  return (
    <>
      <Stack direction="row" gap={4}>
        <Box width="55%" boxShadow={2} borderRadius={8}>
          <ChatFrom
            onSubmit={SubmitchatMessage}
            productSelect={productSelect}
            setproducSelect={setproducSelect}
            selectedMessage={selectedMessage}
            setselectedMessage={setselectedMessage}
            everyone={everyone}
            seteveryone={seteveryone}
          />
        </Box>
        <Box width="30%" sx={{ borderRadius: '20px', backgroundColor: '#F0F2F8' }}>
          <ChatCard message={message}/>
        </Box>
      </Stack>
    </>
  );
};

export default ChatScreen;
