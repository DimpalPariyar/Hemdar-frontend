export const firstFormSet = [
  { name: 'productTitle', label: 'Title' },
  { name: 'productShortDescription', label: 'Short Description' },
  { name: 'numberOfTradePerWeek', type: 'number', label: 'Number of Trades per Week' },
  { name: 'bannerImage', label: 'Banner Image' },
  { name: 'minInvestValue', type: 'number', label: 'Min Invest' }
];

export const secondFormSet = [
  { name: 'volatilityId', labelKey: 'name', dataKey: 'volatility', label: 'Volatility' },
  { name: 'timeFrameId', labelKey: 'name', dataKey: 'timeFrame', label: 'Time Frame' },
  { name: 'productTypeId', labelKey: 'name', dataKey: 'productType', label: 'Product Type' },
  { name: 'hostProfileId', labelKey: 'hostName', dataKey: 'hostProfiles', label: 'Host Profile' },
  { name: 'instrumentId', labelKey: 'name', dataKey: 'instrument', label: 'Instrument' },
  { name: 'exchangeId', labelKey: 'name', dataKey: 'exchange', label: 'Exchange' },
  { name: 'marketId', labelKey: 'name', dataKey: 'market', label: 'Market' }
];

export const defaultPlan = {
  priceName: '',
  actualPrice: 0,
  validityPeriodInDays: 0,
  discountPercentage: 0,
  discountedPrice: 0
};

export const initialValues = {
  productTitle: '',
  subscriptionPlanIds: [defaultPlan]
};

export const updateForSet = [
  { name: 'price', label: 'Price', type: 'number' },
  { name: 'newStatus', label: 'Status', type: 'status' },
  // { name: 'remarks', label: 'Remarks', type: 'text' },
];

export const planFormSet = [
  { name: 'priceName', label: 'Plan Name' },
  { name: 'actualPrice', label: 'Actual Price', type: 'number' },
  { name: 'validityPeriodInDays', label: 'Validity Period (In Days)' },
  { name: 'discountPercentage', label: 'Discount Percentage', type: 'number' },
  { name: 'discountedPrice', label: 'Discounted Price', disabled: true }
];

export const priceFields = ['actualPrice', 'discountPercentage'];
