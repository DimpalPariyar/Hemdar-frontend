import { Button, InputLabel, Stack } from '@mui/material';
import FastInputField from 'components/FastInputField';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { initialValues } from './constant';
import axios from '../../utils/axios';
import { BASE_URL } from '../../config';
import ImageUpload from './ImageUpload';
const bgColor = {
  background: 'linear-gradient(103.4deg, #2D00D2 12.04%, #2C00D3 30.87%, #3700C8 46.11%, #3E00C0 63.54%, #4B00B4 80.82%, #5400AA 93.76%)',
  color: ' #FFFFFF',
  borderRadius: '5px',
  fontSize: '11px',
  width: 'max-content',
  height: '20px'
};
const ButtonbgColor = {
  background: 'linear-gradient(103.4deg, #2D00D2 12.04%, #2C00D3 30.87%, #3700C8 46.11%, #3E00C0 63.54%, #4B00B4 80.82%, #5400AA 93.76%)',
  color: ' #FFFFFF',
  borderRadius: '10px',
  fontSize: '11px',
  width: 'max-content'
  //   height: '20px'
};
const FastinputfieldStyle = {
  bgcolor: '#ECEFFF',
  borderRadius: '10px',
  padding: '2px 5px',
  '&:hover': {
    border: '1px solid #2D00D2'
  },
  width: '50vh',
  height: '18vh'
};
const FastinputfieldStyles = {
  bgcolor: '#ECEFFF',
  borderRadius: '10px',
  padding: '8px 10px',
  '&:hover': {
    border: '1px solid #2D00D2'
  },
  width: '50vh',
  height: '37px'
};
const selectedbgColor = {
  background: '#ffffff',
  color: 'black',
  borderRadius: '5px',
  fontSize: '11px',
  width: 'max-content',
  height: '20px'
};
const ChatFrom = ({
  defaultState,
  onSubmit,
  productSelect,
  setproducSelect,
  selectedMessage,
  setselectedMessage,
  everyone,
  seteveryone
}: any) => {
  const [products, setProducts] = useState<any>([]);
  const [message, setmessage] = useState([]);
  const [selectedProductValue, setselectedProductValue] = useState<any>([]);
  const formik = useFormik({
    initialValues: defaultState || initialValues,
    onSubmit
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
        setmessage(messageOption);
        setselectedMessage(messageOption[0].label);
      });
    } catch (error) {}
  };
  useEffect(() => {
    init();
    getProducts();
  }, []);
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
  useEffect(() => {
    formik.setFieldValue('subscription', false);
    formik.setFieldValue('productType', '');
    formik.setFieldValue('productId', '');
    seteveryone(everyone);
  }, [everyone]);
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
  return (
    <>
      <Stack direction="row" spacing={1} sx={{ paddingTop: '50px', paddingLeft: '100px', paddingBottom: '30px' }}>
        <InputLabel sx={{ mt: 1, fontSize: '13px', marginRight: '45px' }}>Audience :</InputLabel>
        <Stack direction="row" width={500} gap={0.5} flexWrap="wrap">
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
      </Stack>
      <Stack direction="row" sx={{ paddingLeft: '100px', paddingBottom: '20px', position: 'relative' }}>
        <InputLabel sx={{ mt: 1, fontSize: '13px', marginRight: '40px' }}>Description :</InputLabel>
        <FastInputField
          style={FastinputfieldStyle}
          multiline
          rows={5}
          placeholder="Write your message here"
          name="description"
          value={values?.description}
          onChange={formik.setFieldValue}
        />
        <Stack direction="row" maxWidth={400} sx={{ position: 'absolute', bottom: '30px', left: '250px' }} gap={1} flexWrap="wrap">
          {message &&
            message.map((label: any) => {
              return (
                <>
                  {selectedMessage?.includes(label.label) ? (
                    <Button key={label.value} onClick={() => selectMessage(label)} sx={bgColor}>
                      #{label.label}
                    </Button>
                  ) : (
                    <Button key={label.value} onClick={() => selectMessage(label)} sx={selectedbgColor}>
                      #{label.label}
                    </Button>
                  )}
                </>
              );
            })}
        </Stack>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ paddingLeft: '100px', paddingBottom: '20px' }}>
        <InputLabel sx={{ mt: 1, marginRight: '75px', fontSize: '13px' }}>Title :</InputLabel>
        <FastInputField style={FastinputfieldStyles} name="title" type="text" value={values?.title} onChange={formik.setFieldValue}/>
      </Stack>
      {/* <Stack direction="row" spacing={1} sx={{ paddingLeft: '100px', paddingBottom: '20px' }}>
        <InputLabel sx={{ mt: 1, marginRight: '40px', fontSize: '13px' }}>
          {' '}
          Image/ <br></br>Video URL :
        </InputLabel>
        <FastInputField
          style={FastinputfieldStyles}
          name="imageUrl"
          type="text"
          placeholder="paste Url"
          value={values?.imageUrl}
          onChange={formik.setFieldValue}
        />
      </Stack> */}
      <Stack direction="row" spacing={1} sx={{ paddingLeft: '100px', paddingBottom: '20px' }}>
        <InputLabel sx={{ mt: 1, marginRight: '70px', fontSize: '13px' }}> Vedio :</InputLabel>
        <ImageUpload name="videoUrl" formik={formik} />
      </Stack>
      <Stack direction="row" spacing={1} sx={{ paddingLeft: '100px', paddingBottom: '10px' }}>
        <InputLabel sx={{ mt: 1, marginRight: '70px', fontSize: '13px' }}> Image:</InputLabel>
        {/* <FastInputField
          style={FastinputfieldStyless}
          name="notificationBody"
          type="text"
          placeholder="Click or Drag & Drop your file here"
          // value={values?.['notificationBody']}
          // onChange={formik.setFieldValue}
          // shouldDisable={isUpdateMode}
        /> */}
        <ImageUpload name="imageUrl" formik={formik} />
      </Stack>
      <Stack direction="row" spacing={1} sx={{ paddingLeft: '100px', paddingBottom: '20px' }}>
        <InputLabel sx={{ mt: 1, marginRight: '25px', fontSize: '13px' }}> External URL :</InputLabel>
        <FastInputField
          style={FastinputfieldStyles}
          name="productUrl"
          type="text"
          placeholder="paste Url"
          value={values?.productUrl}
          onChange={formik.setFieldValue}
        />
      </Stack>
      <Stack direction="row" justifyContent="center" gap={2} pb={10}>
        <Button
          sx={ButtonbgColor}
          onClick={() => {
            return formik.submitForm();
          }}
        >
          New Message{' '}
        </Button>
        <Button sx={ButtonbgColor}>Update</Button>
      </Stack>
    </>
  );
};

export default ChatFrom;
