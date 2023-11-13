export const firstFormSet = [
  { name: 'marketId', labelKey: 'name', dataKey: 'market', label: 'Market' },
  { name: 'exchangeId', labelKey: 'name', dataKey: 'exchange', label: 'Exchange' },
  { name: 'timeFrameId', labelKey: 'name', dataKey: 'timeFrame', label: 'Time Frame' },
  { name: 'instrumentId', labelKey: 'name', dataKey: 'instrument', label: 'Instrument' },
  { name: 'hostProfileId', labelKey: 'hostName', dataKey: 'hostProfiles', label: 'Host Profile' },
  { name: 'productTypeId', labelKey: 'name', dataKey: 'productType', label: 'Product Type' },
  { name: 'analyst', labelKey: 'analyst', dataKey: 'analyst', label: 'Analyst' }
];

export const secondFormSet = [
  { name: 'productTitle', label: 'Title' },
  { name: 'productShortDescription', label: 'Short Description' },
  { name: 'numberOfTradePerWeek', type: 'number', label: 'Number of Trades per Week' },
  { name: 'bannerImage', label: 'Banner Image' },
  { name: 'minInvestValue', type: 'number', label: 'Min Invest' }
];

export const expiryAdviceFormSet = (instrumentType: string) =>
  [
    ['63b298e0b6079ecb3c76e71c', '63b298d1b6079ecb3c76e718', '63b298c7b6079ecb3c76e710', '63b298cbb6079ecb3c76e714'].includes(
      instrumentType
    ) && {
      name: 'expiry',
      label: 'Expiry'
    },
    ['63b298e0b6079ecb3c76e71c', '63b298d1b6079ecb3c76e718'].includes(instrumentType) && {
      name: 'optionStrike',
      label: 'Option Strike'
    },
    ['63b298e0b6079ecb3c76e71c', '63b298d1b6079ecb3c76e718'].includes(instrumentType) && {
      name: 'optionType',
      label: 'Option TYPE'
    },
    [
      '639ae9dc69f62b2049018132',
      '639af38b69f62b2049018247',
      '63956749891169ba9cec05ce',
      '639af38069f62b2049018243',
      '639af38f69f62b204901824b'
    ].includes(instrumentType) && { name: 'cmp', label: 'CMP', type: 'text' }
  ].filter(Boolean);

export const thirdFormSet = [
  { name: 'target1', label: 'Target 1', type: 'number' },
  { name: 'target2', label: 'Target 2', type: 'number' },
  { name: 'target3', label: 'Target Target 3', type: 'number' },
  { name: 'holdingPeriod', label: 'Holding Period', type: 'text' },
  { name: 'riskReward', label: 'Risk Reward', type: 'text' }
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

export const optionTypeOptions = [
  {
    value: 'CE',
    label: 'CE'
  },
  {
    value: 'PE',
    label: 'PE'
  }
];

export const updateTypeOptions = [
  {
    value: 'new',
    label: 'New'
  },
  {
    value: 'update',
    label: 'Update'
  }
];

export const statusOptions = [
  { value: 'freshTrade', label: 'Fresh Trade' },
  { value: 'bookProfit', label: 'Book Profit' },
  { value: 'bookPartialProfit', label: 'Book Partial Profit' },
  { value: 'exit', label: 'Exit' },
  { value: 'stoplossTriggered', label: 'Stoploss Triggered' },
  { value: 'open', label: 'Open' }
];

export const stoplossOptions = [
  { value: 'tick', label: 'Tick' },
  { value: '5MinCLB', label: '5MinCLB' },
  { value: '15MinCLB', label: '15MinCLB' },
  { value: 'hourlyCLB', label: 'HourlyCLB' },
  { value: 'dailyCLB', label: 'DailyCLB' }
];

export const strategyFormSet = [
  { name: 'strategyName', label: 'Strategy Name' },
  { name: 'expiry', label: 'Expiry' },
  { name: 'strike', label: 'Strike' },
  { name: 'quantity', label: 'Quantity' },
  { name: 'optionType', label: 'Option Type' },
  { name: 'ltp', label: 'LTP' }
];

export const prefilleddata = [
  { name: 'formName', type: 'text', label: 'FORM NAME' },
  { name: 'productId', type: 'select', dataKey: 'advisory', label: 'PRODUCT' },
  { name: 'nameOfUnderlyingDataId', type: 'select', dataKey: 'symbolsOption', label: 'Name of Underlying' },
  { name: 'action', type: 'select', dataKey: 'action', label: 'ACTION' },
  { name: 'lowRate', type: 'number', label: 'Low Rate(Percentage %)' },
  { name: 'highRate', type: 'number', label: 'High Rate (Percentage %)' },
  { name: 'StopLoss', type: 'number', label: 'Stop Loss (Percentage %)' },
  { name: 'target1', type: 'number', label: 'Target 1 (Percentage %)' },
  { name: 'target2', type: 'number', label: 'Target 2 (Percentage %)' },
  { name: 'target3', type: 'number', label: 'Target 3 (Percentage %)' },
  { name: 'TypeOfNotification', type: 'select', dataKey: 'notification', label: 'Type Of Notification' },
  { name: 'HoldingPeriod', type: 'text', label: 'Holding Period' },
  { name: 'hotkeys', type: 'text', label: 'HOT KEYS', placeholder: 'Eg:control+shift+1' }
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

export const defaultUpdate = {
  newStatus: '',
  price: '',
  remarks: '',
  notificationTitle: '',
  notificationBody: '',
  typeOfNotification: ''
};

export const initialValues = {
  action:'',
  remarks:'',
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
  strategy: [defaultStrategy],
  preformdata:{}
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
