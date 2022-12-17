const { generateUUID } = require('../../../service/authService')
const logger = require(`${__base}/utils/logger`)
const { successResponse, errorResponse } = require(`${__base}helpers`)
const vendor = require('../../models/vendors')
const DateTime = require('../../../utils/DateTime')
const estesTracking = require('../../../service/estes/trackingService/estesTrackingService')
const daylightTracking = require('../../../service/DaylightApi/daylightTracking/daylightTracking')
const wardTrackService = require('../../../service/wardApi/trackingService/wardTrackService')
const vendorDb = require('../../models/vendors')
const arcBestTracking = require('../../../service/arcBestApi/arcBestTracking')
const {
    fedexTrackingService,
} = require('../../../service/fedex/fedexTracking/fedexTrackingService')
const {
    usfHollandServiceTracking,
    usfReddawayServiceTracking,
    usfReddawayServiceDocumentTracking,
    usfHollandServiceDocumentTracking,
} = require('../../../service/usfApiService/usfService')

// get tracking info

const getAllTrackingInfo = async (vendorId, trackingNumber) => {
    try {
        const result = await vendorDb.get({
            where: {
                id: vendorId,
                blackListed: 0,
            },
        })
        if (result.lenght === 0) {
            return errorResponse(`Vendor not found`)
        }
        const vendor = result[0]
        const dataObj = {
            requestID: trackingNumber,
        }
        let trackingResult
        if (vendor.website == 'www.estes-express.com') {
            trackingResult = await estesTracking(dataObj)
            return trackingResult
        }
        if (vendor.website == 'www.dylt.com') {
            trackingResult = await daylightTracking(trackingNumber)
            return trackingResult
        }
        if (vendor.website == 'www.wardtlc.com') {
            trackingResult = await wardTrackService(trackingNumber)
            return trackingResult
        }
        if (vendor.website == 'www.hollandregional.com') {
            trackingResult = await usfHollandServiceTracking(trackingNumber)
            return trackingResult
        }
        if (vendor.website == 'www.reddawayregional.com') {
            trackingResult = await usfReddawayServiceTracking(trackingNumber)
            return trackingResult
        }
        if (vendor.website == 'www.fedex.com') {
            trackingResult = await fedexTrackingService(trackingNumber)
            return trackingResult
        }
        if (vendor.website == 'www.arcb.com') {
            trackingResult = await arcBestTracking(trackingNumber)
            return trackingResult
        }

        return errorResponse(`Tracking  info not implemented with this vendor`)
    } catch (err) {
        logger.error('Error on getAllTrackingInfo Function err=>', err)
        return errorResponse('Something went wrong in server', 500)
    }
}

const getDocumentTracking = async (vendorsId, trackingNumber) => {
    try {
        const result = await vendorDb.get({
            where: {
                id: vendorsId,
                blackListed: 0,
            },
        })
        if (result.lenght === 0) {
            return errorResponse(`Vendor not found`)
        }
        const vendor = result[0]
        const dataObj = {
            requestID: trackingNumber,
        }

        let trackingResult
        if (vendor.website == 'www.estes-express.com') {
            trackingResult = await estesTracking(dataObj)
            return trackingResult
        }
        if (vendor.website == 'www.dylt.com') {
            trackingResult = await daylightTracking(trackingNumber)
            return trackingResult
        }
        if (vendor.website == 'www.wardtlc.com') {
            trackingResult = await wardTrackService(trackingNumber)
            return trackingResult
        }
        if (vendor.website == 'www.hollandregional.com') {
            trackingResult = await usfHollandServiceDocumentTracking(
                trackingNumber
            )
            return trackingResult
        }
        if (vendor.website == 'www.reddawayregional.com') {
            trackingResult = await usfReddawayServiceDocumentTracking(
                trackingNumber
            )
            return trackingResult
        }
        if (vendor.website == 'www.fedex.com') {
            trackingResult = await fedexTrackingService(trackingNumber)
            return trackingResult
        }
        if (vendor.website == 'www.arcb.com') {
            trackingResult = await arcBestTracking(trackingNumber)
            return trackingResult
        }

        return errorResponse(
            `Tracking document info not implemented with this vendor`
        )
    } catch (err) {
        logger.error('Error on getDocumentTracking Function err=>', err)
        return errorResponse('Something went wrong in server', 500)
    }
}
module.exports = {
    getAllTrackingInfo,
    getDocumentTracking,
}
