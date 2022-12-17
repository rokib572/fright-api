const { successResponse, errorResponse } = require(`${__base}helpers`)
let XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
const { default: axios } = require('axios')
const xpoPayload = require('./xpoPayload')
const { getVendorsApi } = require('../getVenodrsApi')
const {
    SERVICE_LEVEL_GUARANTEED,
    SERVICE_LEVEL_STANDARD,
} = require('../../utils/serviceLevels')
const getUtcTime = require('../../utils/getUTCTime')

const xpoAuth = (vApi) => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest()
        xhr.withCredentials = true
        xhr.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                let accessToken = undefined
                try {
                    let parsedJson = JSON.parse(this.responseText)
                    accessToken = parsedJson.access_token
                } catch (e) {
                    console.log(
                        'Failed to parse xpoAuth resoponse',
                        this.responseText
                    )
                }
                resolve(accessToken)
            }
        })

        xhr.open(
            'POST',
            `https://api.ltl.xpo.com/token?grant_type=password&username=${vApi.userName}&password=${vApi.password}`
        )
        xhr.setRequestHeader('Authorization', `Basic ${vApi.apiKey}`)
        xhr.send()
    })
}

const getServiceLevel = (serviceLevel) => {
    switch (serviceLevel) {
        case 'GUR XPO LOGISTICS GUARANTEED!':
            return SERVICE_LEVEL_GUARANTEED
        case 'G12 GUARANTEED! BY NOON':
            return SERVICE_LEVEL_GUARANTEED
        default:
            return serviceLevel
    }
}
const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
]

const getModifiedResponse = (responseData) => {
    try {
        const rateQuote = responseData?.rateQuote
        let dat = new Date()
        let day = 0
        let mon = dat.getMonth()
        let yr = dat.getFullYear()
        let response = []
        if (rateQuote && rateQuote.confirmationNbr) {
            const quoteID = rateQuote.confirmationNbr
            const transitTime = responseData?.transitTime?.transitDays
                ? responseData?.transitTime?.transitDays + ' days'
                : undefined
            dat.setDate(
                dat.getDate() + parseInt(responseData?.transitTime.transitDays)
            )
            let eta =
                dat.getDate() +
                '-' +
                monthNames[dat.getMonth()] +
                '-' +
                dat.getFullYear()
            let service = {}
            service.quoteID = quoteID
            service.totalRate = parseFloat(
                rateQuote.totCharge?.[0]?.amt
            ).toFixed(2)
            service.serviceLevel = 'Standard'
            service.transitTime = transitTime
            service.ETA = eta
            response.push(service)
            if (rateQuote.specialServiceCharges) {
                rateQuote.specialServiceCharges.map((serviceItem) => {
                    service = {}
                    service.quoteID = quoteID
                    service.totalRate = parseFloat(
                        serviceItem?.totChargeAmt?.amt
                    ).toFixed(2)
                    service.serviceLevel = getServiceLevel(
                        serviceItem.serviceCharge?.[0]?.accessorialDesc
                    )
                    service.transitTime = transitTime
                    service.ETA = eta
                    response.push(service)
                })
            }
        }

        return response
    } catch (error) {
        return []
    }
}

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

const xpoService = async (dataInput) => {
    try {
        let vApi = await getVendorsApi('www.xpo.com')
        let dataObj = xpoPayload(dataInput)
        const authToken = await xpoAuth(vApi)
        const url = vApi.apiURL
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
        }
        const { data } = await axios.post(url, dataObj, { headers: headers })
        if (data) {
            return successResponse(getModifiedResponse(data.data))
        }
        return errorResponse('Could not get response from xpo', 500)
    } catch (error) {
        const err = getErrorMessage(error)
        return errorResponse(err.message, err.status)
    }
}
module.exports = { xpoService, xpoAuth }
