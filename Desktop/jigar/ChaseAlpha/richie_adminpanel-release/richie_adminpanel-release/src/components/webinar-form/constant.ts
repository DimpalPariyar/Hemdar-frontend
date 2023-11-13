export const initialValues = {
  title: '',
  webinarTime: undefined,
  linkIds: [],
  hostProfileId: undefined,
  shortDescription: '',
  longDescription: '',
  priceIds: []
};
export const defaultPrice = {
  actualPrice: 0,
  discountPercentage: 0,
  discountedPrice: 0
};

export const planFormSet = [
  { name: 'actualPrice', label: 'Actual Price', type: 'number' },
  { name: 'discountPercentage', label: 'Discount Percentage', type: 'number' },
  { name: 'discountedPrice', label: 'Discounted Price', disabled: true }
];

export const priceFields = ['actualPrice', 'discountPercentage'];
export const basicInfoSet = [
  { name: 'title', type: 'text', label: 'Title' },
  { name: 'link', type: 'text', label: 'Webinar URL' },
  { name: 'shortDescription', type: 'text', label: 'Short Description' }
];

export const dropdownSet = [{ name: 'hostProfileId', labelKey: 'hostName', dataKey: 'hostProfiles', label: 'Host Profile' }];
