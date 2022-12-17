// Validation Schema
const yup = require('yup')
const { validate: isUUID } = require('uuid')

const isValidLocation = (value) => {
  if (value == '') {
    return true
  }
  const regex = /^[a-zA-Z0-9\s,.&'-]*$/
  return regex.test(value)
}

const createLocationSchema = yup.object({
  body: yup.object({
    companyName: yup
      .string()
      .typeError('Company name should be a string')
      .matches(/^[a-zA-Z0-9\s,.&'-]*$/, 'Company Name must be a valid name')
      .matches(/[a-zA-Z]/, 'CompanyName should contain alphabet')
      .min(5, 'Company name must be at least 5 characters long')
      .required('Company Name is required')
      .trim(),
    companyAddress1: yup
      .string()
      .typeError('Company address1 should be a string')
      .matches(/^[a-zA-Z0-9\s,.&'-]*$/, 'Invalid address 1')
      .matches(/[a-zA-Z]/, 'Address 1 should contain alphabet')
      .min(3, 'Address 1 must be at least 3 characters')
      .required('Company Address is required')
      .trim(),
    companyAddress2: yup
      .string()
      .typeError('Company address2 should be a string')
      .test('companyAddress2', 'Invalid address 2', (value) =>
        isValidLocation(value)
      )
      .trim()
      .nullable(),
    companyCity: yup
      .string()
      .typeError('Company city should be a string')
      .matches(/^[a-zA-Z0-9\s,.&'-]*$/, 'Invalid city')
      .min(3, 'City must be at least 3 characters')
      .required('Company city is required')
      .trim(),
    companyProvince: yup
      .string()
      .typeError('Company province should be a string')
      .matches(/^[a-zA-Z0-9\s,.&'-]*$/, 'Invalid province')
      .min(2, 'Province must be at least 2 characters')
      .required('Company province is required')
      .trim(),
    companyPostalCode: yup
      .string()
      .typeError('Company postal code should be a string')
      .matches(/^[a-zA-Z0-9\s,.&'-]*$/, 'Invalid postal code')
      .min(3, 'Postal code must be at least 3 characters')
      .trim(),
    companyCountry: yup
      .string()
      .typeError('Company country should be a string')
      .matches(/^[a-zA-Z0-9\s,.&'-]*$/, 'Invalid country')
      .min(2, 'Country must be at least 2 characters')
      .required('Company Country is required')
      .trim(),
    isSFS: yup
      .boolean()
      .typeError('isSFS Should be boolean true or false or 0 or 1')
      .required('isSFS is Required'),
    isClient: yup
      .boolean()
      .typeError('isClient Should be boolean true or false or 0 or 1')
      .nullable(),
    isVendor: yup
      .boolean()
      .typeError('isVendor Should be boolean true or false or 0 or 1')
      .nullable(),
  }),
})

//update location schema
const updateLocationSchema = yup.object({
  body: yup.object({
    companyName: yup
      .string()
      .typeError('Company name should be a string')
      .matches(/^[a-zA-Z0-9\s,.&'-]*$/, 'Company Name must be a valid name')
      .matches(/[a-zA-Z]/, 'CompanyName should contain alphabet')
      .min(5, 'Company name must be at least 5 characters long')
      .trim(),
    companyAddress1: yup
      .string()
      .typeError('Company address1 should be a string')
      .matches(/^[a-zA-Z0-9\s,.&'-]*$/, 'Invalid address 1')
      .matches(/[a-zA-Z]/, 'Address 1 should contain alphabet')
      .required('companyAddress1 is required')
      .min(3, 'Address 1 must be at least 3 characters')
      .trim(),
    companyAddress2: yup
      .string()
      .typeError('Company address2 should be a string')
      .test(
        'companyAddress2',
        'companyAddress2 should contain alphabet',
        (value) => isValidLocation(value)
      )
      .trim()
      .nullable(),
    companyCity: yup
      .string()
      .typeError('Company city should be a string')
      .matches(/^[a-zA-Z0-9\s,.&'-]*$/, 'Invalid city')
      .matches(/[a-zA-Z]/, 'City should contain at least one alphabet')
      .min(3, 'City must be at least 3 characters')
      .required('companyCity is required')
      .trim(),
    companyProvince: yup
      .string()
      .typeError('Company province should be a string')
      .matches(/^[a-zA-Z0-9\s,.&'-]*$/, 'Invalid province')
      .matches(/[a-zA-Z]/, 'Province should contain at least one alphabet')
      .min(2, 'Province must be at least 2 characters')
      .required('companyProvince is required')
      .trim(),
    companyPostalCode: yup
      .string()
      .typeError('Company postal code should be a string')
      .matches(/^[a-zA-Z0-9\s,.&'-]*$/, 'Invalid postal code')
      .trim()
      .nullable(),
    companyCountry: yup
      .string()
      .typeError('Company country should be a string')
      .matches(/^[a-zA-Z0-9\s,.&'-]*$/, 'Invalid country')
      .matches(/[a-zA-Z]/, 'Country should contain alphabet')
      .min(2, 'Country must be at least 2 characters')
      .required('Company Country is required')
      .trim(),
    isSFS: yup
      .boolean()
      .typeError('isSFS Should be boolean true or false or 0 or 1')
      .required('isSFS is Required'),
    isClient: yup
      .boolean()
      .typeError('isClient should be a boolean')
      .nullable(),
    isVendor: yup
      .boolean()
      .typeError('isVendor should be a boolean')
      .nullable(),
  }),
})

const createLocationProfileSchema = yup.object({
  body: yup.object({
    hasDock: yup
      .mixed()
      .oneOf(['1', '0', 1, 0], 'hasDock Should be 1 or 0')
      .required('hasDock is required'),
    hasForklift: yup
      .mixed()
      .oneOf(['1', '0', 1, 0], 'hasForklift Should be 1 or 0')
      .required('hasForklift is required'),
    isAirport: yup
      .mixed()
      .oneOf(['1', '0', 1, 0], 'isAirport Should be 1 or 0')
      .required('isAirport is required'),
    isCFS: yup
      .mixed()
      .oneOf(['1', '0', 1, 0], 'isCFS Should be 1 or 0')
      .required('isCFS is required'),
    isResidence: yup
      .mixed()
      .oneOf(['1', '0', 1, 0], 'isResidence Should be 1 or 0')
      .required('isResidence is required'),
  }),
})

const createLocationShippingSchema = yup.object({
  body: yup.object({
    requiresAppt: yup
      .mixed()
      .oneOf(['1', '0', 1, 0], 'requiresAppt Should be 1 or 0')
      .required('requiresAppt is required'),
    hours: yup
      .array()
      .of(yup.object().typeError('Hours should be an array of objects'))
      .typeError('Hours should be an array of objects')
      .nullable(),
    shippingDocks: yup
      .array()
      .of(
        yup.string().typeError('Shipping Docks should be an array of strings')
      )
      .typeError('Shipping Docks should be an array of strings')
      .nullable(),
    shippingInstructions: yup
      .string()
      .typeError('shippingInstructions should be a string')
      .nullable(),
  }),
})

const createLocationReceivingSchema = yup.object({
  body: yup.object({
    requiresAppt: yup
      .mixed()
      .oneOf(['1', '0', 1, 0], 'requiresAppt Should be 1 or 0')
      .required('requiresAppt is required'),
    hours: yup
      .array()
      .of(yup.object().typeError('Hours should be an array of objects'))
      .typeError('Hours should be an array of objects')
      .nullable(),
    receivingDocks: yup
      .array()
      .of(
        yup.string().typeError('Receiving Docks should be an array of strings')
      )
      .typeError('Receiving Docks should be an array of strings')
      .nullable(),
    receivingInstructions: yup
      .string()
      .typeError('receivingInstructions should be a string')
      .nullable(),
  }),
})

const getLocationByQuery = yup.object({
  query: yup.object({
    page: yup
      .number()
      .integer()
      .typeError('Page should be an integer')
      .min(1, 'Page should be greater than 0'),
    companyName: yup
      .string()
      .typeError('Company name should be a string')
      .trim(),
    companyPostalCode: yup
      .string()
      .typeError('Company postal code should be a string')
      .trim(),
    companyCountry: yup
      .mixed()
      .oneOf(
        ['US', 'CA', 'us', 'ca'],
        'company country should be US/us or CA/ca'
      ),
  }),
})

const updateLocationProfileSchema = yup.object({
  body: yup.object({
    hasDock: yup
      .boolean()
      .typeError('hasDock should be a boolean data 0 or 1')
      .required('hasDock value is required'),
    hasForklift: yup
      .boolean()
      .typeError('hasForklift should be a boolean data 0 or 1')
      .required('hasForklift value is required'),
    isAirport: yup
      .boolean()
      .required('isAirport value is required')
      .typeError('isAirport should be a boolean data 0 or 1'),
    isResidence: yup
      .boolean()
      .required('isResidence value is required')
      .typeError('isResidence should be a boolean data 0 or 1'),
    isCFS: yup
      .boolean()
      .typeError('isCFS should be a boolean data 0 or 1')
      .required('isCFS value is required'),
  }),
})

const checkHours = (hours) => {
  if (!hours) return 'YES'
  if (!Array.isArray(hours)) return 'Hours should be an array of objects'
  if (hours.length === 0) return 'Hours should be an array of objects'
  if (hours.length != 7) return 'Hours should be length of 7 objects'
  if (!hours.every((hour) => typeof hour === 'object'))
    return 'Hours should be an array of objects'
  if (!hours.every((hour) => typeof hour.day === 'string'))
    return 'Day should be a string'
  if (
    !hours.every((hour) =>
      /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/.test(
        hour.day
      )
    )
  )
    return "Day should be one of the following: 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'"
  if (
    !hours.every((hour) => typeof hour.open === 'string' || hour.open === null)
  )
    return 'Hours should be an array of objects with open as a string in HH:MMAM/PM format or null'

  for (let i = 0; i < hours.length; i++) {
    if (!checkTimeFormat(hours[i].open))
      return 'Open should be string in HH:MMAM/PM format or null'
    if (!checkTimeFormat(hours[i].close))
      return 'Close should be  string in HH:MMAM/PM format or null'
  }
  return 'YES'
}

const checkTimeFormat = (time) => {
  if (time === undefined) return false
  if (time === null) return true
  if (!time) return false
  if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s?(AM|PM)$/.test(time)) return false
  return true
}

module.exports = {
  createLocationSchema,
  updateLocationSchema,
  createLocationProfileSchema,
  createLocationShippingSchema,
  createLocationReceivingSchema,
  getLocationByQuery,
  checkHours,
  updateLocationProfileSchema,
}
