// material-ui
import { Button, CircularProgress, InputLabel, Stack } from '@mui/material';
import { useFormik } from 'formik';
import moment from 'moment';
// import SubscriptionPlanForm from './StrategyForm';
import { initialValues } from './constant';
import useMaster from 'hooks/useActivityMaster';
import { useState, useEffect, useRef } from 'react';
import useHostProfiles from 'hooks/useHostProfiles';
import AdviceNewUpdateForm from '../../components/advisory-form/AdviceNewUpdateForm';
import RemarkForm from './RemarkForm';
import NotificationForm from './NotificationForm';
import ActionForm from './ActionForm';
import AdviceDetailForm from './AdviceDetailForm';
import useNotificationBody from './hooks/useNotificationBody';
import TargetForm from './TargetForm';
import ExpiryForm from './ExpiryForm';
import ProductForm from './ProductForm';
import { openSnackbar, closeSnackbar } from 'store/reducers/snackbar';
import { useDispatch } from 'store';
import { socket } from 'services/socket';
import ConfirmAdvice from './ConfirmAdvice';
import PrefilledForm from './PrefilledForm';
// import ProductForm1 from './ProductForm copy';
const bgColor = {
  background: 'linear-gradient(103.4deg, #2D00D2 12.04%, #2C00D3 30.87%, #3700C8 46.11%, #3E00C0 63.54%, #4B00B4 80.82%, #5400AA 93.76%)',
  color: ' #FFFFFF',
  borderRadius: '10px'
};
interface Props {
  onSubmit: (data: any) => Promise<void>;
  defaultState?: any;
}
const AdviceForm = ({ defaultState, onSubmit }: Props) => {
  const dispatch = useDispatch();
  // const socketRef = useRef(socket);
  const cmpRef = useRef<HTMLSpanElement>(null!);
  const [isUpdateMode, setUpdateMode] = useState<Boolean>(false);
  const [instrumentList, setInstrumentList] = useState<any>([]);
  const { hostProfiles } = useHostProfiles();
  const [currentSymbol, setCurrentSymbol] = useState('');
  const [isPermited, setIsPermited] = useState(false);
  const [open, setOpen] = useState(false);
  const [preFilledDailog, setPreFilledDailog] = useState(false);
  useEffect(() => {
    socket.connect();
  }, []);

  const onShowCmp = () => [
    socket.emit('LTP', {
      subscribe: currentSymbol,
      unsubscribe: []
    })
  ];
  useEffect(() => {
    if (cmpRef) {
      socket.on('LTP', (socketData) => {
        cmpRef.current.textContent = socketData?.LTP;
      });
    }
  }, [cmpRef]);
  // useEffect(() => {
  //   socketRef.current.connect();
  // }, []);
  useEffect(() => {
    socket.on('connect_error', (err) => {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Could not connect to socket',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: true
        })
      );
      setTimeout(() => {
        closeSnackbar();
      }, 2000);
    });
  }, [dispatch]);

  // useEffect(() => {
  //   return () => {
  //     const socket = socketRef.current;
  //     socket.disconnect();
  //   };
  // }, []);

  const { data: symbol } = useMaster({ apiUrl: 'symbol' });

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit
  });

  useNotificationBody(formik);

  useEffect(() => {
    formik.setValues(defaultState || initialValues);
    setUpdateMode(!!defaultState);

    const editPermission = JSON.parse(localStorage.getItem('permission') || '-');

    if (!defaultState) {
      setIsPermited(true);
    }
    if (editPermission?.find((x: any) => x.label === 'Research') && defaultState) {
      setIsPermited(false);
    }
    if (editPermission?.find((x: any) => x.value === 4 && defaultState)) {
      setIsPermited(true);
    }
  }, [defaultState]);
  useEffect(() => {
    const { nameOfUnderlying, expiry, optionStrike, optionType, instrumentId } = formik.values;

    if (!nameOfUnderlying || !instrumentId) {
      setCurrentSymbol('');
      // socket.emit('LTP', {
      //   subscribe: [],
      //   unsubscribe: 'all'
      // });
      cmpRef.current.textContent = '';
    }
    if (instrumentId && nameOfUnderlying && instrumentList.length) {
      const selectedInstrument = instrumentList.find((instrument: any) => {
        return instrument._id === instrumentId;
      });

      if (selectedInstrument.name === 'EQ') {
        setCurrentSymbol(nameOfUnderlying);
      }

      if (selectedInstrument.hasExpiry && selectedInstrument.hasStrikePrice) {
        if (!expiry || !optionType || !optionStrike) {
          setCurrentSymbol('');
          // socket.emit('LTP', {
          //   subscribe: [],
          //   unsubscribe: 'all'
          // });
          cmpRef.current.textContent = '';
        }
      }

      if (selectedInstrument.hasExpiry && selectedInstrument.hasStrikePrice && expiry && optionType && optionStrike && nameOfUnderlying) {
        const date = moment(expiry, 'DD-MMM-YYYY').format('YYMMDD');

        setCurrentSymbol(`${nameOfUnderlying}${date}${optionStrike}${optionType}`);
      }
      if (selectedInstrument.hasExpiry && !selectedInstrument.hasStrikePrice) {
        if (!expiry || !nameOfUnderlying) {
          setCurrentSymbol('');
          // socket.emit('LTP', {
          //   subscribe: [],
          //   unsubscribe: 'all'
          // });
          cmpRef.current.textContent = '';
        }
      }

      if (selectedInstrument.hasExpiry && !selectedInstrument.hasStrikePrice && expiry && nameOfUnderlying) {
        const date = moment(expiry, 'DD-MMM-YYYY').format('YYMMM').toUpperCase();

        setCurrentSymbol(`${nameOfUnderlying}${date}FUT`);
      }
    }
  }, [formik.values, instrumentList, cmpRef]);

  // useEffect(() => {
  //   socket.on('LTP', (socketData: any) => {
  //     cmpRef.current.textContent = socketData.LTP;
  //   });
  // }, [cmpRef]);

  const onIstrumentLoad = (instruments: any) => {
    setInstrumentList(instruments);
  };

  // const onShowCmp = () => {
  //   // socketRef.current.emit('LTP', {
  //   //   subscribe: [currentSymbol],
  //   //   unsubscribe: []
  //   // });
  //   setCurrentSymbol('');
  // };
  const values: any = formik.values;

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClosePrefilled = () => {
    setPreFilledDailog(false);
  };

  return (
    <Stack direction="column" gap={1} marginY={2}>
      {!defaultState && (
        <Stack direction="row-reverse">
          <Button sx={{ ...bgColor, width: '150px' }} onClick={() => setPreFilledDailog(true)}>
            Show Type of Form
          </Button>
        </Stack>
      )}
      <Stack direction="row" gap={4}>
        {!defaultState && <PrefilledForm formik={formik} open={preFilledDailog} handleClose={handleClosePrefilled} />}
        <Stack direction="column">
          {/* <ProductForm1 formik={formik} values={values}  /> */}
          <ProductForm formik={formik} values={values} isPermited={isPermited} />
          <ExpiryForm formik={formik} values={values} isPermited={isPermited} />
          <ActionForm onShowCmp={onShowCmp} ref={cmpRef} formik={formik} values={values} isPermited={isPermited} />
        </Stack>
        <AdviceDetailForm
          onIstrumentLoad={onIstrumentLoad}
          formik={formik}
          values={values}
          symbol={symbol}
          hostProfiles={hostProfiles}
          isPermited={isPermited}
        />
      </Stack>
      <TargetForm formik={formik} values={values} isPermited={isPermited} />
      <RemarkForm formik={formik} values={values} isPermited={isPermited} />
      <NotificationForm formik={formik} values={values} isUpdateMode={isUpdateMode} />
      {isUpdateMode ? <AdviceNewUpdateForm formik={formik} /> : <></>}
      {/* <SubscriptionPlanForm formik={formik} /> */}
      <Stack display="flex" direction="row" justifyContent="flex-end" flexWrap="wrap" gap={2}>
        <Button sx={bgColor} onClick={handleClickOpen}>
          {isUpdateMode ? 'Update' : 'Flash'}
        </Button>
        <ConfirmAdvice formik={formik} handleClose={handleClose} open={open} />
      </Stack>
    </Stack>
  );
};
export default AdviceForm;
