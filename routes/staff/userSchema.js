const yup = require('yup')

const userCreateSchema = yup.object({
  body: yup.object({
    firstName: yup.string().required('FirstName is required'),
    lastName: yup.string().required('LastName is required'),
    email: yup.string()
    .email('Invalid email')
    .required('Email is required'),
    password: yup.string().required('Password is required'),
  }),
})

const userUpdateSchema = yup.object({
  body: yup.object({
    firstName: yup.string()
    .matches(/^[a-zA-Z]+$/, 'FirstName must be alphabets only')
    .trim(),
    lastName: yup.string()
    .matches(/^[a-zA-Z]+$/, 'LastName must be alphabets only')
    .trim(),
    email: yup.string().email('Invalid email'),
    password: yup.string().trim(),
  }),
})

const contactCardUpdateSchema = yup.object({
  body: yup.object({
    displayName: yup.string().required('DisplayName is required').trim(),
    directPhone: yup.string().test('directPhone', 'Invalid directPhone number', (value) => isValidPhoneNumber(value)),
    mobilePhone: yup.string().test('mobilePhone', 'Invalid mobilePhone number', (value) => isValidPhoneNumber(value)),
    officePhone: yup.string().test('officePhone', 'Invalid officePhone number', (value) => isValidPhoneNumber(value)),
    email: yup.string().required('email is required').email('Invalid email'),
    profilePhoto: yup.string().test('profilePhoto', 'Invalid image url', (value) => isValidImageUrl(value)),
  }),
})

const isValidImageUrl = (url) => {
  if(!url) return true
  const urlRegex = /^(http:\/\/www.|https:\/\/www.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
  return urlRegex.test(url);
}

const isValidPhoneNumber = (phoneNumber) => {
  if(!phoneNumber) return true
  const phoneNumberRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/gm;
  return phoneNumberRegex.test(phoneNumber);
}

module.exports = {
  userCreateSchema,
  userUpdateSchema,
  contactCardUpdateSchema
}
