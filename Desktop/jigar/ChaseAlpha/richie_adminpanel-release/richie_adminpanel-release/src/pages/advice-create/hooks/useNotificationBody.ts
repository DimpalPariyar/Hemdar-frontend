import { useEffect } from 'react';
import { getNotificationBody } from '../helper';

export default function useNotificationBody(formik: any) {
  const values: any = formik.values;
  useEffect(() => {
    const notificationBody = getNotificationBody(formik);
    formik.setValues({
      ...values,
      notificationBody
    });
  }, [
    formik.values.nameOfUnderlying,
    formik.values.expiry,
    formik.values.optionStrike,
    formik.values.optionType,
    formik.values.entryLowerRange,
    formik.values.entryUpperRange,
    formik.values.target1,
    formik.values.target3,
    formik.values.target3,
    formik.values.stopLoss
  ]);
}
