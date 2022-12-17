const yup = require('yup')
// Validation Schema
const contactCreateSchema = yup.object({
  body: yup.object({
    firstName: yup.string().required('firstName is required'),
    lastName: yup.string().required('lastName is required'),
    locations: yup.array().typeError('locations must be an array'),
    email: yup.string().email('please type valid email address'),
  }),
})

const contactUpdateSchema = yup.object({
  body: yup.object({
    firstName: yup.string().required('firstName is required'),
    lastName: yup.string().required('lastName is required'),
    email: yup.string().email('please type valid email address'),
  }),
})

module.exports = {
  contactCreateSchema,
  contactUpdateSchema,
}
