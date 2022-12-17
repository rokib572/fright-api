const contactsProfile = require('../../models/contactsProfile')
const { generateUUID } = require(`${__base}service/authService`)
const { successResponse, errorResponse } = require(`${__base}helpers`)
const logger = require(`${__base}/utils/logger`)
const getUtcTime = require(`${__base}utils/getUTCTime`)

const saveContactsProfile = async (data) => {
  try {
    const {
      contactsId,
      birthDate,
      partnerAnniversary,
      hasPartner,
      hasKids,
      hasPets,
      workAnniversary,
      contactOwner,
      department,
      modifiedBy,
    } = data
    const contactProfileObj = {}
    contactProfileObj.contactsId = contactsId
    contactProfileObj.birthDate = getUtcTime(birthDate)
    contactProfileObj.partnerAnniversary = getUtcTime(partnerAnniversary)
    contactProfileObj.hasPartner = hasPartner
    contactProfileObj.hasKids = hasKids
    contactProfileObj.hasPets = hasPets
    contactProfileObj.workAnniversary = getUtcTime(workAnniversary)
    contactProfileObj.contactOwner = contactOwner
    contactProfileObj.department = department
    contactProfileObj.lastModifiedBy = modifiedBy
    contactProfileObj.lastModified = getUtcTime()

    await contactsProfile.save(contactProfileObj)
    return contactProfileObj
  } catch (err) {
    logger.error('Error in save contacts profile function-->', err)
    return errorResponse(err.message)
  }
}

//Get Contacts Profile Function

const getContactProfile = async (contactsId) => {
  try {
    let columns = [
      'id',
      'birthDate',
      'partnerAnniversary',
      'hasPartner',
      'hasKids',
      'hasPets',
      'workAnniversary',
      'contactOwner',
      'department',
    ]

    const result = await contactsProfile.get({
      where: {
        contactsId,
      },
      columns,
    })
    return result[0]
  } catch (err) {
    logger.error('Error in Get contacts profile function-->', err)
    return errorResponse(err.message, 500)
  }
}

module.exports = {
  saveContactsProfile,
  getContactProfile,
}
