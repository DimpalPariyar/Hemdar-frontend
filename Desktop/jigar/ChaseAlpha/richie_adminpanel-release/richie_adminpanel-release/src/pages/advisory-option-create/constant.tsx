import { Stack } from '@mui/material';

export const columns = [
  {
    Header: 'Symbol',
    disableFilters: true,
    accessor: ({ symbol }: any) => symbol
  },
  {
    Header: 'Call LTP',
    disableFilters: true,
    accessor: ({ callltp }: any) => callltp
  },
  {
    Header: 'Strike Price',
    disableFilters: true,
    accessor: 'strike'
  },
  {
    Header: 'Put LTP',
    disableFilters: true,
    accessor: ({ putLTP }: any) => putLTP
  },
  {
    Header: 'Expiry ',
    disableFilters: true,
    accessor: ({ expiry }: any) => expiry
  }
];

export const strategyActionOptions = [
  {
    value: 'buy',
    label: 'Buy'
  },
  {
    value: 'sell',
    label: 'Sell'
  }
];

export const defaultStrategy = {
  strategyName: '',
  expiry: '',
  strike: '',
  quantity: '',
  optionType: '',
  ltp: '',
  action: strategyActionOptions[0].value
};
export const initialValues = {
  action: '',
  remarks: '',
  entryLowerRange: '',
  entryUpperRange: '',
  stopLoss: '',
  expiry: '',
  optionType: '',
  optionStrike: '',
  timeFrameId: '',
  productTypeId: '',
  hostProfileId: '',
  instrumentId: '',
  exchangeId: '',
  marketId: '',
  nameOfUnderlying: '',
  advisoryId: '',
  target1: null,
  target2: null,
  target3: null,
  holdingPeriod: '',
  status: 'open',
  updateType: 'new',
  internalChart: '',
  analyst: '',
  notificationTitle: '',
  notificationBody: '',
  typeOfNotification: '',
  unSubNotificationTitle: '',
  unSubNotificationBody: '',
  ltp:0,
  strategy: [defaultStrategy],
  preformdata: {}
};

export const prefillformInitialvalue = {
  formName: '',
  productId: '',
  action: '',
  lowRate: '',
  highRate: '',
  StopLoss: '',
  target1: '',
  target2: '',
  target3: '',
  TypeOfNotification: '',
  HoldingPeriod: '',
  nameOfUnderlying: '',
  nameOfUnderlyingDataId: '',
  hotkeys: ''
};
