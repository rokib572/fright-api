var convert = require('xml-js')
const getWeight = require('../../utils/getWeight')
const { successResponse, errorResponse } = require(`${__base}helpers`)
const { default: axios } = require('axios')
const getUtcTime = require('../../utils/getUTCTime')
const { getVendorsApi } = require('../getVenodrsApi')
const { arcBestUrl } = require('../../utils/urlLink')
const { SERVICE_LEVEL_STANDARD } = require('../../utils/serviceLevels')

const arcBestService = async (dataObj) => {
    try {
        const vApi = await getVendorsApi(arcBestUrl)
        let date = new Date(getUtcTime())
        const url = `${vApi.apiURL}?DL=2&ID=${vApi.apiKey}&ShipCity=${
            dataObj.origin.city
        }&ShipState=${dataObj.origin.province}&ShipZip=${
            dataObj.origin.postalCode
        }&ShipCountry=${dataObj.origin.country}&ConsCity=${
            dataObj.destination.city
        }&ConsState=${dataObj.destination.province}&ConsZip=${
            dataObj.destination.postalCode
        }&ConsCountry=${
            dataObj.destination.country
        }&FrtLWHType=IN&${dataObj.pieces
            .map((piece, i) => {
                return `FrtLng${i + 1}=${piece.dimLength}&FrtWdth${i + 1}=${
                    piece.dimWidth
                }&FrtHght${i + 1}=${piece.dimHeight}&UnitNo${i + 1}=3&UnitType${
                    i + 1
                }=${getQuantityType(piece.quantityType)}&Wgt${
                    i + 1
                }=${getWeight(piece, 'kg')}&Class${i + 1}=${piece.freightClass}`
            })
            .join('&')}&ShipAff=Y&ShipMonth=${
            date.getMonth() + 1
        }&ShipDay=${date.getDate()}&ShipYear=${date.getFullYear()}`
        const { data } = await axios.get(url)
        //console.log(data)
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
        return errorResponse(result.ABF.ERROR.ERRORMESSAGE._text)
    }

    const {
        QUOTEID,
        CHARGE,
        ADVERTISEDTRANSIT,
        ORIGTERMINFO: { TYPE },
    } = result.ABF
    const responseArray = {}
    let res = new Array()

    responseArray.quoteId = QUOTEID._text
    responseArray.totalRate = parseFloat(CHARGE._text).toFixed(2)
    responseArray.serviceLevel = TYPE._text == 'DIRECT' ? SERVICE_LEVEL_STANDARD : TYPE._text
    responseArray.transitTime = ADVERTISEDTRANSIT._text
    res.push(responseArray)
    return successResponse(res)
}

const getQuantityType = (piece) => {
    let quantityType = piece.toLowerCase()
    if (quantityType === 'pallet' || quantityType === 'pl') {
        return 'PLT'
    }
    if (quantityType === 'carton') {
        return 'CTN'
    }
    if (quantityType === 'box') {
        return 'BX'
    }
    if (quantityType === 'tote' || quantityType === 'totebin') {
        return 'TOTE'
    }
    if (quantityType === 'roll') {
        return 'RL'
    }
    return piece.toUpperCase()
}
module.exports = arcBestService
