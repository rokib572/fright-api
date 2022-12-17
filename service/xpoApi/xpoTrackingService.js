const axios = require('axios')
const { successResponse, errorResponse } = require(`${__base}helpers`)
const { getVendorsApi } = require('../getVenodrsApi')
const { xpoAuth } = require('./xpoService')

const getErrorMessage = (error) => {
    let err = {}
    if (error?.response?.data) {
        err.message = error.response.data?.error?.message
        err.status = error.response.data?.code
    }

    if (!err.message) {
        err.message = error.message
    }
    if (!err.status) {
        err.status = error.status
    }
    return err
}

const xpoTrackingService = async (dataObject) => {
    try {
        let vApi = await getVendorsApi('www.xpo.com')
        const authToken = await xpoAuth(vApi)
        const url = `https://api.ltl.xpo.com/tracking/1.0/shipments/shipment-status-details?referenceNumbers=${dataObject?.requestID}`
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
        }
        const { data } = await axios.post(url, { headers: headers })
        if (data) {
            return successResponse({ data: data })
        }

        return errorResponse('Could not get response from xpo', 500)
    } catch (error) {
        return successResponse({ err: error?.response?.data })
        const err = getErrorMessage(error)
        return errorResponse(err.message, err.status)
    }
}
module.exports = xpoTrackingService
