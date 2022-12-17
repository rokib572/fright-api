const axios = require('axios')
const fs = require('fs')
const url =
  'https://www.estes-express.com/tools/rating/ratequote/v4.0/services/RateQuoteService?wsdl'
const jsonToSoap = require('./jsonToSoap')
const formatReponse = require('./formatResponse')
const formatError = require('./formatError')
const { successResponse, errorResponse } = require(`${__base}helpers`)

const headers = {
  'Content-Type': 'text/xml;charset=UTF-8',
  SOAPAction: 'http://ws.estesexpress.com/ratequote/getQuote',
}

const estesRateService = async (dataObj) => {
  try {
    const xml = await jsonToSoap(dataObj)
    // uncomment this to see what is being sent to estes api [it will write to file]
    // fs.writeFileSync('service/estes/request_body/req_payload.ignore.xml', xml)
    const { data } = await axios.post(url, xml, { headers: headers })

    if (data) {
      const response = formatReponse(data)
      return successResponse(response)
    }
    return errorResponse('Could not get response from Estes', 500)
  } catch (err) {
    if(err?.message){
      return errorResponse(err?.message, 500)  
    }
    const error = formatError(err?.response?.data)
    return errorResponse(error ? error : 'Could not get response from Estes')
  }
}

module.exports = estesRateService
