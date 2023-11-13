import * as yup from 'yup';

class SessionValidationSchema {
  sessionSchema = yup.object().shape({
    sessionLink: yup.string().required('link is required'),
    dates: yup.lazy((value: any) => {
      const keys = Object.keys(value);
      return keys.length
        ? yup.object().shape(
            Object.fromEntries(
              keys.map((key) => [
                key,
                yup.object().shape({
                  date: yup.string().required('Date is required').typeError('Must be in date format')
                })
              ])
            )
          )
        : yup.mixed().required();
    })
  });
}

export default SessionValidationSchema;
