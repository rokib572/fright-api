const auth = require(`${__base}utils/auth`)
const { errorResponse } = require(`${__base}helpers`)
const clientRepo = require('../../database/repo/client/clientRepo')
const logger = require(`${__base}/utils/logger`)
const validate = require(`${__base}utils/validate`)
const getUtcTime = require(`${__base}utils/getUTCTime`)

const {
  clientCreateSchema,
  clientUpdateSchema,
  createClientAccountingSchema
} = require('./clientSchemaValidation')

const clients = async (app) => {
  //Clients insert

  app.post(
    '/api/clients',
    auth,
    validate(clientCreateSchema),
    async (req, res) => {
      const clientsObj = req.body
      clientsObj.createdBy = req.userId
      clientsObj.modifiedBy = req.userId
      try {
        var response = await clientRepo.saveClient(clientsObj)

        return res.status(response.statusCode).send(response)
      } catch (err) {
        logger.error('DB Error in post Clients function, error ->>', err)
        return res
          .status(500)
          .send(errorResponse('Something went wrong in server', 500))
      }
    }
  )
  //Client Get
  app.get('/api/clients', auth, async (req, res) => {
    const column = [
      'cl.id as clientId',
      'cl.clientSince',
      'cl.credit',
      'cl.paymentTerms',
      'cl.creditLimit',
      'cl.entityId',
      'cl.parentLocation',
      'cl.salesperson',
      'cl.identificationNumber',
      'cl.division',
      'cl.paperworkRequired',
      'cl.paperworkTypes',
      'loc.id as locationsId',
      'loc.companyName',
      'loc.companyAddress1',
      'loc.companyAddress2',
      'loc.companyCity',
      'loc.companyProvince',
      'loc.companyPostalCode',
      'loc.companyCountry',
      'loc.latitude',
      'loc.longitude',
      'loc.zoneCode',
      'loc.isSFS',
      'loc.timeZone',
    ]
    let page = req.query.page
    if (!page) {
      try {
        const response = await clientRepo.getAllClients(column)
        return res.status(response.statusCode).send(response)
      } catch (err) {
        logger.error('Error on Client get method-->>', err)
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
        const response = await clientRepo.getAllClients(column, page, limit)

        return res.status(200).send(response)
      } catch (err) {
        logger.error('Error on Client get method-->>', err)
        return errorResponse(err.message)
      }
    }
  })

  //Get client by id
  app.get('/api/clients/:id', async (req, res) => {
    const { id } = req.params
    try {
      const response = await clientRepo.getClientById(id)
      return res.status(response.statusCode).send(response)
    } catch (err) {
      logger.error('Error by client get by id-->>', err)
      return errorResponse(err.message)
    }
  })
  //Update client
  app.patch(
    '/api/clients/:id',
    auth,
    validate(clientUpdateSchema),
    async (req, res) => {
      const { id } = req.params
      let data = req.body
      data.clientSince = getUtcTime(data.clientSince)
      data.modifiedBy = req.userId
      let where = {
        where: {
          id,
          blackListed: 0,
        },
      }
      const response = await clientRepo.clientUpdate(where, data)
      return res.status(response.statusCode).send(response)
    }
  )

  //Client delete api
  app.delete('/api/clients/:id', auth, async (req, res) => {
    const { id } = req.params

    let where = {
      where: {
        id,
        blackListed: 0,
      },
    }
    let data = {
      blackListed: 1,
    }
    const response = await clientRepo.clientDelete(where, data)
    return res.status(response.statusCode).send(response)
  })

//clients accounting Insert

app.post(
  '/api/clients/:id/accounting',
  auth,
  validate(createClientAccountingSchema),
  async (req, res) => {   
    try {
      let clientsAccountingObj = req.body;
      clientsAccountingObj.clientsId = req.params.id;
      var response = await clientRepo.saveClientsAccounting(clientsAccountingObj);
      return res.status(response.statusCode).send(response)
    } catch (err) {
      logger.error('Error in post Clients Accounting function, error ->>', err)
      return res
        .status(500)
        .send(errorResponse('Something went wrong in server', 500))
    }
  }
)


}

module.exports = clients
