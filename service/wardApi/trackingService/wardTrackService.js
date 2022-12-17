var convert = require('xml-js')
const { successResponse, errorResponse } = require(`${__base}helpers`)
const { default: axios } = require('axios')

const wardTrackPayload = require('./wardTrackPayload')
const { wardRateUrl, wardRateTrackingUrl } = require('../../../utils/urlLink')
const { getVendorsApi } = require('../../getVenodrsApi')

const wardTrackService = async (dataInput) => {
    try {
        const headers = {
            'Content-Type': 'text/xml;charset=UTF-8',
        }

        const vApi = await getVendorsApi(wardRateUrl)
        // dataInput.vApi = vApi
        const xml = wardTrackPayload(dataInput, vApi)
        const url = wardRateTrackingUrl
        const { data } = await axios.post(url, xml, { headers: headers })
        // let response = xmlToJson(data)

        let res = xmlToJson(data)
        return res
    } catch (error) {
        return errorResponse(error.message)
    }
}

const xmlToJson = (data) => {
    let dataXmlToJSON = convert.xml2json(data, {
        compact: true,
        spaces: 4,
    })

    const result = JSON.parse(dataXmlToJSON)
    let isCheck = false
    const {
        FreightBill: { _text: freightBill },
        Status: { _text: status },
        pupType: { _text: pupType },
        dlpType: { _text: dlpType },
    } = result.Body.CreateResponse.CreateResult
    const response = {}

    if (pupType) {
        response.FreightBill = freightBill
        response.Status = status
        response.pupType = pupType
        response.dlpType = dlpType
        isCheck = true
    }
    let res = isCheck ? successResponse(response) : errorResponse(status)
    return res
}

module.exports = wardTrackService
