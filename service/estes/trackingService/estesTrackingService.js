const axios = require('axios')
const logger = require(`${__base}utils/logger`)
const {getVendorsApi} = require(`${__base}service/getVenodrsApi`)

const formatReponse = require('./formatResponse')
const formatError = require('./formatError')
const { getCatalogServiceTypeByLabel } = require('../../../database/repo/catalog/catalogServiceTypeRepo')
const { successResponse, errorResponse } = require(`${__base}helpers`)

const getBearerToken = async (estesCredentials) => {
  try {
    const session_url = 'https://cloudapi.estes-express.com/authenticate'
    
    const authToken = Buffer.from(`${estesCredentials.userName}:${estesCredentials.password}`, 'utf8').toString('base64')

    const headers = {
      Authorization: `Basic ${authToken}`,
      apikey: estesCredentials.apiKey
    }
    const { data } = await axios.post(session_url,{}, { headers: headers })
    if (data)  return data.token
    
    return false
  } catch (err) {
    const error = err.response.data
    logger.error("Error in getBearerToken_function")
    logger.error(error)
    return false;
  }
}

const estesTrackingService = async (dataObj) => {
  try {
    if(dataObj.requestID === undefined ||   dataObj.requestID === null) { 
      return errorResponse('requestID is required')
    }
    const estesCredentials = await getVendorsApi('www.estes-express.com')
    const bearerToken = await getBearerToken(estesCredentials)
    const url = 'https://cloudapi.estes-express.com/v1/shipments/history?pro='
    const headers = {
      apikey: estesCredentials.apiKey,
      Authorization: `Bearer ${bearerToken}`,
    }
    const dataUrl = `${url}${dataObj.requestID}`
    const { data } = await axios.get(dataUrl, { headers: headers })
    if (data) {
      let catalogServiceType = await getCatalogServiceTypeByLabel('Ground');
      const response = formatReponse(catalogServiceType?.id, data?.data?.[0])
      return successResponse(response)
    }
    return errorResponse('Could not get response from Estes shipping ')
  } catch (err) {
    const error = formatError(err?.response?.data)
    return errorResponse(error ? error : 'Could not get response from Estes')
  }
}

module.exports = estesTrackingService
