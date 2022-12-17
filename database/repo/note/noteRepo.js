const logger = require(`${__base}/utils/logger`)
const { successResponse, errorResponse } = require(`${__base}helpers`)
const contactsNotes = require('../../models/contactsNotes')
const contacts = require('../../models/contacts')

//save vendor profile
const saveNote = async (data) => {
  try {
    const contact = await contacts.get({
      columns: ['id'],
      where: {
        id: data.contactsId,
        isDeleted: 0,
      },
    })
    if (contact.length == 0) {
      return errorResponse("contactsId doesn't exist", 400)
    }
    const noteObj = {
      contactsId: data.contactsId,
      notes: data.notes,
      createdBy: data.createdBy,
    }
    await contactsNotes.save(noteObj)
    return successResponse('Note created successfully')
  } catch (err) {
    logger.error('Error on saveNote Function err=>', err)
    return errorResponse('Something went wrong in server', 500)
  }
}

// update note by contactId and noteId
const updateNoteById = async (noteId, data) => {
  try {
    const noteObj = {
      notes: data.notes,
    }
    const result = await contactsNotes.update(noteObj, {
      where: {
        id: noteId,
      },
    })
    
    if(result == 0){
      return errorResponse("notesId doesn't exist", 400)
    }

    return successResponse('Note updated successfully')
  } catch (err) {
    logger.error('Error on updateNoteByContactId Function err=>', err)
    return errorResponse('Something went wrong in server', 500)
  }
}

// get all notes by contact id
const getNotesByContactId = async (contactId) => {
  try {
    const result = await contactsNotes.get({
      columns: ['id', 'contactsId', 'notes'],
      where: {
        contactsId: contactId,
      },
    })
    return result
  } catch (err) {
    logger.error('Error on getNotesByContactId Function err=>', err)
    throw new Error('Something went wrong in server')
  }
}

//delete note by contactId and noteId
const deleteNoteByContactId = async (contactId, noteId) => {
  try {
    const contact = await contacts.get({
      where: {
        id: contactId,
        isDeleted: 0,
      },
    })
    if (contact.length == 0) {
      return errorResponse("ContactsId doesn't exist", 400)
    }
    const result = await contactsNotes.delete({
      where: {
        id: noteId,
        contactsId: contactId,
      },
    })

    if (result == 0) {
      return errorResponse('Delete note failed')
    }
    return successResponse('Note deleted successfully')
  } catch (err) {
    logger.error('Error on deleteNoteByContactId Function err=>', err)
    return errorResponse('Something went wrong in server', 500)
  }
}

module.exports = {
  saveNote,
  updateNoteById,
  getNotesByContactId,
  deleteNoteByContactId,
}
