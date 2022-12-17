const { successResponse, errorResponse } = require(`${__base}helpers`)
let XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
const { default: axios } = require('axios')
const daylightPayload = require('./daylightPayload')
const { getVendorsApi } = require('../getVenodrsApi')
const { SERVICE_LEVEL_STANDARD, SERVICE_LEVEL_GUARANTEED } = require('../../utils/serviceLevels')

const daylightAuth = (vApi) => {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.withCredentials = true
    const data = `client_id=${vApi.apiKey}&client_secret=${vApi.apiSecret}`
    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        resolve(JSON.parse(this.responseText).access_token)
      }
    })

    xhr.open(
      'POST',
      'https://api.dylt.com/oauth/client_credential/accesstoken?grant_type=client_credentials'
    )
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.send(data)
  })
}

const getQuoteByServiceType = async (
  rateQuoteUrl,
  dataObj,
  serviceType,
  headers
) => {
  try {
    dataObj.dyltRateQuoteReq.serviceType = serviceType

    const { data } = await axios.post(rateQuoteUrl, dataObj, {
      headers: headers,
    })
    if (data && data.dyltRateQuoteResp) {
      const response = data.dyltRateQuoteResp
      if (response.success == 'NO') {
        return { error: response?.errorInformation?.errorMessage }
      } else {
        let dayDiff = undefined

        if (response.quoteDate && response.earliestDeliveryDate) {
          let quoteDate = new Date(response.quoteDate).getTime()
          let deliveryDate = new Date(response.earliestDeliveryDate).getTime()

          const day = 24 * 60 * 60 * 1000
          dayDiff = Math.abs(deliveryDate - quoteDate) / day
        }

        let service = {}
        service.quoteID = response?.quoteNumber ?? ''
        service.totalRate = parseFloat(
          response?.totalCharges?.netCharge
        ).toFixed(2)
        service.serviceLevel =
          serviceType == 'LTL' ? SERVICE_LEVEL_STANDARD : SERVICE_LEVEL_GUARANTEED
        service.transitTime = dayDiff ? dayDiff + ' days' : undefined
        return service
      }
    }

    return { error: 'Could not get response from daylight' }
  } catch (error) {
    return { error: error.message }
  }
}

const daylightService = async (dataInput) => {
  try {
    let vApi = await getVendorsApi('www.dylt.com')

    const url = vApi.apiURL
    let dataObj = daylightPayload(dataInput, vApi)
    const authToken = await daylightAuth(vApi)

    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${authToken}`,
    }

    const [ltlData, ucData] = await Promise.all([
      getQuoteByServiceType(url, dataObj, 'LTL', headers),
      getQuoteByServiceType(url, dataObj, 'UC', headers),
    ])

    let response = []
    if (ltlData && !ltlData.error) {
      response.push(ltlData)
    }

    if (ucData && !ucData.error) {
      response.push(ucData)
    }

    if (response.length > 0) {
      return successResponse(response)
    } else if (ltlData.error) {
      return errorResponse(ltlData.error)
    } else if (ucData.error) {
      return errorResponse(ucData.error)
    }

    return errorResponse('Could not get response from daylight', 500)
  } catch (error) {
    return errorResponse(error.message)
  }
}

module.exports = { daylightService, daylightAuth }
