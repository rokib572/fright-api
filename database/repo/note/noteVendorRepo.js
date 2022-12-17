const logger = require(`${__base}/utils/logger`)
const { successResponse, errorResponse } = require(`${__base}helpers`)
const vendorsNotes = require('../../models/vendorsNotes')
const vendors = require('../../models/vendors')
const DateTime = require('../../../utils/DateTime')

const saveNote = async (data) => {
  try {
    const vendor = await vendors.get({
      columns: ['id', 'blackListed'],
      where: {
        id: data.vendorId,
        blackListed: 0,
      },
    })
    if (vendor.length == 0) {
      return errorResponse("vendorId doesn't exist", 400)
    }
    const noteObj = {
      vendorsId: data.vendorId,
      note: data.notes,
      createdBy: data.createdBy,
      modifiedBy: data.modifiedBy,
      modifiedDate: DateTime.getCurrentTime(),
    }
    await vendorsNotes.save(noteObj)
    return successResponse('Note created successfully')
  } catch (err) {
    logger.error('Error on saveNote Function err=>', err)
    return errorResponse('Something went wrong in server', 500)
  }
}

// get all notes by contact id
const getNotesByVendorId = async (vendorId) => {
  try {
    const vendor = await vendors.get({
      where: {
        id: vendorId,
        blackListed: 0,
      },
    })
    if (vendor.length == 0) {
      return errorResponse("vendorId doesn't exist", 400)
    }
    const result = await vendorsNotes.get({
      columns: ['id', 'vendorsId', 'note'],
      where: {
        vendorsId: vendorId,
      },
    })
    return successResponse(result)
  } catch (err) {
    logger.error('Error on getNotesByVendorId Function err=>', err)
    return errorResponse('Something went wrong in server', 500)
  }
}

// update note by contactId and noteId
const updateNoteByVendorId = async (vendorId, noteId, data) => {
  try {
    const vendor = await vendors.get({
      where: {
        id: vendorId,
        blackListed: 0,
      },
    })
    if (vendor.length == 0) {
      return errorResponse("vendorId doesn't exist", 400)
    }

    const noteObj = {
      note: data.notes,
      modifiedBy: data.modifiedBy,
      modifiedDate: DateTime.getCurrentTime(),
    }
    const result = await vendorsNotes.update(noteObj, {
      where: {
        id: noteId,
        vendorsId: vendorId,
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

//delete note by contactId and noteId
const deleteNoteByVendorId = async (vendorId, noteId) => {
  try {
    const contact = await vendors.get({
      where: {
        id: vendorId,
        isDeletblackListeded: 0,
      },
    })
    if (contact.length == 0) {
      return errorResponse("vendorId doesn't exist", 400)
    }
    const result = await vendorsNotes.delete({
      where: {
        id: noteId,
        vendorsId: vendorId,
      },
    })

    if (result == 0) {
      return errorResponse('Delete note failed')
    }
    return successResponse('Note deleted successfully')
  } catch (err) {
    logger.error('Error on deleteNoteByVendorId Function err=>', err)
    return errorResponse('Something went wrong in server', 500)
  }
}

module.exports = {
  saveNote,
  updateNoteByVendorId,
  getNotesByVendorId,
  deleteNoteByVendorId,
}
