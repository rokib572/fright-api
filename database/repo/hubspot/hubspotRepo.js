const { generateUUID } = require(`${__base}service/authService`)

const moment = require('moment')
const logger = require(`${__base}/utils/logger`)
const contactModel = require('../../models/contacts')
const contactHubspotModel = require('../../models/contactsHubSpot')
const { default: axios } = require('axios')
const customQuery = require('../../models/customQuery')
const getHubSpot = async (createdBy) => {
  const limit = 100

  const archived = false

  try {
    let keepGoing = true
    let finalResponse = []
    let after = 0
    do {
      const responseHubSpot = await axios.get(
        `https://api.hubapi.com/crm/v3/objects/contacts?after=${after}&limit=${limit}&archived=${archived}&hapikey=${process.env.HUBSPOT_API_KEY}&properties=firstname&properties=lastname&properties=email&properties=is_client&properties=&properties=is_vendor&properties=previous_client_of&properties=do_not_contact&properties=phone&properties=sales_rep&properties=do_not_mail&properties=interested_services`
      )
      let json = responseHubSpot.data
      if (!json || json.length == 0) {
        keepGoing = false
      }

      await json.results.forEach(async (val) => {
        finalResponse.push(val)
      })
      if (!json.paging) {
        keepGoing = false
      } else {
        after = json.paging.next.after
      }
    } while (keepGoing)
    await finalResponse.forEach(async (val) => {
      try {
        let IsExsistscontacts = await customQuery(
          `SELECT id FROM contacts WHERE email=${val.properties.email} or phone=${val.properties.phone}`
        )
        if (!IsExsistscontacts) {
          let sqlContact = {}
          let contactId = await generateUUID()
          sqlContact.id = contactId
          sqlContact.createdBy = createdBy
          sqlContact.modifiedBy = createdBy
          sqlContact.firstName =
            val.properties.firstname == null ? '' : val.properties.firstname
          sqlContact.lastName =
            val.properties.lastname == null ? '' : val.properties.lastname
          sqlContact.email =
            val.properties.email == null ? '' : val.properties.email
          sqlContact.phone =
            val.properties.phone == null ? '' : val.properties.phone

          await contactModel.save(sqlContact)

          let sqlHubSpot = {}
          sqlHubSpot.idHubSpot = val.id
          sqlHubSpot.is_vendor = val.properties.is_vendor == 'Yes' ? 1 : 0
          sqlHubSpot.is_client = val.properties.is_client == 'Yes' ? 1 : 0
          sqlHubSpot.previous_client_of =
            val.properties.previous_client_of == null
              ? ''
              : val.properties.previous_client_of
          sqlHubSpot.do_not_contact =
            val.properties.do_not_contact == 'Yes' ? 1 : 0
          sqlHubSpot.do_not_mail = val.properties.do_not_mail == 'Yes' ? 1 : 0
          sqlHubSpot.sales_rep =
            val.properties.sales_rep == null ? '' : val.properties.sales_rep
          sqlHubSpot.interested_services =
            val.properties.interested_services == null
              ? ''
              : val.properties.interested_services
          sqlHubSpot.contactsId = contactId
          sqlHubSpot.hubspot_created = moment(val.createdAt).format()
          sqlHubSpot.hubspot_last_modified = moment(val.updatedAt).format()
          await contactHubspotModel.save(sqlHubSpot)
        } else {
          return
        }
      } catch (error) {
        console.error(error.message)
        logger.error(error.message)
      }
    })
    return finalResponse
  } catch (err) {
    err.message === 'HTTP request failed'
      ? logger.error(JSON.stringify(err.response, null, 2))
      : logger.error(err.message)
  }
}

module.exports = {
  getHubSpot,
}
