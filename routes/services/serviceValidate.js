const yup = require('yup')

const kalculatorServiceSchema = yup.object({
    body: yup.object({
        convertWeightFrom: yup
        .string()
        .oneOf(['kg', 'lb'], 'convertWeightFrom should be one of kg or lb')
        .required('convertWeightFrom is required'),
        convertWeightTo: yup
        .string()
        .oneOf(['kg', 'lb'], 'convertWeightTo should be one of kg or lb')
        .required('convertWeightTo is required'),
        convertDimsFrom: yup
        .string()
        .oneOf(['cm', 'mm', 'in'], 'convertDimsFrom should be one of cm, mm or in')
        .required('convertDimsFrom is required'),
        convertDimsTo: yup
        .string()
        .oneOf(['cm', 'in'], 'convertDimsTo should be one of cm or in')
        .required('convertDimsTo is required'),
        quantities: yup
        .array()
        .of(
          yup.object({
            quantity: yup
            .number()
            .typeError('Quantities quantity must be a number')
            .required('Quantities quantity is required'),
            dimL: yup
            .number()
            .typeError('Quantities dimL must be a number')
            .required('Quantities dimL is required'),
            dimW: yup
            .number()
            .typeError('Quantities dimW must be a number')
            .required('Quantities dimW is required'),
            dimH: yup
            .number()
            .typeError('Quantities dimH must be a number')
            .required('Quantities dimH is required'),
            weight: yup
            .number()
            .typeError('Quantities weight must be a number')
            .required('Quantities weight is required'),
          })
        )
        .min(1, 'quantities must have at least one element')
        .required('quantities is required'),
    }),
})

module.exports = {
    kalculatorServiceSchema
}
