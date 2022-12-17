const axios = require('axios')
const { successResponse, errorResponse } = require(`${__base}helpers`)
const jsonToSoap = require('./jsonToSoap')
const formatReponse = require('./formatResponse')
const formatError = require('./formatError')

const url =
  'http://www.estes-express.com/imageretrieval/services/ImageViewService?wsdl'

const headers = {
    'Content-Type': 'text/xml;charset=UTF-8',
    SOAPAction: 'http://ws.estesexpress.com/imageview',
  }

const estesDocumentService = async (dataObj) => {

    try{
        const xml = await jsonToSoap(dataObj)
        const { data } = await axios.post(url, xml, { headers: headers })
    
        if (data) {
          const response = formatReponse(data)
          if(response?.error){
            return errorResponse(response.message)
          }else{
            return successResponse(response.data)
          }
        }
        return errorResponse('Could not get response from Estes document', 500)
    }catch(err){
        const error = formatError(err?.response?.data)
        return errorResponse(error ? error : 'Could not get response from Estes')
    }
}

module.exports = estesDocumentService;