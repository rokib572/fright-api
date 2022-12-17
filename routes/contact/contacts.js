const auth = require(`${__base}utils/auth`)
const { errorResponse } = require(`${__base}helpers`)
const contactRepo = require('../../database/repo/contact/contactRepo')
const logger = require(`${__base}/utils/logger`)
const validate = require(`${__base}utils/validate`)

const {
  contactCreateSchema,
  contactUpdateSchema,
} = require('./contactValidationSchema')
const contacts = async (app) => {
  //Contacts insert method

  app.post(
    '/api/contacts',
    validate(contactCreateSchema),
    auth,
    async (req, res) => {
      const contactObj = req.body
      contactObj.createdBy = req.userId
      contactObj.modifiedBy = req.userId
      try {
        var response = await contactRepo.saveContact(contactObj)

        return res.status(response.statusCode).send(response)
      } catch (err) {
        logger.error('Error in post Contacts function, error ->>', err)
        return res
          .status(500)
          .send(errorResponse('Something went wrong in server', 500))
      }
    }
  )

  // //Contacts get method

  app.get('/api/contacts', auth, async (req, res) => {
    let page = req.query.page
    if (!page) {
      try {
        const response = await contactRepo.getContacts()
        return res.status(response.statusCode).send(response)
      } catch (err) {
        logger.error('Error on Contacts get method-->>', err)
        return errorResponse(err.message)
      }
    } else {
      try {
        if (!Number.isInteger(parseInt(page))) {
          return res.status(400).json({
            statusCode: '400',
            status: 'error',
            error: 'Page Number Is Not Valid',
          })
        }
        if (page === '0') {
          page = '1'
        }
        let limit = 10
        const response = await contactRepo.getContacts(page, limit)

        return res.status(200).send(response)
      } catch (err) {
        logger.error('Error on Contacts get all method-->>', err)
        return errorResponse(err.message)
      }
    }
  })

  //Get contacts by id

  app.get('/api/contacts/:id', auth, async (req, res) => {
    const { id } = req.params
    const response = await contactRepo.getContactById(id)
    return res.status(response.statusCode).send(response)
  })

  //contact Update
  app.patch(
    '/api/contacts/:id',
    auth,
    validate(contactUpdateSchema),
    async (req, res) => {
      const { id } = req.params
      let data = req.body
      data.modifiedBy = req.userId
      const response = await contactRepo.contactUpdate(id, data)
      return res.status(response.statusCode).send(response)
    }
  )
  //contact Delete
  app.delete('/api/contacts/:id', auth, async (req, res) => {
    const { id } = req.params

    let where = {
      where: {
        id,
        isDeleted: 0,
      },
    }
    let data = {
      isDeleted: 1,
    }
    const response = await contactRepo.contactDelete(where, data)
    return res.status(response.statusCode).send(response)
  })
}

module.exports = contacts
