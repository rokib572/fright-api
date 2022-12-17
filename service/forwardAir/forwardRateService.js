const axios = require('axios')
const forwardAirPayload = require('./forwardAirPayload')
const formatReponse = require('./formatResponse')
const { successResponse, errorResponse } = require(`${__base}helpers`)
const xmlToJson = require('./xmlJsonConverter')
const { getVendorsApi } = require('../getVenodrsApi')

const forwardRateService = async (dataObj) => {
  try {
    let vApi = await getVendorsApi('www.forwardair.com')

    const url = vApi.apiURL;
    const headers = {
      'user': vApi.userName,
      'password': vApi.password,
      'customerId': vApi.accountNumber,
      'Content-Type': 'application/xml',
      'Accept': 'application/xml'
    }

    const xml = forwardAirPayload(dataObj, vApi)
    const { data } = await axios.post(url, xml, { headers: headers })
    if (data) {
      const response = formatReponse(data)
      if(response.error){
        return errorResponse(response.error?.message, 500)
      }
      return successResponse(response.data)
    }
    return errorResponse('Could not get response from forward air', 500)
  } catch (error) {
    const err = getErrorMessage(error);
    let errResp = errorResponse(err.message, err.status);
    return errResp;
  }
}

const getErrorMessage =(error) =>{
  let err = {};
  if(error?.response?.data){
    const errorJson = xmlToJson({
      xml: error.response.data,
    })
    const errorResp = JSON.parse(errorJson);
    err.message = errorResp?.FAError?.ErrorMessage?.['_text'];
  }

  if(!err.message){
    err.message = error.message;
  }
  if(!err.status){
    err.status = error.status;
  }
  return err;
}

module.exports = forwardRateService
