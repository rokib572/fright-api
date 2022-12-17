const { default: axios } = require('axios')
const { successResponse, errorResponse } = require('../../../helpers')
const { getVendorsApi } = require('../../getVenodrsApi')
const { daylightAuth } = require('../daylightService')
var fs = require('fs')
const Path = require('path')
const daylightDocumentTrackingService = async (trackingNumber, doc_type) => {
  try {
    let vApi = await getVendorsApi('www.dylt.com')

    const url = `https://api.dylt.com/image/${trackingNumber}/${doc_type}?userName=${vApi.userName}&password=${vApi.password}`
    // const path = Path.resolve(__dirname, `${trackingNumber}.pdf`)
    // const writer = fs.createWriteStream(path)
    const authToken = await daylightAuth(vApi)
    const headers = {
      Authorization: `Bearer ${authToken}`,
    }
    const result = await axios.get(url, {
      responseType: 'blob',
      headers: headers,
    })
    // result.data.pipe(writer)
    // // let view = new Uint8Array(result.data)
    // const base64PDF = fs.readFileSync(result.data, { encoding: 'base64' })

    // let res = result.data.externalTraceResp.message
    //   ? errorResponse(result.data.externalTraceResp.message)
    //   : successResponse(result.data.externalTraceResp)
    return successResponse(result.data)
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = daylightDocumentTrackingService
