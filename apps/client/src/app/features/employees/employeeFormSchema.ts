import * as yup from 'yup';

export const employeeFormSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().required().email(),
  mobile: yup.string().required(),
  dob: yup.string().required(),
  doj: yup.string().required(),
});
