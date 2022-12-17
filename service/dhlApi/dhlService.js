const { successResponse, errorResponse } = require(`${__base}helpers`)
let XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
const { default: axios } = require('axios')
const dhlPayload = require('./dhlPayload')
const { getVendorsApi } = require('../getVenodrsApi')

const getErrorMessage = (error) => {
  let err = {}
  if (error?.response?.data) {
    err.message = error.response.data?.message
    err.detail = error.response.data?.detail
    err.status = error.response.data?.status
  }

  if (!err.message) {
    err.message = error.message
  }
  if (!err.status) {
    err.status = error.status
  }
  return err
}

const dhlService = async (dataInput) => {
  try {
    let vApi = await getVendorsApi('www.dhl.com')

    let dataObj = dhlPayload(dataInput, vApi)
    const url = vApi.apiURL
    var authToken = Buffer.from(vApi.apiKey + ':' + vApi.apiSecret).toString(
      'base64'
    )

    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Basic ${authToken}`,
    }

    const { data } = await axios.post(url, dataObj, { headers: headers })
    if (data) {
      let response = []
      ;(data?.products || []).map((product) => {
        let service = {}
        service.quoteID = ''
        service.totalRate = parseFloat(product?.totalPrice?.[0]?.price).toFixed(
          2
        )
        service.serviceLevel = product?.productName
        service.transitTime = product?.deliveryCapabilities?.totalTransitDays
          ? product?.deliveryCapabilities?.totalTransitDays + ' days'
          : undefined
        response.push(service)
      })

      return successResponse(response)
    }
    return errorResponse('Could not get response from dhl', 500)
  } catch (error) {
    const err = getErrorMessage(error)
    let errResp = errorResponse(err.message, err.status)
    if (err.detail) errResp.detail = err.detail

    return errResp
  }
}
module.exports = dhlService
