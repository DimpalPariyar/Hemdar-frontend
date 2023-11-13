import React, { useEffect, useState } from 'react';
import axios from 'utils/axios';
import { BASE_URL } from 'config';
import BasicTable from 'components/react-table/BasicTable';
import { columns, initialValues } from './constant';
import { useFormik } from 'formik';
import Product from './Product';
import { Box } from '@mui/material';
import OptionTable from './OptionTable';
import DrgbleAdviceForm from './DrgbleAdviceForm';
import moment from 'moment';
import { openSnackbar } from 'store/reducers/snackbar';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const fileHeader = {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
};

const OptionAdviceCreate = () => {
  const [data, setData] = useState<string[][]>([]);
  const [interval, setinterval] = useState<any>(5);
  const [stockaction, setstockaction] = useState(true)
  const [openadviceCard, setopenadviceCard] = useState(false )
  const history = useNavigate();
  const [me, setMe] = useState('');
  const dispatch = useDispatch();
  const createAdvice = async (data: any) => {
    try {
      const formData = new FormData();
      const payload = { ...data };

      // payload.advisoryId = [payload.advisoryId, ...comboadvisory.filter((x: any) => x.relatedProducts.includes(payload.advisoryId)).map((x: any) => x.value)]
      payload.strategy[0].action = payload.action;
      payload.strategy[0].name = payload.nameOfUnderlying;
      payload.strategy[0].ltp = payload.cmp;
      payload.strategy[0].expiry = payload.expiry;
      payload.strategy[0].strike = payload.optionStrike;
      payload.strategy[0].optionType = payload.optionType;
      delete payload.action;
      delete payload.cmp;
      delete payload.expiry;
      delete payload.optionStrike;
      delete payload.optionType;

      delete payload.nameOfUnderlyingDataId;
      delete payload.expiryDataId;
      delete payload.optionStrikeDataId;
      delete payload.optionTypeDataId;

      if (data.attachment) {
        formData.append('image', data.attachment[0].file);
        const attachmentResponse = await axios.post(`${BASE_URL}/image`, formData, fileHeader);
        formData.delete('image');
        payload.attachment = attachmentResponse.data.url;
      }

      if (data.internalChart) {
        formData.append(
          'image',
          data.internalChart[0].file,
          `picture${Math.floor(Math.random() * 1000000)}-${Math.floor(Math.random() * 100)}`
        );
        const chartResponse = await axios.post(`${BASE_URL}/image`, formData, fileHeader);
        payload.internalChart = chartResponse.data.url;
      }

      await axios.post(`${BASE_URL}/advisory/advice`, payload);
      history('/advice');
    } catch (error) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Unable to create the advice',
          variant: 'alert',
          alert: {
            color: 'error'
          }
        })
      );
    }
  };
  const formik = useFormik({
    initialValues,
    onSubmit: createAdvice
  });
  const values: any = formik.values;
  const { nameOfUnderlying, expiry } = values;
  const init = async (nameOfUnderlying: any, expiry: any) => {
    try {
      const params: any = {
        nameOfUnderlying,
        expiry,
        interval
      };
      if (nameOfUnderlying && expiry) {
        const response = await axios.get(`${BASE_URL}/advisory/optionchain?${new URLSearchParams(params).toString()}`);
        setData(response?.data?.item);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const SelectAdvice = async(action: any, optionType: any, formdata: any) => {
    setopenadviceCard(true);
    setstockaction(action === 'buy' ? true : false);
    console.log(action, optionType, formdata);
    try {
      const date = moment(values?.expiry, 'DD-MMM-YYYY').format('YYMMDD');
      const Symbol = `${values?.nameOfUnderlying}${date}${formdata.values.strike}${optionType}`;
      axios
        .get(`${BASE_URL}/advisory/stocksymbol/${Symbol}`)
        .then((data: any) => {
          formik.setValues({
            ...values,
            action,
            optionType,
            optionStrike: formdata.values.strike,
            ltp: data.data.stockrate.ltp,
            entryLowerRange: Math.round(data.data.stockrate.ltp + (-2 / 100) * data.data.stockrate.ltp),
            entryUpperRange: Math.round(data.data.stockrate.ltp + (2 / 100) * data.data.stockrate.ltp),
            stopLoss: Math.round(data.data.stockrate.ltp + (-10 / 100) * data.data.stockrate.ltp),
            target1: Math.round(data.data.stockrate.ltp + (10 / 100) * data.data.stockrate.ltp),
            target2: Math.round(data.data.stockrate.ltp + (20 / 100) * data.data.stockrate.ltp),
            target3: Math.round(data.data.stockrate.ltp + (30 / 100) * data.data.stockrate.ltp),
            typeOfNotification: '64b523202eb7a20fb455cc89',
            holdingPeriod: (values.timeFrameId = '63b29958b6079ecb3c76e74c'
              ? '2-5 days'
              : (values.timeFrameId = '63b29953b6079ecb3c76e748' ? '2-4 weeks' : '1 day'))
          });
        })
        .catch((error) => alert(error));
    } catch (error) {
      
    }
    

  };
  useEffect(() => {
    init(nameOfUnderlying, expiry);
    setMe(JSON.parse(localStorage.getItem('me') || '-'));
    formik.setValues({
      ...values,
      analyst: me
    });
  }, [nameOfUnderlying, expiry, interval]);
  return (
    <div>
      <Product formik={formik} values={values} interval={interval} setinterval={setinterval} />
      <Box mt={3}>{data.length > 0 && <OptionTable columns={columns} data={data} SelectAdvice={SelectAdvice} />}</Box>
      {openadviceCard && (
        <DrgbleAdviceForm
          formik={formik}
          values={values}
          setopenadviceCard={setopenadviceCard}
          stockaction={stockaction}
          setstockaction={setstockaction}
        />
      )}
    </div>
  );
};

export default OptionAdviceCreate;
