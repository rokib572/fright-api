const yup = require('yup')
// Validation Schema
const clientCreateSchema = yup.object({
  body: yup.object({
    clientSince: yup.string().required('clientSince is required'),
    credit: yup
      .number()
      .min(0, 'credit Must be 0 or positive number')
      .typeError('Credit must be integer value')
      .required('creditType is required'),
    paymentTerms: yup
      .number()
      .min(0, 'paymentTerms Must be 0 or positive number')
      .typeError('paymentTerms must be integer value')
      .required('paymentTerms is required'),
    creditLimit: yup
      .number()
      .min(0, 'creditLimit Must be 0 or positive number')
      .typeError('creditLimit must be integer value')
      .required('creditLimit is required'),
    parentLocation: yup
      .string()
      .max(190, 'parentLocation must lees then 190 character'),
    salesperson: yup
      .string()
      .max(190, 'salesperson must lees then 190 character'),
    identificationNumber: yup
      .string()
      .max(255, 'identificationNumber must lees then 255 character'),
    division: yup.string().max(255, 'division must lees then 255 character'),
    paperworkRequired: yup
      .number()
      .min(0, 'paperworkRequired Must be 0 or positive number')
      .typeError('paperworkRequired must be integer value')
      .required('paperworkRequired is required'),
    paperworkTypes: yup.object().typeError('paperworkTypes must be object'),
  }),
})

const clientUpdateSchema = yup.object({
  body: yup.object({
    credit: yup
      .number()
      .min(0, 'credit Must be 0 or positive number')
      .typeError('Credit must be integer value'),
    paymentTerms: yup
      .number()
      .min(0, 'paymentTerms Must be 0 or positive number')
      .typeError('paymentTerms must be integer value'),
    creditLimit: yup
      .number()
      .min(0, 'creditLimit Must be 0 or positive number')
      .typeError('creditLimit must be a number'),
    identificationNumber: yup.string(),
    paperworkRequired: yup
      .number()
      .min(0, 'paperworkRequired Must be 0 or positive number')
      .typeError('paperworkRequired must be a number'),
    paperworkTypes: yup.object().typeError('paperworkTypes must be object'),
  }),
})

const createClientAccountingSchema = yup.object({
  body: yup.object({
    hasDock: yup
    .boolean()
    .typeError('Dock must be boolean value')
    .required('Dock is required'),
    hasForklift: yup
    .boolean()
    .typeError('Fork lift must be boolean value')
    .required('Fork lift is required'),
    isAirport: yup
    .boolean()
    .typeError('Airport must be boolean value')
    .required('Airport is required'),
    isCFS: yup
    .boolean()
    .typeError('CFS must be boolean value')
    .required('CFS is required'),
    isResidence: yup
    .boolean()
    .typeError('Residence must be boolean value')
    .required('Residence is required'),
  })
})

module.exports = {
  clientCreateSchema,
  clientUpdateSchema,
  createClientAccountingSchema
}
