const yup = require('yup')

const uploadFileSchema = yup.object({
    body: yup.object({
        folderId: yup.number().typeError('folderId must be a number'),
        createdBy: yup
            .string()
            .typeError('createdBy must be a string')
            .required('createdBy is required'),
    }),
})

const updateFileSchema = yup.object({
    body: yup.object({
        modifiedBy: yup
            .string()
            .typeError('modifiedBy must be a string')
            .required('modifiedBy is required'),
    }),
})

const createFolderSchema = yup.object({
    body: yup.object({
        name: yup
            .string()
            .typeError('Name must be a string')
            .required('Name is required'),
        parentFolderId: yup
            .number()
            .typeError('parentFolderId must be a number')
            .nullable(),
        createdBy: yup
            .string()
            .typeError('Created by must be a string')
            .required('Created by is required'),
    }),
})

module.exports = {
    uploadFileSchema,
    createFolderSchema,
    updateFileSchema,
}
