const logger = require(`${__base}/utils/logger`)
const { successResponse, errorResponse } = require(`${__base}helpers`)
const contacts = require('../../models/contacts')
const usersLocation = require('../../models/usersLocation')
const contactsLocations = require('../../models/contactsLocations')
const customQuery = require('../../models/customQuery')

const saveLocationId = async (contactId, locationsId) => {
  try {
    const contact = await contacts.get({
      where: {
        id: contactId,
        isDeleted: 0,
      },
    })
    const location = await usersLocation.get({
      where: {
        id: locationsId,
        isDeleted: 0,
      },
    })

    if (contact.length == 0) {
      return errorResponse("ContactId doesn't exist", 400)
    }

    if (location.length == 0) {
      return errorResponse("LocationId doesn't exist", 400)
    }

    const result = await contactsLocations.get({
      where: {
        contactsId: contactId,
        locationsId: locationsId,
      },
    })

    if (result.length > 0) {
      return errorResponse('Contact already has this location')
    }
    const data = {
      contactsId: contactId,
      locationsId: locationsId,
    }
    await contactsLocations.save(data)
    return successResponse('LocationId saved successfully')
  } catch (err) {
    logger.error('Error on saveNote Function err=>', err)
    return errorResponse('Something went wrong in server', 500)
  }
}

const getLocationsByContactId = async (contactId) => {
  try {
    let sql = `SELECT contactsLocations.contactsId as contactsId, locations.id as locationId, 
    locations.companyName, locations.companyAddress1, locations.companyAddress2, locations.companyCity, locations.companyProvince, locations.companyPostalCode, locations.companyCountry, locations.timeZone, locations.isSFS, locations.zoneCode, locations.latitude, locations.longitude FROM contactsLocations INNER JOIN locations ON contactsLocations.locationsId = locations.id WHERE contactsLocations.contactsId = '${contactId}' AND locations.isDeleted = 0`

    const result = await customQuery.query(sql)
    return result
  } catch (err) {
    logger.error('Error on getAllLocationByContact Function err=>', err)
    return errorResponse('Something went wrong in server', 500)
  }
}

const deleteLocationsByContactId = async (contactId, locationsId) => {
  try {
    const location = await usersLocation.get({
      where: {
        id: locationsId,
        isDeleted: 0,
      },
    })
    if (location.length == 0) {
      return errorResponse("LocationId doesn't exist", 400)
    }
    const contact = await contacts.get({
      where: {
        id: contactId,
        isDeleted: 0,
      },
    })
    if (contact.length == 0) {
      return errorResponse("ContactId doesn't exist", 400)
    }
    
    const result = await contactsLocations.delete({
      where: {
        locationsId: locationsId,
        contactsId: contactId,
      },
    })
    if (result == 0) {
      return errorResponse("Delete location failed")
    }
    return successResponse('Location deleted successfully')
  } catch (err) {
    logger.error('Error on deleteLocationsByContactId Function err=>', err)
    return errorResponse('Something went wrong in server', 500)
  }
}

module.exports = {
  saveLocationId,
  getLocationsByContactId,
  deleteLocationsByContactId,
}
