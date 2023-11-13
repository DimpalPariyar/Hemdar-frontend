import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import axios from '../../utils/axios';
import { BASE_URL } from '../../config';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import AddIcon from '@mui/icons-material/Add';
import FastInputField from 'components/FastInputField';
import SendIcon from '@mui/icons-material/Send';
import { Button, Tooltip } from '@mui/material';
import { Stack } from '@mui/material';
const FastinputfieldStyle = {
  borderRadius: '8px',
  background: 'white',
  width: '33vh',
  height: '80px'
};
const bgColor = {
  background: 'linear-gradient(103.4deg, #2D00D2 12.04%, #2C00D3 30.87%, #3700C8 46.11%, #3E00C0 63.54%, #4B00B4 80.82%, #5400AA 93.76%)',
  color: ' #FFFFFF',
  borderRadius: '5px',
  fontSize: '9px',
  width: 'max-content',
  height: '20px'
};
const selectedbgColor = {
  background: '#ffffff',
  color: 'black',
  borderRadius: '5px',
  fontSize: '9px',
  width: 'max-content',
  height: '20px'
};
const AdviceChat = ({ advice }: any) => {
  const [message, setmessage] = useState([]);
  const [selectedMessage, setselectedMessage] = useState<any>([]);
  const [products, setProducts] = useState<any>([]);
  const [selectedProductValue, setselectedProductValue] = useState<any>([]);
  const [everyone, seteveryone] = useState(false);
  const [productSelect, setproducSelect] = useState<any>([]);
  const SendChatMessage = async (data: any, { resetForm }: any) => {
    data = {
      messageTypeId: data.messageTypeId,
      messageType: data.messageType,
      title: `${advice?.nameOfUnderlying}  ${advice.optionStrike ? advice.optionStrike : ''} ${advice.optionType ? advice.optionType : ''}`,
      description: data.description,
      imageUrl: data.imageUrl,
      subscription: true,
      productUrl: data.productUrl,
      videoUrl: data.videoUrl,
      productType: [advice?.product],
      adviceId: advice?._id,
      adviceType: advice.product,
      productId: [advice?.productId]
    };
    if (everyone) {
      data = {
        messageTypeId: '65014f94337000118fe8ec05',
        messageType: 'advice',
        title: advice?.product,
        description: data.description,
        imageUrl: data.imageUrl,
        subscription: false,
        productUrl: data.productUrl,
        videoUrl: data.videoUrl,
        // productType: productSelect,
        adviceType: advice.product
        // productId: selectedProductValue
      };
    }
    try {
      const response = await axios.post(`${BASE_URL}/chat/user-messages`, data);
      if (response.data.success) {
        alert('Chat message Created Successfully');
      }
      resetForm({ data: '' });
    } catch (error) {
      console.log(error);
    }
  };
  const formik = useFormik({
    initialValues: {
      messageTypeId: '64fec875ac4123d51d55388f',
      messageType: 'broadcast',
      title: '',
      description: '',
      imageUrl: '',
      productId: [advice?.productId],
      productType: [advice?.product],
      subscription: false,
      productUrl: '',
      videoUrl: '',
      adviceId: '',
      adviceType: ''
    },
    onSubmit: SendChatMessage
  });
  const values: any = formik.values;

  const init = async () => {
    try {
      await axios.get(`${BASE_URL}/chat/message-types`).then((data) => {
        const messageOption = data.data.data.map((item: any) => {
          return {
            value: item._id,
            label: item.name
          };
        });
        setmessage(() => {
          // const everyone = {
          //   value: '1',
          //   label: 'Everyone'
          // };
          // messageOption.push(everyone);
          return messageOption;
        });
      });
    } catch (error) {}
  };
  useEffect(() => {
    init();
    setselectedMessage(['broadcast']);
    getProducts();
  }, []);
  const selectMessage = ({ label, value }: any) => {
    if (selectedMessage.includes(label)) {
      setselectedMessage(() => {
        return selectedMessage.filter((value: any) => value !== label);
      });
      formik.setFieldValue('messageTypeId', '');
      formik.setFieldValue('messageType', '');
    } else {
      setselectedMessage((prev: any) => {
        return [label];
      });
      formik.setFieldValue('messageTypeId', value);
      formik.setFieldValue('messageType', label);
    }
  };
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 'Enter') {
      // Call your update function here
      formik.submitForm();
    }
  };
  const selectProduct = ({ label, value }: any) => {
    if (productSelect.includes(label)) {
      setproducSelect(() => {
        return productSelect.filter((value: any) => value !== label);
      });
      formik.setFieldValue('productType', '');
      formik.setFieldValue('productId', '');
    } else {
      setproducSelect((prev: any) => {
        return [...prev, label];
      });
      const data = { label, value };
      setselectedProductValue((prev: any) => [...prev, data]);

      formik.setFieldValue('subscription', true);
    }
  };
  const getProducts = async () => {
    try {
      await axios.get(`${BASE_URL}/advisory/product`).then((response: any) => {
        const products = response.data || [];
        setProducts(products);
      });
    } catch (error) {
      setProducts([]);
    }
  };
  useEffect(() => {
    formik.setFieldValue(
      'productType',
      selectedProductValue.map((label: any) => label.label)
    );
    formik.setFieldValue(
      'productId',
      selectedProductValue.map((value: any) => value.value)
    );
  }, [selectedProductValue]);
  const advisory = products.map((data: any) => ({ value: data._id, label: data.productTitle }));
  const allProductSelect = () => {
    if (everyone === true) {
      seteveryone(false);
      setproducSelect((prev: any) => {
        return [];
      });
      setselectedProductValue((prev: any) => {
        return [];
      });
    } else {
      seteveryone(true);
      setproducSelect((prev: any) => {
        return [...advisory.map((label: any) => label.label)];
      });
      setselectedProductValue((prev: any) => {
        return [...advisory.map((value: any) => value.value)];
      });
    }
  };
  useEffect(() => {
    // Add an event listener when the component mounts
    document.addEventListener('keydown', handleKeyPress);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []); //

  // useEffect(() => {
  //   formik.setFieldValue('description', values.description);
  // }, [values]);
  useEffect(() => {
    setproducSelect([advice?.product]);
    seteveryone(false);
  }, [advice]);
  return (
    <>
      <Stack key={advice?._id} direction="row" pl={2} pb={1} gap={0.5} maxWidth={500} flexWrap="wrap">
        {everyone ? (
          <Button onClick={() => allProductSelect()} sx={bgColor}>
            #Everyone
          </Button>
        ) : (
          <Button onClick={() => allProductSelect()} sx={selectedbgColor}>
            #Everyone
          </Button>
        )}
        {advisory &&
          advisory.map((label: any) => {
            return (
              <>
                {productSelect?.includes(label.label) ? (
                  <Button key={label.value} onClick={() => selectProduct(label)} sx={bgColor}>
                    #{label?.label}
                  </Button>
                ) : (
                  <Button key={label.value} onClick={() => selectProduct(label)} sx={selectedbgColor}>
                    #{label?.label}
                  </Button>
                )}
              </>
            );
          })}
      </Stack>
      <Stack direction="row" spacing={1} height={100} padding={1} justifyContent="space-between" alignContent="center">
        <Stack direction="column" justifyContent="center">
          <TagFacesIcon />
        </Stack>
        <Stack direction="column" justifyContent="center">
          <AddIcon />
        </Stack>
        <FastInputField
          style={FastinputfieldStyle}
          multiline
          rows={4}
          placeholder="Write your message here"
          name="description"
          value={values.description}
          onChange={formik.setFieldValue}
          autoFocus
        />
        <Stack direction="column" justifyContent="center">
          <Tooltip title="send message">
            <SendIcon onClick={() => formik.submitForm()} />
          </Tooltip>
        </Stack>
      </Stack>
      <Stack key={advice?.date} direction="row" pl={2} pb={1} gap={0.5} maxWidth={500} flexWrap="wrap">
        {message &&
          message.map((label: any) => {
            return (
              <>
                {selectedMessage?.includes(label.label) ? (
                  <Button key={label.value} onClick={() => selectMessage(label)} sx={bgColor}>
                    #{label.label}
                  </Button>
                ) : (
                  <Button key={label.name} onClick={() => selectMessage(label)} sx={selectedbgColor}>
                    #{label.label}
                  </Button>
                )}
              </>
            );
          })}
      </Stack>
    </>
  );
};

export default AdviceChat;
