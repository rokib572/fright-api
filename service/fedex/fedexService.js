let XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
const { successResponse, errorResponse } = require(`${__base}helpers`)

const { default: axios } = require('axios')
const getUtcTime = require('../../utils/getUTCTime')
const { getVendorsApi } = require('../getVenodrsApi')
const { fedexPayload } = require('./fedexPayload')

const fedexAuth = async () => {
  let vApi = await getVendorsApi('www.fedex.com')
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.withCredentials = true
    const data = `grant_type=client_credentials&client_id=${vApi.apiKey}&client_secret=${vApi.apiSecret}`
    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        resolve(JSON.parse(this.responseText).access_token)
      }
    })

    xhr.open('POST', 'https://apis-sandbox.fedex.com/oauth/token')
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.send(data)
  })
}

const fedexService = async (dataInput) => {
  try {
    let vApi = await getVendorsApi('www.fedex.com')
    dataInput.vApi = vApi
    let dataObj = fedexPayload(dataInput)
    const url = vApi.apiURL
    const authToken = await fedexAuth()
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    }

    const { data } = await axios.post(url, dataObj, { headers: headers })

    if (data) {
      const fedexService = new Array()
      for (var da in data.output.rateReplyDetails) {
        let service = {}
        service.quoteID =
          data.output.rateReplyDetails[da].serviceDescription.serviceId
        service.totalRate = parseFloat(
          data.output.rateReplyDetails[da].ratedShipmentDetails[0]
            .totalNetCharge
        ).toFixed(2)
        service.serviceLevel = data.output.rateReplyDetails[da].serviceName
        let quoteDate = getUtcTime(data.output.quoteDate)
        if (data.output.rateReplyDetails[da].commit.dateDetail) {
          let deliveryDate = getUtcTime(
            data.output.rateReplyDetails[da].commit.dateDetail.dayFormat
          )
          let transitTime = getNumberOfDays(quoteDate, deliveryDate)
          service.transitTime = transitTime + ' Days'
        } else {
          service.transitTime =
            data.output.rateReplyDetails[da].commit.commitMessageDetails
        }
        fedexService.push(service)
      }
      return successResponse(fedexService)
    } else {
      return errorResponse('Could not get response from fedex', 500)
    }
  } catch (error) {
    // console.log(error.response.data)
    return errorResponse(error.response.data.errors[0].message)
  }
}

function getNumberOfDays(quoteDate, deliveryDate) {
  quoteDate = new Date(quoteDate)
  deliveryDate = new Date(deliveryDate)

  // One day in milliseconds
  const oneDay = 1000 * 60 * 60 * 24

  // Calculating the time difference between two dates
  const diffInTime = deliveryDate.getTime() - quoteDate.getTime()

  // Calculating the no. of days between two dates
  const diffInDays = Math.round(diffInTime / oneDay)
  return diffInDays
}

module.exports = { fedexService, fedexAuth }
