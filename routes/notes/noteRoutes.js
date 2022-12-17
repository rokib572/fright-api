const validate = require(`${__base}utils/validate`)
const auth = require(`${__base}utils/auth`)
const noteRepo = require('../../database/repo/note/noteRepo')
const noteVendorRepo = require('../../database/repo/note/noteVendorRepo')
const { errorResponse } = require(`${__base}helpers`)
const { createNoteSchema, updateNoteSchema, updateNoteByVenIdSchema } = require('./noteValidate')
const { validate: isUUID } = require('uuid')

const noteRoutes = async (app) => {
  //post location info
  app.post('/api/contacts/:id/notes', auth, validate(createNoteSchema), async (req, res) => {
    try {
      const data = req.body
      data['contactsId'] = req.params.id
      data['createdBy'] = req.userId
      const result = await noteRepo.saveNote(data)
      return res.status(result.statusCode).send(result)
    } catch (error) {
      return res.status(error.statusCode).send(error)
    }
  })

  //update note by noteId
  app.patch('/api/notes/:id', auth, validate(updateNoteSchema), async (req, res) => {
    try {
      const data = req.body
      const noteId = req.params.id
      const result = await noteRepo.updateNoteById(noteId, data)
      return res.status(result.statusCode).send(result)
    } catch (error) {
      return res.status(error.statusCode).send(error)
    }
  })

  // delete note by contactId and noteId
  app.delete('/api/contacts/:id/notes/:notesId', auth, async (req, res) => {
    try {
      const contactId = req.params.id
      const notesId = req.params.notesId
      if (!isUUID(contactId)) {
        return res.status(400).send(errorResponse('contactId should be UUID', 400))
      }
      if (!Number.isInteger(Number(notesId))) {
        return res.status(400).send(errorResponse('notesId should be number', 400))
      }
      const result = await noteRepo.deleteNoteByContactId(contactId, notesId)
      return res.status(result.statusCode).send(result)
    } catch (error) {
      return res.status(error.statusCode).send(error)
    }
  })

  //post note by vendorId
  app.post('/api/vendors/:id/notes', auth, validate(createNoteSchema), async (req, res) => {
    try {
      const data = req.body
      data['vendorId'] = req.params.id
      data['createdBy'] = req.userId
      data['modifiedBy'] = req.userId
      const result = await noteVendorRepo.saveNote(data)
      return res.status(result.statusCode).send(result)
    } catch (error) {
      return res.status(error.statusCode).send(error)
    }
  })

   //get note by vendorId
   app.get('/api/vendors/:id/notes', auth, async (req, res) => {
    try {
      const vendorId = req.params.id
      const result = await noteVendorRepo.getNotesByVendorId(vendorId)
      return res.status(result.statusCode).send(result)
    } catch (error) {
      return res.status(error.statusCode).send(error)
    }
  })

  //update note by noteId
  app.patch('/api/vendors/:id/notes/:noteId', auth, validate(updateNoteByVenIdSchema), async (req, res) => {
    try {
      const data = req.body
      data['modifiedBy'] = req.userId
      const vendorId = req.params.id
      const noteId = req.params.noteId
      const result = await noteVendorRepo.updateNoteByVendorId(vendorId, noteId, data)
      return res.status(result.statusCode).send(result)
    } catch (error) {
      return res.status(error.statusCode).send(error)
    }
  })


  // delete note by vendorsId and noteId
  app.delete('/api/vendors/:id/notes/:notesId', auth, async (req, res) => {
    try {
      const vendorId = req.params.id
      const notesId = req.params.notesId
      if (!isUUID(vendorId)) {
        return res.status(400).send(errorResponse('vendorId should be UUID', 400))
      }
      if (!Number.isInteger(Number(notesId))) {
        return res.status(400).send(errorResponse('notesId should be number', 400))
      }
      const result = await noteVendorRepo.deleteNoteByVendorId(vendorId, notesId)
      return res.status(result.statusCode).send(result)
    } catch (error) {
      return res.status(error.statusCode).send(error)
    }
  })


}

module.exports = noteRoutes
