// Validation Schema
const yup = require('yup')
const { validate: isUUID } = require('uuid')

const createNoteSchema = yup.object({
  body: yup.object({
    notes: yup
      .string()
      .required('notes is required')
      .max(255, 'notes should be less than 255 characters')
      .trim(),
  }),
  params: yup.object({
    id: yup
      .string()
      .required('id(contactsId) is required')
      .test('contactsId', 'contactsId must be uuid', (value) => isUUID(value)),
  }),
})

const updateNoteSchema = yup.object({
  body: yup.object({
    notes: yup
      .string()
      .required('notes is required')
      .max(255, 'notes should be less than 255 characters')
      .trim(),
  }),
  params: yup.object({
    id: yup.number().typeError('notesId should be number'),
  }),
})

const updateNoteByVenIdSchema = yup.object({
  body: yup.object({
    notes: yup
      .string()
      .required('notes is required')
      .max(255, 'notes should be less than 255 characters')
      .trim(),
  }),
  params: yup.object({
    id: yup
      .string()
      .required('id(vendorsId) is required')
      .test('vendorsId', 'vendorsId must be uuid', (value) => isUUID(value)),
    noteId: yup.number().typeError('notesId should be number'),
  }),
})

module.exports = {
  createNoteSchema,
  updateNoteSchema,
  updateNoteByVenIdSchema,
}
