var convert = require('xml-js')

const { successResponse, errorResponse } = require(`${__base}helpers`)
const { default: axios } = require('axios')
const { getVendorsApi } = require('../../getVenodrsApi')
const {
    arcBestUrl,
    arcBestDocumentsTrackingUrl,
} = require('../../../utils/urlLink')

const arcBestDocumentsTracking = async (trackingNumber, docType) => {
    try {
        const vApi = await getVendorsApi(arcBestUrl)
        const url = arcBestDocumentsTrackingUrl(vApi, trackingNumber, docType)
        const { data } = await axios.get(url)
        let response = xmlToJson(data)

        return response
    } catch (error) {
        return errorResponse(error.message)
    }
}

const xmlToJson = (data) => {
    let dataXmlToJSON = convert.xml2json(data, { compact: true, spaces: 4 })
    const result = JSON.parse(dataXmlToJSON)

    if (result.ABF.NUMERRORS._text > 0) {
        return errorResponse(result.ABF.ERRORS.ERRORMESSAGE._text, 404)
    }

    //   const {
    //     QUOTEID,
    //     CHARGE,
    //     ADVERTISEDTRANSIT,
    //     ORIGTERMINFO: { TYPE },
    //   } = result.ABF
    //   const responseArray = {}
    let res = result.ABF.DOCUMENTS.DOCUMENT.PAGES.PAGE._text

    //   responseArray.quoteId = QUOTEID._text
    //   responseArray.totalRate = parseFloat(CHARGE._text).toFixed(2)
    //   responseArray.serviceLevel = TYPE._text
    //   responseArray.transitTime = ADVERTISEDTRANSIT._text
    //   res.push(responseArray)
    return successResponse(res)
}

module.exports = arcBestDocumentsTracking
