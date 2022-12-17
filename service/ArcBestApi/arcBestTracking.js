var convert = require('xml-js')

const { successResponse, errorResponse } = require(`${__base}helpers`)
const { default: axios } = require('axios')
const { getVendorsApi } = require('../getVenodrsApi')

const arcBestTracking = async (trackingNumber) => {
    try {
        const vApi = await getVendorsApi('www.arcb.com')
        const url = `https://www.abfs.com/xml/tracexml.asp?DL=2&ID=${vApi.apiKey}&RefNum=${trackingNumber}&RefType=A`
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

    const {
        PRONUMBER,
        PICKUP,
        PICKUPTIME,
        PICKUPDELAYCODE,
        DELIVERYDATE,
        DELIVERYTIME,
        DUEDATE,
        WEIGHT,
        PIECES,
        LONGSTATUS,
        DELIVSIGFIRSTNAME,
        DELIVSIGLASTNAME,
        SHIPPERNAME,
        SHIPPERADDRESS1,
        SHIPPERADDRESS2,
        SHIPPERCITY,
        SHIPPERCOUNTRY,
        SHIPPERZIP,
        SHIPPERSTATE,
        SHIPPERACCOUNT,
        CONSIGNEENAME,
        CONSIGNEEADDRESS2,
        CONSIGNEEADDRESS1,
        CONSIGNEESTATE,
        CONSIGNEEZIP,
        CONSIGNEECOUNTRY,
        CONSIGNEEACCOUNT,
        SFBTPBACCOUNT,
        BOLNUMBERS: {
            BOLNUMBER: { _text: BOL },
        },
    } = result.ABF.SHIPMENTS.SHIPMENT
    const responseArray = {}

    responseArray.PRONUMBER = PRONUMBER._text
    responseArray.PICKUP = PICKUP._text
    responseArray.PICKUPTIME = PICKUPTIME._text
    responseArray.PICKUPDELAYCODE = PICKUPDELAYCODE._text
    responseArray.DELIVERYDATE = DELIVERYDATE._text
    responseArray.DELIVERYTIME = DELIVERYTIME._text
    responseArray.DUEDATE = DUEDATE._text
    responseArray.WEIGHT = WEIGHT._text
    responseArray.PIECES = PIECES._text
    responseArray.LONGSTATUS = LONGSTATUS._text
    responseArray.DELIVSIGFIRSTNAME = DELIVSIGFIRSTNAME._text
    responseArray.DELIVSIGLASTNAME = DELIVSIGLASTNAME._text
    responseArray.SHIPPERNAME = SHIPPERNAME._text
    responseArray.DELIVSIGLASTNAME = DELIVSIGLASTNAME._text
    responseArray.SHIPPERADDRESS1 = SHIPPERADDRESS1._text
    responseArray.SHIPPERADDRESS2 = SHIPPERADDRESS2._text
    responseArray.SHIPPERCITY = SHIPPERCITY._text
    responseArray.SHIPPERCOUNTRY = SHIPPERCOUNTRY._text
    responseArray.SHIPPERZIP = SHIPPERZIP._text
    responseArray.SHIPPERSTATE = SHIPPERSTATE._text
    responseArray.SHIPPERACCOUNT = SHIPPERACCOUNT._text
    responseArray.CONSIGNEENAME = CONSIGNEENAME._text
    responseArray.CONSIGNEEADDRESS1 = CONSIGNEEADDRESS1._text
    responseArray.CONSIGNEEADDRESS2 = CONSIGNEEADDRESS2._text
    responseArray.CONSIGNEESTATE = CONSIGNEESTATE._text
    responseArray.CONSIGNEEZIP = CONSIGNEEZIP._text
    responseArray.CONSIGNEECOUNTRY = CONSIGNEECOUNTRY._text
    responseArray.CONSIGNEEACCOUNT = CONSIGNEEACCOUNT._text
    responseArray.SFBTPBACCOUNT = SFBTPBACCOUNT._text
    responseArray.BOLNUMBER = BOL
    return successResponse(responseArray)
}

module.exports = arcBestTracking
