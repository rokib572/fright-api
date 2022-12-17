const arcBestUrl = 'www.arcb.com'
const arcBestDocumentsTrackingUrl = (vApi, trackingNumber, docType) =>
    `https://www.abfs.com/xml/docretxml.asp?DL=2&ID=${vApi.apiKey}&RefNum=${trackingNumber}&RefType=A&DocType=${docType}&ImageType=T`

const hollandRegionalUrl = 'www.hollandregional.com'
const hollandRegionalDocTrackingUrl = (apiKey, trackingNumber, docType) =>
    `https://api.hollandregional.com/api/Image/doImage?accessKey=${apiKey}&searchBy=PRO&number=${trackingNumber}&BOL=${docType}TIF&DR=PDF&serviceCompany=Holland`
// &BOL=${docType}TIF&DR=PDF

const hollandRegionalTrackingUrl = (apiKey, trackingNumber) =>
    `https://api.hollandregional.com/api/TrackShipments/doTrackDetail?accessKey=${apiKey}&searchBy=PRO&number=${trackingNumber}`
const reddawayregional = 'www.reddawayregional.com'
const reddawayregionalDocTrackingUrl = (apiKey, trackingNumber, docType) =>
    `https://api.hollandregional.com/api/Image/doImage?accessKey=${apiKey}&searchBy=PRO&number=${trackingNumber}&BOL=${docType}TIF&DR=PDF&serviceCompany=Reddaway`
const reddawayregionalTrackingUrl = (apiKey, trackingNumber) =>
    `https://api.reddawayregional.com//api/TrackShipments/doTrackDetail?accessKey=${apiKey}&searchBy=PRO&number=${trackingNumber}`
const wardRateUrl = 'www.wardtlc.com'
const wardRateTrackingUrl =
    'https://wardtlctools.com/wardtrucking/webservices/traceshipment'

module.exports = {
    arcBestUrl,
    arcBestDocumentsTrackingUrl,
    hollandRegionalUrl,
    hollandRegionalTrackingUrl,
    reddawayregional,
    reddawayregionalTrackingUrl,
    wardRateUrl,
    wardRateTrackingUrl,
    hollandRegionalDocTrackingUrl,
}
