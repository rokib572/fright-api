const yup = require('yup')
const { validate: isUUIDv } = require('uuid')
const isUUID = (value) => {
    if (!value) return true
    return isUUIDv(value)
}
const createQuoteSchema = yup.object({
    body: yup.object({
        createdBy: yup
            .string()
            .typeError('createdBy must be a string')
            .required('createdBy is required')
            .test('createdBy', 'createdBy must be uuid', (value) =>
                isUUID(value)
            ),
    }),
})
const updateQuoteSchema = yup.object({
    body: yup.object({
        createdBy: yup
            .string()
            .typeError('createdBy must be a string')
            .test('createdBy', 'createdBy must be uuid', (value) =>
                isUUID(value)
            ),
        quoteNumber: yup
            .string()
            .typeError('quoteNumber must be a string')
            .max(170, 'quoteNumber must be less than 170 characters'),
        serviceType: yup
            .string()
            .typeError('serviceType must be a string')
            .max(170, 'serviceType must be less than 170 characters'),
        quoteDate: yup.date().typeError('quoteDate must be a date'),
        requestedBy: yup
            .string()
            .typeError('requestedBy must be a string')
            .test('requestedBy', 'requestedBy must be uuid', (value) =>
                isUUID(value)
            ),
        billingParty: yup
            .string()
            .test('billingParty', 'billingParty must be uuid', (value) =>
                isUUID(value)
            )
            .typeError('billingParty must be a string'),
        salesPerson: yup
            .string()
            .typeError('salesPerson must be a string')
            .max(170, 'salesPerson must be less than 170 characters'),
    }),
})

const createQuoteRouteSchema = yup.object({
    body: yup.object({
        locationsId: yup.string().typeError('locationsId must be a string'),
        city: yup.string().typeError('city must be a string'),
        province: yup.string().typeError('province must be a string'),
        postalCode: yup
            .string()
            .typeError('postalCode must be a string')
            .min(5, 'postalCode length must be greater or equal 5 letter')
            .max(10, 'postalCode length must be less or equal 10 letter'),
        country: yup
            .string()
            .nullable()
            .typeError('country must be a string')
            .oneOf(['US', 'CN', 'MX'], 'country should be US or CN or MX'),
        movementType: yup
            .number()
            .typeError('movementType must be a number')
            .required('movementType is required'),
    }),
})

const updateQuoteRouteSchema = yup.object({
    body: yup.object({
        step: yup.number().typeError('step must be a number'),
        locationsId: yup.string().typeError('locationsId must be a string'),
        city: yup.string().typeError('city must be a string'),
        province: yup.string().typeError('province must be a string'),
        postalCode: yup
            .string()
            .typeError('postalCode must be a string')
            .min(5, 'postalCode length must be greater or equal 5 letter')
            .max(10, 'postalCode length must be less or equal 10 letter'),
        country: yup
            .string()
            .nullable()
            .typeError('country must be a string')
            .oneOf(['US', 'CN', 'MX'], 'country should be US or CN or MX'),
        movementType: yup
            .number()
            .typeError('movementType must be a number')
            .required('movementType is required'),
    }),
})

const createQuoteEquipmentSchema = yup.object({
    body: yup.object({
        equipmentTypeId: yup
            .number()
            .typeError('equipmentTypeId must be a number')
            .required('equipmentTypeId is required'),
    }),
})

const createQuotePiecesSchema = yup.object({
    body: yup.object({
        quantityTypeId: yup
            .number()
            .typeError('Quantity type must be a number')
            .required('Quantity type is required'),
        pieceWeight: yup
            .number()
            .typeError('Piece weight must be a number')
            .required('Piece weight is required'),
        description: yup.string().required('Description is required'),
        isHazardous: yup
            .number()
            .typeError('Hazardous must be a number')
            .required('Hazardous is required'),
        quantity: yup
            .number()
            .typeError('Quantity must be a number')
            .required('Quantity is required'),
    }),
})

const updateQuoteEquipmentSchema = yup.object({
    body: yup.object({
        equipmentTypeId: yup
            .number()
            .typeError('equipmentTypeId must be a number')
            .required('equipmentTypeId is required'),
    }),
})

module.exports = {
    createQuoteSchema,
    updateQuoteSchema,
    createQuoteRouteSchema,
    updateQuoteRouteSchema,
    createQuoteEquipmentSchema,
    createQuotePiecesSchema,
    updateQuoteEquipmentSchema,
}
