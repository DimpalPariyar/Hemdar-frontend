import { IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Button, Stack } from '@mui/material';
import React, { useEffect, useState ,useRef} from 'react';
import Draggable from 'react-draggable';
import CloseIcon from '@mui/icons-material/Close';
import Switch from '@mui/material/Switch';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import useNotificationBody from 'pages/advice-create/hooks/useNotificationBody';
import ImageUpload from 'pages/advice-create/ImageUpload';
import Autocomplete from 'components/AutoComplete';
import axios from 'utils/axios';
import { BASE_URL } from 'config';
import SelectField from 'components/SelectField';

const DrgbleAdviceForm = ({ formik, values, setopenadviceCard ,stockaction,setstockaction}: any) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [notification, setNotification] = useState([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const init = async () => {
    try {
      await axios.get(`${BASE_URL}/notification/getall/types`).then((data) => {
        const notificationOption = data.data.map((item: any) => {
          return {
            value: item._id,
            label: item.typeofNotification
          };
        });
        setNotification(notificationOption);
      });
    } catch (error) {}
  };
  useEffect(() => {
    init();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  const handleRowClick = () => {
    setShowOverlay(true);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };
  useNotificationBody(formik);
  const handleNotificationSelect = (e: any, data: any) => {
    formik.setValues({
      ...values,
      typeOfNotification: data.value
    });
  };
  const selectAction = async (e:any) => {
    setstockaction(!stockaction);
    const stockactions = e.target.checked ? 'buy' : 'sell';
    formik.setValues({
      ...values,
      action: stockactions
    });
  };
  console.log(values)
  return (
    <div>
      <Draggable defaultPosition={{ x: 100, y: -600 }} handle=".draggable-handle">
        <div className="draggable-handle">
          <div
            style={{ backgroundColor: 'white', maxWidth: '500px', border: '1px lightgrey solid', borderRadius: '10px' }}
            className={`overlay ${showOverlay ? 'show' : ''}`}
          >
            <div className="overlay-content">
              <Stack height={70} sx={{ backgroundColor: '#f5f4f4', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
                <Stack direction="row" justifyContent="space-between">
                  <InputLabel sx={{ p: 1, fontWeight: '600', fontSize: '15px', color: '#747373' }}>
                    {`${values.nameOfUnderlying} ${values.expiry} ${values.optionStrike} ${values.optionType === 'CE' ? 'CALL' : 'PUT'}`}{' '}
                  </InputLabel>
                  <IconButton onClick={() => setopenadviceCard(false)}>
                    <CloseIcon />
                  </IconButton>
                </Stack>
                <Stack direction="row" sx={{ pr: 1 }} justifyContent="space-between">
                  <InputLabel sx={{ pl: 1, fontWeight: '600', fontSize: '18px' }}>{`${values.ltp}`} </InputLabel>
                  <Stack direction="row" gap={0.5} justifyContent="center">
                    {stockaction && (
                      <Stack direction="column" justifyContent="center">
                        <InputLabel>Buy</InputLabel>
                      </Stack>
                    )}
                    <Switch checked={stockaction} onChange={(e: any) => selectAction(e)} color="success" size="small" />
                    {!stockaction && (
                      <Stack direction="column" justifyContent="center">
                        <InputLabel>Sell</InputLabel>
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              </Stack>
              <Stack minHeight={170} bgcolor="#ffffff">
                <Stack direction="row" gap={1} justifyContent="space-between" pt={1.9} pl={1} pr={1}>
                  <TextField
                    sx={{ width: '120px' }}
                    onChange={formik.handleChange}
                    value={`${values.entryLowerRange}-${values.entryUpperRange}`}
                    label="Entry Range"
                    id="outlined-size-small"
                    size="small"
                  />
                  <TextField
                    sx={{ width: '70px' }}
                    name="stopLoss"
                    value={values.stopLoss}
                    onChange={formik.handleChange}
                    label="SL"
                    id="outlined-size-small"
                    size="small"
                  />
                  <TextField
                    sx={{ width: '70px' }}
                    name="target1"
                    value={values.target1}
                    onChange={formik.handleChange}
                    label="T1"
                    id="outlined-size-small"
                    size="small"
                  />
                  <TextField
                    sx={{ width: '70px' }}
                    name="target2"
                    value={values.target2}
                    onChange={formik.handleChange}
                    label="T2"
                    id="outlined-size-small"
                    size="small"
                  />
                </Stack>
                <Stack direction="row" gap={1} justifyContent="space-between" pt={1.9} pl={1} pr={1}>
                  <TextField
                    sx={{ width: '120px' }}
                    name="holdingPeriod"
                    value={values.holdingPeriod}
                    onChange={formik.handleChange}
                    label="Holding Period"
                    id="outlined-size-small"
                    size="small"
                  />
                  <TextField
                    sx={{ width: '70px' }}
                    name="status"
                    value={values.status}
                    onChange={formik.handleChange}
                    label="status"
                    id="outlined-size-small"
                    size="small"
                  />
                  <TextField
                    sx={{ width: '70px' }}
                    name="analyst"
                    value={values.analyst}
                    onChange={formik.handleChange}
                    label="Analyst"
                    id="outlined-size-small"
                    size="small"
                  />
                  <TextField
                    sx={{ width: '70px' }}
                    name="target3"
                    value={values.target3}
                    onChange={formik.handleChange}
                    label="T3"
                    id="outlined-size-small"
                    size="small"
                  />
                </Stack>
                <Stack direction="row" gap={1} justifyContent="space-between" pt={1.9} pl={1} pr={1}>
                  <TextField
                    inputRef={inputRef}
                    sx={{ width: '30%' }}
                    multiline
                    rows={2}
                    name="remarks"
                    value={values.remarks}
                    onChange={formik.handleChange}
                    label="Internal Remark"
                    id="outlined-size-small"
                    defaultValue="Small"
                    size="small"
                  />
                  <ImageUpload name="internalChart" formik={formik} />
                </Stack>
              </Stack>
              <Stack height={115} sx={{ backgroundColor: '#f5f4f4', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}>
                <Stack direction="row" gap={1} pl={1} pr={1} pt={2}>
                  <TextField
                    sx={{ width: '30%' }}
                    name="notificationTitle"
                    value={values.notificationTitle}
                    onChange={formik.handleChange}
                    label="Notification Title"
                    id="outlined-size-small"
                    defaultValue="Small"
                    size="small"
                  />
                  <TextField
                    sx={{ width: '70%' }}
                    name="notificationBody"
                    value={values.notificationBody}
                    onChange={formik.handleChange}
                    label="Notification Body"
                    id="outlined-size-small"
                    defaultValue="Small"
                    size="small"
                  />
                </Stack>
                <Stack direction="row" gap={1} pl={1} pr={1} pt={2} justifyContent="space-between">
                  <Select
                    value={values?.['typeOfNotification']}
                    onChange={handleNotificationSelect}
                    name="typeOfNotification"
                    sx={{ width: 150 }}
                  >
                    {notification.map((option: any) => (
                      <MenuItem value={option.value} key={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <Stack direction="column" justifyContent="center">
                    <Button
                      sx={{
                        width: '150px',
                        height: '30px',
                        bgcolor: stockaction ? '#4ba301' : '#f27878',
                        '&:hover': { background: stockaction ? '#4ba301' : '#f27878' }
                      }}
                      variant="contained"
                      onClick={() => {
                        return formik.submitForm();
                      }}
                    >
                      <FlashOnIcon />
                      Flash Trade
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default DrgbleAdviceForm;
