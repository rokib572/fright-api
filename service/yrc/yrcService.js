const axios = require('axios')
const fs = require('fs')
const url = 'https://api.yrc.com/node/api/ratequote'
const formatReponse = require('./formatResponse')
const { successResponse, errorResponse } = require(`${__base}helpers`)
const yrcPayload = require('./yrcPayload')
const logger = require('../../utils/logger')
const formatError = require('./formatError')
const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

const yrcService = async (dataObj) => {
  try {
    const payload = await yrcPayload(dataObj)
    // uncomment this to see what is being sent to yrc api [it will write to file]
    // fs.writeFileSync('service/yrc/request_body/req_payload.ignore.json', JSON.stringify(payload))
    const { data } = await axios.post(url, payload, { headers })
    if (data.isSuccess == true) {
      const result = data['pageRoot']['bodyMain']['rateQuote']
      if (result.quoteId && result.pickupDate && result.delivery.deliveryDate) {
        return successResponse(formatReponse(result))
      }
      return errorResponse("Can't get rate from YRC quote service ")
    }
    return errorResponse("Can't get rate from YRC quote service ")
  } catch (err) {
    const error = err.response.data.errors
    const customError = formatError(error)
    return errorResponse(
      customError ? customError : "Can't get rate from YRC quote service "
    )
  }
}

module.exports = yrcService
