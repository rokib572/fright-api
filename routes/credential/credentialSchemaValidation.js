const yup = require('yup')
// Validation Schema
const credentialCreateSchema = yup.object({
  body: yup.object({
    category: yup.string().required('Category is required'),
    label: yup.string().required('Label is required'),
    webAddress: yup
      .string()
      .url('webAddress must be a valid URL')
      .required('Web Address is required'),
    userName: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
    division: yup.string().required('Division is required'),
  }),
})

const credentialUpdateSchema = yup.object({
  body: yup.object({
    category: yup.string().required('Category is required'),
    label: yup.string().required('Label is required'),
    webAddress: yup
      .string()
      .url('webAddress must be a valid URL')
      .required('WebAddress is required'),
    division: yup.string().required('Division is required'),
  }),
})

module.exports = {
  credentialCreateSchema,
  credentialUpdateSchema,
}
