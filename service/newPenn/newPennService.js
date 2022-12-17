const axios = require('axios')
const newPennPayload = require('./newPennPayload')
const { successResponse, errorResponse } = require(`${__base}helpers`)
const formatResponse = require('./formatResponse')
const { getVendorsApi } = require('../getVenodrsApi')
const headers = {
  'Content-Type': 'text/xml',
  SOAPAction: 'quote',
}


const getQuoteByServiceType = async (rateQuoteUrl, soapXml, serviceType) => {
  try{

    soapXml = soapXml.replace('<quoteGuaranteedDelivery/>', serviceType == 'Standard' ? '' : '<quoteGuaranteedDelivery>GT3</quoteGuaranteedDelivery>');

    const { data } = await axios.post(rateQuoteUrl, soapXml, { headers: headers })
    if (data) {
      const resp = formatResponse(data, serviceType);
      if(resp?.error){
        return {error: resp.error};
      }else{
        return resp?.data;
      }
    }

    return {error: 'Could not get response from daylight'}

  } catch(error){
    return {error: error.message};
  }
}

const newPennService = async (dataObj) => {
    try {
      let vApi = await getVendorsApi('www.newpenn.com')
      const soapXml = newPennPayload(dataObj, vApi)

      const [standardData, guaranteedData] = await Promise.all([
        getQuoteByServiceType(vApi.apiURL, soapXml, 'Standard'), getQuoteByServiceType(vApi.apiURL, soapXml, 'Guaranteed')
      ]);

      let response = [];
      if(standardData && !standardData.error){
        response.push(standardData);
      }

      if(guaranteedData && !guaranteedData.error){
        response.push(guaranteedData);
      }

      if(response.length > 0){
        return successResponse(response);
      } else if(standardData.error){
        return errorResponse(standardData.error);
      } else if(guaranteedData.error){
        return errorResponse(guaranteedData.error);
      }

      return errorResponse('Could not get response from new penn', 500)
    } catch (error) {
      return errorResponse(error?.message, error?.status)
    }
}

module.exports = newPennService
