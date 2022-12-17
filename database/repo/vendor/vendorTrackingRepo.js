const arcBestTracking = require('../../../service/arcBestApi/arcBestTracking')
const { generateUUID } = require('../../../service/authService')
const daylightTracking = require('../../../service/DaylightApi/daylightTracking/daylightTracking')
const logger = require(`${__base}/utils/logger`)
const { successResponse, errorResponse } = require(`${__base}helpers`)
const estesTracking = require('../../../service/estes/trackingService/estesTrackingService')
const {
    fedexTrackingService,
} = require('../../../service/fedex/fedexTracking/fedexTrackingService')
const {
    usfHollandServiceTracking,
    usfReddawayServiceTracking,
} = require('../../../service/usfApiService/usfService')
const wardTrackService = require('../../../service/wardApi/trackingService/wardTrackService')
const vendorDb = require('../../models/vendors')

const getVendorTracking = async (vendorsId, trackingNumber) => {
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
            requestID: trackingNumber?.replaceAll('-', ''),
        }
        let trackingResult
        if (vendor.website == 'www.estes-express.com') {
            trackingResult = await estesTracking(dataObj)
            return trackingResult
        }
        if (vendor.website == 'www.dylt.com') {
            trackingResult = await daylightTracking(trackingNumber?.replaceAll('-', ''))
            return trackingResult
        }
        if (vendor.website == 'www.wardtlc.com') {
            trackingResult = await wardTrackService(trackingNumber?.replaceAll('-', ''))
            return trackingResult
        }
        if (vendor.website == 'www.hollandregional.com') {
            trackingResult = await usfHollandServiceTracking(trackingNumber?.replaceAll('-', ''))
            return trackingResult
        }
        if (vendor.website == 'www.reddawayregional.com') {
            trackingResult = await usfReddawayServiceTracking(trackingNumber?.replaceAll('-', ''))
            return trackingResult
        }
        if (vendor.website == 'www.fedex.com') {
            trackingResult = await fedexTrackingService(trackingNumber?.replaceAll('-', ''))
            return trackingResult
        }
        if (vendor.website == 'www.arcb.com') {
            trackingResult = await arcBestTracking(trackingNumber?.replaceAll('-', ''))
            return trackingResult
        }

        return errorResponse(`Tracking info not implemented with this vendor`)
    } catch (err) {
        logger.error('Error on getVendorTracking Function err=>', err)
        return errorResponse('Something went wrong in server', 500)
    }
}

module.exports = {
    getVendorTracking,
}
