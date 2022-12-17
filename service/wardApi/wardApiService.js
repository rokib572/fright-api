var convert = require('xml-js')
const { successResponse, errorResponse } = require(`${__base}helpers`)
const { default: axios } = require('axios')
const getWeight = require('../../utils/getWeight')
const wardPayload = require('./wardPayload')
const { getVendorsApi } = require('../getVenodrsApi')
const { wardRateUrl } = require('../../utils/urlLink')

const wardService = async (dataInput) => {
    try {
        const headers = {
            'Content-Type': 'text/xml;charset=UTF-8',
        }

        const vApi = await getVendorsApi(wardRateUrl)
        // dataInput.vApi = vApi
        const xml = wardPayload(dataInput, vApi)
        const url = vApi.apiURL
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
    if (!result.Body.CreateResponse.CreateResult.error) {
        const response = result.Body.CreateResponse
        const res = new Array()
        for (let i in response) {
            let responseArray = {}
            let r = response.CreateResult
            responseArray.quotedId = r.QuoteID._text
            // let rate = r.RateDetails
            responseArray.totalRate = parseFloat(r.NetCharge._text).toFixed(2)
            responseArray.serviceLevel = 'Standard Service'
            responseArray.transitTime = r.OriginServiceCenter.TransitDays._text
            res.push(responseArray)
            if (Object.keys(r.Advertisement.GuaranteeAM).length > 0) {
                responseArray = {}
                responseArray.quotedId = r.QuoteID._text
                // let rate = r.RateDetails
                responseArray.totalRate = parseFloat(
                    r.Advertisement.GuaranteeAM._text
                ).toFixed(2)
                responseArray.serviceLevel = 'Guaranteed by Noon'
                responseArray.transitTime = 'Guaranteed by Noon'
                res.push(responseArray)
            }
            if (Object.keys(r.Advertisement.GuaranteePM).length > 0) {
                responseArray = {}
                responseArray.quotedId = r.QuoteID._text
                // let rate = r.RateDetails
                responseArray.totalRate = parseFloat(
                    r.Advertisement.GuaranteePM._text
                ).toFixed(2)
                responseArray.serviceLevel = 'Guaranteed by 3:00 PM'
                responseArray.transitTime = 'Guaranteed by 3:00 PM'
                res.push(responseArray)
            }
        }
        return successResponse(res)
    }
    return errorResponse(result.Body.CreateResponse.CreateResult.error._text)
}

module.exports = wardService
