import * as yup from "yup";

export const basicScheme = yup.object().shape({
  age: yup
    .number()
    .typeError("Age must be a number")
    .required("Age is required")
    .positive()
    .integer(),
  country: yup
    .string()
    .typeError("Country must be text only")
    .required("Country must be a text"),
});
