const yup = require('yup')
const createDedicatedRateSchema = yup.object({
    body: yup.object({
        vendorName: yup
            .string()
            .typeError('Vendor Name must be a string')
            .required('Vendor Name is required'),
        serviceType: yup
            .string()            
            .oneOf(['Ground', 'Air', 'Ocean'], 'Service Type Should be Ground, Air or Ocean')            
            .required('Service Type is required'),
        createdBy: yup
            .string()
            .typeError('Created By must be a string')
            .required('Created By is required'), 
        // allowsHaz: yup
        //     .boolean()
        //     .typeError('Allows Haz must be a boolean')
        //     .required('Allows Haz is required'),
        // isReefer: yup
        //     .boolean()
        //     .typeError('Reefer must be a boolean')
        //     .required('Reefer is required'),
        // currentRate: yup
        //     .number()
        //     .typeError('Current Rate must be a number')
        //     .required('Current Rate is required'),  
        // contactEmail: yup
        //     .string()
        //     .typeError('Contact Email must be a string')
        //     .required('Contact Email is required'), 
        // contactName: yup
        //     .string()
        //     .typeError('Contact Name must be a string')
        //     .required('Contact Name is required'),     
        // originCity: yup
        //     .string()
        //     .typeError('Origin City must be a string')
        //     .required('Origin City is required'),
        // originProvince: yup
        //     .string()
        //     .typeError('Origin Province must be a string')
        //     .required('Origin Province is required'),
        // originPostalCode: yup
        //     .string()
        //     .typeError('Origin Postal Code must be a string')
        //     .required('Origin Postal Code is required'), 
        // originStationCode: yup
        //     .string()
        //     .typeError('Origin Station Code must be a string')
        //     .required('Origin Station Code is required'),
        // destinationCity: yup
        //     .string()
        //     .typeError('Destination City must be a string')
        //     .required('Destination City is required'),        
        // destinationProvince: yup
        //     .string()
        //     .typeError('Destination Province must be a string')
        //     .required('Destination Province is required'),   
        // destinationPostalCode: yup
        //     .string()
        //     .typeError('Destination Postal Code must be a string')
        //     .required('Destination Postal Code is required'), 
        // destinationStationCode: yup
        //     .string()
        //     .typeError('Destination Station Code must be a string')
        //     .required('Destination Station Code is required'), 
       
    }),
})


module.exports = {
    createDedicatedRateSchema
}