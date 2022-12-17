var convert = require('xml-js')
const { successResponse, errorResponse } = require(`${__base}helpers`)
const { default: axios } = require('axios')
const getWeight = require('../../utils/getWeight')
const { getVendorsApi } = require('../getVenodrsApi')
const {
    hollandRegionalUrl,
    reddawayregional,
    hollandRegionalDocTrackingUrl,
    hollandRegionalTrackingUrl,
    reddawayregionalTrackingUrl,
    reddawayregionalDocTrackingUrl,
} = require('../../utils/urlLink')

const usfHollandService = async (dataObj) => {
    try {
        const vendorAPi = await getVendorsApi(hollandRegionalUrl)
        let url = `${vendorAPi.apiURL}?accessKey=${
            vendorAPi.apiKey
        }&accountId=${vendorAPi.accountNumber}&originCity=${
            dataObj.origin.city
        }&originState=${dataObj.origin.province}&originZipCode=${
            dataObj.origin.postalCode
        }&destCity=${dataObj.destination.city}&destState=${
            dataObj.destination.province
        }&destZipCode=${
            dataObj.destination.postalCode
        }&direction=3rdParty&chargeType=Prepaid&${dataObj.pieces
            .map((piece, i) => {
                return `shipmentClass${i + 1}=${
                    piece.freightClass
                }&shipmentWeight${i + 1}=${getWeight(piece, 'kg')}`
            })
            .join('&')}`

        const { data } = await axios.get(url)
        const response = xmlToJson(data)
        return response
    } catch (error) {
        return errorResponse(error.message)
    }
}

const usfReddawayService = async (dataObj) => {
    try {
        const vendorAPi = await getVendorsApi(reddawayregional)
        let url = `${vendorAPi.apiURL}?accessKey=${
            vendorAPi.apiKey
        }&accountId=${vendorAPi.accountNumber}&originCity=${
            dataObj.origin.city
        }&originState=${dataObj.origin.province}&originZipCode=${
            dataObj.origin.postalCode
        }&destCity=${dataObj.destination.city}&destState=${
            dataObj.destination.province
        }&destZipCode=${
            dataObj.destination.postalCode
        }&direction=3rdParty&chargeType=Prepaid&${dataObj.pieces
            .map((piece, i) => {
                return `shipmentClass${i + 1}=${
                    piece.freightClass
                }&shipmentWeight${i + 1}=${getWeight(piece, 'kg')}`
            })
            .join('&')}`
        const { data } = await axios.get(url)
        const response = xmlToJson(data)

        return response
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
    if (result.RateQuoteResponse.RateQuote) {
        const response = result.RateQuoteResponse.RateQuote.SERVICEUPGRADES
        const res = new Array()
        for (let i in response) {
            const responseArray = {}
            responseArray.quotedId = ''
            responseArray.totalRate = parseFloat(
                response[i].TOTAL_COST._text
            ).toFixed(2)
            responseArray.serviceLevel = response[i].SERVICE_TYPE._text
            responseArray.transitTime = response[i].DELIVERYDAYS
                ? `${response[i].DELIVERYDAYS._text} Days`
                : response[i].DELIVERYTIME._text
            res.push(responseArray)
        }
        return successResponse(res)
    }
    return errorResponse(result.RateQuoteResponse.STATUS.MESSAGE._text)
}

const usfHollandServiceDocumentTracking = async (trackingNumber, docType) => {
    try {
        const vendorAPi = await getVendorsApi(hollandRegionalUrl)

        const { data } = await axios.get(
            hollandRegionalDocTrackingUrl(
                vendorAPi.apiKey,
                trackingNumber,
                docType
            )
        )
        return data
    } catch (error) {
        console.log(error)
    }
}

const usfReddawayServiceDocumentTracking = async (trackingNumber, docType) => {
    try {
        const vendorAPi = await getVendorsApi(reddawayregional)

        const { data } = await axios.get(
            reddawayregionalDocTrackingUrl(
                vendorAPi.apiKey,
                trackingNumber,
                docType
            )
        )
        return data
    } catch (error) {
        console.log(error)
    }
}

//TRacking Api

const usfHollandServiceTracking = async (trackingNumber) => {
    try {
        const vendorAPi = await getVendorsApi(hollandRegionalUrl)

        const { data } = await axios.get(
            hollandRegionalTrackingUrl(vendorAPi.apiKey, trackingNumber)
        )
        return data
    } catch (error) {
        console.log(error)
    }
}
const usfReddawayServiceTracking = async (trackingNumber) => {
    try {
        const vendorAPi = await getVendorsApi(reddawayregional)

        const { data } = await axios.get(
            reddawayregionalTrackingUrl(vendorAPi.apiKey, trackingNumber)
        )
        return data
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    usfHollandService,
    usfReddawayService,
    usfHollandServiceDocumentTracking,
    usfReddawayServiceDocumentTracking,
    usfHollandServiceTracking,
    usfReddawayServiceTracking,
}
