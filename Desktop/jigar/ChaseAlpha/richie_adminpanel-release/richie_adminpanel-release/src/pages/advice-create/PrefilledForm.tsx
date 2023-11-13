import { useEffect, useMemo, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { BASE_URL } from 'config';
import axios from 'utils/axios';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import AddIcon from '@mui/icons-material/Add';
import Avatar from '@mui/material/Avatar';
import ModeIcon from '@mui/icons-material/Mode';
import DeleteIcon from '@mui/icons-material/Delete';
import { Stack } from '@mui/material';
import AddPrefilledform from './AddPrefilledform';
import moment from 'moment';
import { useOnkeyPress } from './hooks/useOnkeyPress';
export interface PrefilledProps {
  open: boolean;
  handleClose: () => void;
  formik: any;
  // setCurrentSymbol?:any
}
interface defaultFromdataProps {
  _id?: string;
  formName?: string;
  action: string;
  productId: string;
  TypeOfNotification: string;
  lowRate: number;
  highRate: number;
  StopLoss: number;
  target1: number;
  target2: number;
  target3: number;
  HoldingPeriod: string;
  createdAt: string;
  updateAt: string;
  _v?: number;
}
export interface formdata {
  productId: string;
  marketId: string;
  exchangeId: string;
  productTypeId: string;
  timeFrameId: string;
  volatilityId: string;
  hostProfileId: string;
  instrumentId: string;
  notificationTitle: string;
  nameOfUnderlying: string;
  nameOfUnderlyingDataId: string;
  expiry: string;
  expiryDataId: string;
  optionStrike: string;
  optionStrikeDataId: string;
  optionType: string;
  optionTypeDataId: string;
  preform: {
    action: string;
    productId: string;
    TypeOfNotification: string;
    lowRate: number;
    highRate: number;
    StopLoss: number;
    target1: number;
    target2: number;
    target3: number;
    HoldingPeriod: string;
  };
}
const PrefilledForm = (props: PrefilledProps) => {
  const { open, handleClose, formik } = props;
  const [prefilledData, setprefilledData] = useState([]);
  const [addform, setAddform] = useState(false);
  const [updatefrom, setupdatefrom] = useState(false);
  const [formdata, setformdata] = useState<formdata>();
  const [successDelete, setsuccessDelete] = useState(false);
  const [updateValue, setupdateValues] = useState<defaultFromdataProps>();
  const [currentSymbol, setCurrentSymbol] = useState('');
  const [datalive, setDatalive] = useState(0);
  const [liveOptionStrike, setLiveOptionStrike] = useState(0);
  const values = formik.values;
  const initial = async () => {
    const response = await axios.get(`${BASE_URL}/advisory/prefilled-form`);
    if (response) {
      setprefilledData(response.data);
    }
  };
  useEffect(() => {
    initial();
  }, [addform, successDelete]);
  const addformhandle = () => {
    setAddform(true);
  };
  const closeAddform = () => {
    setAddform(false);
  };
  const closeUpdateform = () => {
    setupdatefrom(false);
  };
  const handleForm = async (id: String) => {
    await axios
      .get(`${BASE_URL}/advisory/form/${id}`)
      .then((data) => {
        setformdata(data.data.data);
        setLiveOptionStrike(data.data.data.optionStrike);
      })
      .catch((error) => alert(error));
    handleClose();
  };
  const getSymbolData = async () => {
    const date = moment(formdata?.expiry, 'DD-MMM-YYYY').format('YYMMDD');
    const Symbol = `${formdata?.nameOfUnderlying}${date}${liveOptionStrike}${formdata?.optionType}`;
    axios
      .get(`${BASE_URL}/advisory/stocksymbol/${Symbol}`)
      .then((data: any) => {
        console.log(data);
        setDatalive(data.data.LTP);
      })
      .catch((error) => alert(error));
  };
  useEffect(() => {
    if (liveOptionStrike) {
      getSymbolData();
    }
  }, [liveOptionStrike]);

  useEffect(() => {
    if (datalive) {
      formik.setValues({
        ...values,
        advisoryId: formdata?.productId,
        marketId: formdata?.marketId,
        exchangeId: formdata?.exchangeId,
        productTypeId: formdata?.productTypeId,
        timeFrameId: formdata?.timeFrameId,
        volatilityId: formdata?.volatilityId,
        hostProfileId: formdata?.hostProfileId,
        instrumentId: formdata?.instrumentId,
        notificationTitle: formdata?.notificationTitle,
        nameOfUnderlying: formdata?.nameOfUnderlying,
        nameOfUnderlyingDataId: formdata?.nameOfUnderlyingDataId,
        expiry: formdata?.expiry,
        expiryDataId: formdata?.expiryDataId,
        optionStrike: liveOptionStrike,
        optionStrikeDataId: formdata?.optionStrikeDataId,
        optionType: formdata?.optionType,
        optionTypeDataId: formdata?.optionTypeDataId,
        action: formdata?.preform?.action,
        typeOfNotification: formdata?.preform?.TypeOfNotification,
        entryLowerRange: formdata?.preform?.lowRate && Math.round(datalive + (formdata?.preform?.lowRate / 100) * datalive),
        entryUpperRange: formdata?.preform?.highRate && Math.round(datalive + (formdata?.preform?.highRate / 100) * datalive),
        stopLoss: formdata?.preform?.StopLoss && Math.round(datalive + (formdata?.preform?.StopLoss / 100) * datalive),
        target1: formdata?.preform?.target1 && Math.round(datalive + (formdata?.preform?.target1 / 100) * datalive),
        target2: formdata?.preform?.target2 && Math.round(datalive + (formdata?.preform?.target2 / 100) * datalive),
        target3: formdata?.preform?.target3 && Math.round(datalive + (formdata?.preform?.target3 / 100) * datalive),
        holdingPeriod: formdata?.preform?.HoldingPeriod,
        preformdata: {
          entryLowerRange: formdata?.preform?.lowRate,
          entryUpperRange: formdata?.preform?.highRate,
          stopLoss: formdata?.preform?.StopLoss,
          target1: formdata?.preform?.target1,
          target2: formdata?.preform?.target2,
          target3: formdata?.preform?.target3
        }
      });
    }
  }, [datalive]);
  const keydata = prefilledData?.map((data: any) => {
    return {
      formId: data._id,
      keys: data.hotkeys
    };
  });
  useOnkeyPress(handleForm, keydata);
  const handleEdit = async (id: String) => {
    const response = await axios.get(`${BASE_URL}/advisory/prefilled-form/${id}`);
    setupdateValues(response.data);
    setupdatefrom(true);
  };
  const handleDelete = async (id: String) => {
    const response = await axios.delete(`${BASE_URL}/advisory/prefilled-form/${id}`);
    if (response.data) {
      setsuccessDelete(true);
    }
  };
  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{'Types of Forms'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {addform && <AddPrefilledform onClose={closeAddform} open={addform} />}
            {updatefrom && <AddPrefilledform onClose={closeUpdateform} open={updatefrom} defaultValue={updateValue} />}
            <List sx={{ pt: 0 }}>
              {prefilledData.length > 0 &&
                prefilledData.map((item: any) => (
                  <ListItem
                    disableGutters
                    sx={{ width: '300px', backgroundColor: 'lightgrey', marginBottom: '10px', borderRadius: '10px' }}
                  >
                    <ListItemButton
                      key={item?._id}
                      sx={{ backgroundColor: 'lightgrey', marginRight: '10px' }}
                      onClick={() => handleForm(item._id)}
                    >
                      <ListItemText primary={item?.formName} />
                    </ListItemButton>
                    <ListItemAvatar>
                      <Stack direction="row" sx={{ marginRight: '10px' }} gap={1}>
                        <Avatar onClick={() => handleEdit(item._id)} sx={{ color: 'green' }}>
                          <ModeIcon />
                        </Avatar>
                        <Avatar onClick={() => handleDelete(item._id)}>
                          <DeleteIcon sx={{ color: '#FC8181' }} />
                        </Avatar>
                      </Stack>
                    </ListItemAvatar>
                  </ListItem>
                ))}
              <ListItem disableGutters>
                <ListItemButton autoFocus onClick={addformhandle} sx={{ borderRadius: '10px' }}>
                  <ListItemAvatar>
                    <Avatar>
                      <AddIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Add Forms" />
                </ListItemButton>
              </ListItem>
            </List>
          </DialogContentText>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
};

export default PrefilledForm;
