import * as yup from 'yup';

class FAQValidationSchema {
  faqSchema = yup.object().shape({
    programTitle: yup.string().required('Program Title is required'),
    faqs: yup.lazy((value: any) => {
      const keys = Object.keys(value);
      return keys.length
        ? yup.object().shape(
            Object.fromEntries(
              keys.map((key) => [
                key,
                yup.object().shape({
                  faqQuestion: yup.string().required('faq Question is required'),
                  faqAnswer: yup.string().required('faq Answer is required')
                })
              ])
            )
          )
        : yup.mixed().required();
    })
  });
}

export default FAQValidationSchema;
