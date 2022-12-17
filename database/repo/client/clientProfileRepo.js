const { generateUUID } = require('../../../service/authService')
const logger = require(`${__base}/utils/logger`)
const { successResponse, errorResponse } = require(`${__base}helpers`)
const client = require('../../models/clients')
const clientsAccounting = require('../../models/clientsAccounting')
//Create Client Profile Function
const createClientProfile = async (locationsId, userId) => {
  try {
    var clientObj = {}
    let clientId = generateUUID()

    clientObj['id'] = clientId
    clientObj['locationsId'] = locationsId
    clientObj['createdBy'] = userId
    clientObj['modifiedBy'] = userId
    client.save(clientObj)
    // clientsAccounting.save({
    //   clientId: clientId,
    // })
  } catch (err) {
    logger.log('Error in create_client_profile, error ->>', err.message)
  }
}

//verify Client  by locationId ends
const isClientExistsByLocationId = async (locationsId) => {
  let where = {
    locationsId: locationsId,
  }
  var response = await client.get({ where })
  return response
}

//get client by locationId
const getClientByLocationId = async (locationsId, functionRef) => {
  try {
    if(functionRef == 'single'){
      return await client.get({
        columns: ['id', 'locationsId', 'clientSince', 'credit', 'paymentTerms', 'creditLimit', 'entityId', 'parentLocation', 'salesperson', 'identificationNumber', 'identificationType', 'division', 'paperworkRequired', 'paperworkTypes', 'blackListed'],
        where: {
          locationsId: locationsId,
        },
      })
    }
    else{
      return await client.get({
        columns: ['id', 'locationsId', 'clientSince', 'credit', 'paymentTerms', 'creditLimit', 'entityId', 'parentLocation', 'salesperson', 'identificationNumber', 'identificationType', 'division', 'paperworkRequired', 'paperworkTypes'],
        where: {
          locationsId: locationsId,
          blackListed: 0,
        },
      })
    }
  } catch (err) {
    logger.log('Error in getClientByLocationId_function, error ->>', err.message)
    return errorResponse('Something went wrong in server', 500)
  }
}

module.exports = {
  createClientProfile,
  isClientExistsByLocationId,
  getClientByLocationId
}
