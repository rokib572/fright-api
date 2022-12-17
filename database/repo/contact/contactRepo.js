const contact = require('../../models/contacts')
const contactProfileRepo = require('./contactProfileRepo')
const customQuery = require('../../models/customQuery')
const contactLocation = require('../../models/contactsLocations')
const { generateUUID } = require(`${__base}service/authService`)
const { successResponse, errorResponse } = require(`${__base}helpers`)
const logger = require(`${__base}/utils/logger`)
const getUtcTime = require(`${__base}utils/getUTCTime`)
const usersLocation = require('../../models/usersLocation')
const { getNotesByContactId } = require('../note/noteRepo')
const { getLocationsByContactId } = require('../location/contactLocationRepo')

//Add Contacts
const saveContact = async (data) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            createdBy,
            modifiedBy,
            locations,
        } = data

        const contactObj = {}
        let isEmailExists = false
        let isPhoneExists = false
        if (email.trim() !== '') {
            isEmailExists = await emailIsExists(email)
        }
        if (phone.trim() !== '') {
            isPhoneExists = await phoneIsExists(phone)
        }
        if (isEmailExists) {
            return errorResponse('Email is Already used')
        } else if (isPhoneExists) {
            return errorResponse('Phone is Already used')
        } else {
            contactObj.id = await generateUUID()
            contactObj.createdAt = getUtcTime()
            contactObj.lastModified = getUtcTime()
            contactObj.firstName = firstName
            contactObj.lastName = lastName
            contactObj.email = email
            contactObj.phone = phone
            contactObj.createdBy = createdBy
            contactObj.modifiedBy = modifiedBy

            let uniqueLocation = locations.filter((element, index) => {
                return locations.indexOf(element.trim()) === index
            })

            if (locations) {
                uniqueLocation.map(async (locationId) => {
                    let columns = ['id']
                    const locId = await usersLocation.get({
                        where: {
                            id: locationId,
                            isDeleted: 0,
                        },
                        columns,
                    })

                    if (locId.length > 0) {
                        let contactLocObj = {}
                        contactLocObj.contactsId = contactObj.id
                        contactLocObj.locationsId = locationId
                        await contactLocation.save(contactLocObj)
                    }
                })
            }
            await contact.save(contactObj)

            data.contactsId = contactObj.id

            contactObj.contactProfile =
                await contactProfileRepo.saveContactsProfile(data)

            return successResponse('Contacts Insertions Successfully')
        }
    } catch (err) {
        logger.error('Error in save contacts repo function-->', err)
        return errorResponse(err.message)
    }
}

//Updated contacts
const contactUpdate = async (id, data) => {
    try {
        let where = {
            where: {
                id,
                isDeleted: 0,
            },
        }
        const { firstName, lastName, email, phone, modifiedBy } = data
        const contactObj = {}

        const isContact = await findContactById(id)
        if (isContact) {
            const isEmailExists = await emailIsExists(email)
            const isPhoneExists = await phoneIsExists(phone)
            if (isEmailExists && isEmailExists !== id) {
                return errorResponse('Email is Already used')
            } else if (isPhoneExists && isPhoneExists !== id) {
                return errorResponse('Phone is Already used')
            } else {
                contactObj.lastModified = getUtcTime()
                contactObj.firstName = firstName
                contactObj.lastName = lastName
                contactObj.email = email
                contactObj.phone = phone
                contactObj.modifiedBy = modifiedBy

                await contact.update(contactObj, where)
                return successResponse('Contact updated successful')
            }
        } else {
            return errorResponse('Contact updated failed')
        }
    } catch (err) {
        logger.error('Error in update contacts function-->', err)
        return errorResponse(err.message)
    }
}

//Delete contacts
const contactDelete = async (where, data) => {
    try {
        let result = await contact.update(data, where)
        if (result) {
            return successResponse('Contact Deletion successfully')
        }
        return errorResponse('Contact Deletion Failed')
    } catch (err) {
        logger.error('Error in Contact delete repo function, error ->>', err)
        return errorResponse('Something went wrong in server', 500)
    }
}

//Get all contacts

const getContacts = async (page, limit) => {
    let sql = `SELECT cs.id as contactsId, firstName, lastName, email,phone, Z.locationId
  , ls.companyName, ls.companyAddress1, ls.companyAddress2, ls.companyCity,ls.companyCountry, ls.latitude, ls.longitude, ls.isSFS
  FROM
  (SELECT T.cid as tcid, T.clcid as tclcid, cls.locationsId as locationId FROM
  (SELECT min(cl.id) as cid, cs.id as  clcid FROM contacts as cs
  LEFT JOIN contactsLocations as cl on cl.contactsId = cs.id 
  GROUP BY cl.contactsId, cs.id ) as T
  LEFT JOIN contactsLocations as cls on cls.id = T.cid) as Z
  LEFT JOIN contacts as cs on Z.tclcid = cs.id
  LEFT JOIN (SELECT * FROM locations as l WHERE l.isDeleted=0 ) as ls on ls.id = Z.locationId
  WHERE cs.isDeleted = 0 
  ORDER BY cs.lastName ASC `
    try {
        if (page) {
            sql += `  LIMIT ${limit} OFFSET ${(page - 1) * limit} `
        }

        const result = await customQuery.query(sql)

        if (result.length === 0) {
            return errorResponse('Contacts Not Found')
        }
        const response = {
            statusCode: 200,
            status: 'success',
        }

        let contacts = new Array()
        let locations = new Array()
        for (let i = 0; i < result.length; i++) {
            let contact = {}
            let location = {}
            contact.id = result[i].contactsId
            contact.firstName = result[i].firstName
            contact.lastName = result[i].lastName
            contact.email = result[i].email
            contact.phone = result[i].phone
            contacts.push(contact)
            location.companyName = result[i].companyName
            location.companyAddress1 = result[i].companyAddress1
            location.companyAddress2 = result[i].companyAddress2
            location.companyCity = result[i].companyCity
            location.companyProvince = result[i].companyProvince
            location.companyPostalCode = result[i].companyPostalCode
            location.companyCountry = result[i].companyCountry
            location.timeZone = result[i].timeZone
            location.isSFS = result[i].isSFS
            location.zoneCode = result[i].zoneCode
            location.latitude = result[i].latitude
            location.longitude = result[i].longitude
            locations.push(location)
            if (location.companyName === null) {
                contacts[i].locations = {}
            } else {
                contacts[i].locations = locations[i]
            }
        }
        response.page = page ? page : 1
        response.limit = page
            ? `${(page - 1) * limit + 1}-${page * limit}`
            : `1-${contacts.length}`
        response.result = contacts

        return response
    } catch (error) {
        logger.error('Error in get all contacts function--->', error)
        return errorResponse(error.message, 500)
    }
}

//Get contacts By Id
const getContactById = async (contactsId) => {
    let columns = ['firstName', 'lastName', 'email', 'phone']

    const response = await contact.get({
        where: {
            id: contactsId,
            isDeleted: 0,
        },
        columns,
    })
    if (response.length > 0) {
        response[0].locations = await getLocationsByContactId(contactsId)
        response[0].profile = await contactProfileRepo.getContactProfile(
            contactsId
        )
        response[0].notes = await getNotesByContactId(contactsId)

        return successResponse(response)
    } else {
        return errorResponse('Contacts Not Found')
    }
}

//Email unique check

const emailIsExists = async (email) => {
    let where = {
        email: email,
    }

    const isExists = await contact.get({ where })

    if (isExists.length > 0) {
        return isExists[0].id
    }
    return false
}

//phone unique check

const phoneIsExists = async (phone) => {
    let where = {
        phone: phone,
    }

    const isExists = await contact.get({ where })

    if (isExists.length > 0) {
        return isExists[0].id
    }
    return false
}

const findContactById = async (id) => {
    const response = await contact.get({
        where: {
            id,
            isDeleted: 0,
        },
    })
    if (response.length > 0) {
        return true
    }
    return false
}

module.exports = {
    saveContact,
    contactUpdate,
    contactDelete,
    getContacts,
    findContactById,
    getContactById,
}
