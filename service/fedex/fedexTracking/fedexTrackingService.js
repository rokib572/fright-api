const { default: axios } = require('axios')
const { successResponse, errorResponse } = require(`${__base}helpers`)
const { fedexAuth } = require('../fedexService')
const { fedexTrackingPayload } = require('./fedexTrackingPayload')

const fedexTrackingService = async (dataInput) => {
    try {
        let dataObj = fedexTrackingPayload(dataInput)

        const url =
            'https://apis-sandbox.fedex.com/track/v1/associatedshipments'
        const authToken = await fedexAuth()
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        }

        const { data } = await axios.post(url, dataObj, { headers: headers })

        // return successResponse(data)
        if (data) {
            const error =
                data.output.completeTrackResults[0].trackResults[0].error
            console.log(error)
            if (error) {
                return errorResponse(error.message)
            }
            return successResponse('coming soon......')
        } else {
            return errorResponse('Could not get response from fedex', 500)
        }
    } catch (error) {
        // console.log(error.response.data)
        return errorResponse(error.response.data.errors[0].message)
    }
}

module.exports = { fedexTrackingService }
