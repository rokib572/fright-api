const axios = require('axios')
const formatResponse = require('./formatResponse')
const { successResponse, errorResponse } = require(`${__base}helpers`)
const jpExpressPayload = require('./jpExpressPayload')
const { getVendorsApi } = require('../getVenodrsApi')

const jpExpressService = async (dataObj) => {
    try {
      let vApi = await getVendorsApi('www.myjpexpress.com')

      const url = vApi.apiURL
      const headers = {
          'Content-Type': 'application/soap+xml',
          SOAPAction: 'http://jpxpress.com/GetRates',
      }
      const soapXml = jpExpressPayload(dataObj, vApi)
      const { data } = await axios.post(url, soapXml, { headers: headers })
      if (data) {
        const response = formatResponse(data)
        if(response.error){
          return errorResponse(response.error, 500)
        }
        return successResponse(response?.data)
    }
    return errorResponse('Could not get response from jp express', 500)
  } catch (error) {
    return errorResponse(error?.message, error?.status)
  }
}

module.exports = jpExpressService
