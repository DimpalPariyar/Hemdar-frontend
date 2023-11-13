export const getNotificationBody = (formik: any) => {
  let notificationBody = '';

  if (formik.values.nameOfUnderlying) {
    notificationBody += formik.values.nameOfUnderlying;
  }

  if (formik.values.expiry) {
    // TODO after auto fetch make this more meanigful with moment
    notificationBody += ' ' + formik.values.expiry;
  }

  if (formik.values.optionStrike) {
    notificationBody += ' ' + formik.values.optionStrike;
  }

  if (formik.values.optionType) {
    notificationBody += ' ' + formik.values.optionType;
  }

  if (formik.values.entryLowerRange) {
    notificationBody += ' Entry ' + formik.values.entryLowerRange;
  }

  if (formik.values.entryUpperRange) {
    notificationBody += ' - ' + formik.values.entryUpperRange;
  }

  if (formik.values.stopLoss) {
    notificationBody += ' SL ' + formik.values.stopLoss;
  }

  if (formik.values.target1) {
    notificationBody += ' Target ' + formik.values.target1;
  }
  if (formik.values.target2) {
    notificationBody += ' - ' + formik.values.target2;
  }
  if (formik.values.target3) {
    notificationBody += ' - ' + formik.values.target3;
  }

  return notificationBody;
};

export const getAdvisory = (products: any) => products.map((data: any) => ({ value: data._id, label: data.productTitle,relatedProductsIds:data.relatedProductsIds}));

export const getSymbolsOption = (symbols: any, instrumentId: string) =>
  symbols.filter(({ instruments }: any) => instruments.includes(instrumentId)).map((data: any) => ({ value: data._id, label: data.name }));

export const getProductPayloads = (advisoryId: string, products: any) => {
  const product = products.find((productItem: any) => productItem._id === advisoryId);
  return {
    advisoryId,
    marketId: product?.marketId?._id || '',
    exchangeId: product?.exchangeId?._id || '',
    productTypeId: product?.productTypeId?._id || '',
    timeFrameId: product?.timeFrameId?._id || '',
    volatilityId: product?.volatilityId?._id || '',
    hostProfileId: product?.hostProfileId?._id || '',
    instrumentId: product?.instrumentId?._id || '',
    notificationTitle: product?.productTitle || ''
  };
};

export const getInstrumentChangePayload = (values: any) => {
  return { ...values, nameOfUnderlying: null, expiry: null, optionStrike: null, optionType: null };
};

export const getExpiryPayload = (name: string, value: string, values: any) => {
  const resetPayload = name === 'expiry' ? { optionStrike: null, optionType: null } : { optionType: null };
  return { ...values, ...resetPayload, [name]: value };
};

export const getExpiryDateOption = (expiryDate: any, instrumentId: string, nameOfUnderlying: string) =>
  expiryDate.reduce((acc: any, data: any) => {
    if (data.instruments.includes(instrumentId) && data.symbols.includes(nameOfUnderlying)) {
      return [
        ...acc,
        {
          value: data._id,
          label: data.name
        }
      ];
    }
    return acc;
  }, []);
