import * as Yup from 'yup';

class OptionValidationSchema {
  optionsSchema = Yup.object().shape({
    question: Yup.string().required("Question is required"),
    option: Yup.lazy((value: any) => {
      const keys = Object.keys(value);
      return keys.length
        ? Yup.object().shape(
            Object.fromEntries(
              keys.map((key) => [
                key,
                Yup.object().shape({
                  optionName: Yup.string().required('Option Name is required'),
                  optionValue: Yup.number().required('Option Value is required').typeError('Option Value must be number')
                }),
              ]),
            ),
          )
        : Yup.mixed().required();
    })
  });
}

export default OptionValidationSchema;
