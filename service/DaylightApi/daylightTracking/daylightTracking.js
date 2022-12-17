const { getVendorsApi } = require('../../getVenodrsApi')

const { daylightAuth } = require('../daylightService')

const { default: axios } = require('axios')
const { successResponse, errorResponse } = require('../../../helpers')

const daylightTracking = async (trackingNumber) => {
  try {
    let vApi = await getVendorsApi('www.dylt.com')

    const url = `https://api.dylt.com/externalTrace/${trackingNumber}`
    const authToken = await daylightAuth(vApi)

    const headers = {
      Authorization: `Bearer ${authToken}`,
    }
    const result = await axios.get(url, {
      headers: headers,
    })

    let res = result.data.externalTraceResp.message
      ? errorResponse(result.data.externalTraceResp.message)
      : successResponse(result.data.externalTraceResp)
    return res
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = daylightTracking
