const yup = require('yup')
// Validation Schema
const catalogAccessorialsSchemaValidation = yup.object({
  body: yup.object({
    accessorial: yup
      .string()
      .required('accessorial is required')
      .max(190, 'accessorial must lees then 190 character'),
  }),
})

module.exports = { catalogAccessorialsSchemaValidation }
