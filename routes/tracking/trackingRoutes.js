const { validate: isUUID } = require('uuid')
const validate = require(`${__base}utils/validate`)
const auth = require(`${__base}utils/auth`)
const logger = require(`${__base}/utils/logger`)
const DateTime = require('../../utils/DateTime')
const { errorResponse } = require(`${__base}helpers`)
const trackingRepo = require('../../database/repo/tracking/trackingRepo')
const {
  getVendorTracking,
} = require('../../database/repo/vendor/vendorTrackingRepo')

const trackingRoutes = async (app) => {
  // GET tracking/:vendorsId/:trackingNumber
  // app.get(
  //   '/api/tracking/:vendorsId/:trackingNumber',
  //   auth,
  //   async (req, res) => {
  //     try {
  //       const { vendorsId, trackingNumber } = req.params
  //       console.log('sgasdhjg aashgdas dhs d')
  //       if (!isUUID(vendorsId)) {
  //         return res
  //           .status(400)
  //           .json(errorResponse('Vendor id must be a valid UUID'))
  //       }
  //       const result = await trackingRepo.getTrackingInfo(
  //         vendorsId,
  //         trackingNumber
  //       )
  //       return res.status(result.statusCode).json('result')
  //     } catch (error) {
  //       return res
  //         .status(500)
  //         .json(errorResponse('Could not get tracking information'))
  //     }
  //   }
  // )

  // GEt document

  // GET documents/:vendorsId/:trackingNumber
  app.get(
    '/api/documents/:vendorsId/:trackingNumber',
    auth,
    async (req, res) => {
      try {
        const { vendorsId, trackingNumber } = req.params
        if (!isUUID(vendorsId)) {
          return res
            .status(400)
            .json(errorResponse('Vendor id must be a valid UUID'))
        }
        const result = await trackingRepo.getDocumentTracking(
          vendorsId,
          trackingNumber
        )
        return res.status(result.statusCode).json(result)
      } catch (error) {
        return res
          .status(500)
          .json(errorResponse('Could not get tracking documents information'))
      }
    }
  )

  app.post('/api/tracking', auth, async (req, res) => {
    try {
      const { vendorsId, trackingNumber } = req.body

      const result = await getVendorTracking(vendorsId, trackingNumber)
      return res.status(result.statusCode).send(result)
    } catch (e) {
      return res
        .status(500)
        .json(errorResponse('Could not get tracking information'))
    }
  })
}

module.exports = trackingRoutes
