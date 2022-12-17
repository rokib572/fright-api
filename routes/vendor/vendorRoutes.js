const { validate: isUUID } = require('uuid')
const validate = require(`${__base}utils/validate`)
const auth = require(`${__base}utils/auth`)
const logger = require(`${__base}/utils/logger`)
const DateTime = require('../../utils/DateTime')
const { errorResponse } = require(`${__base}helpers`)
const {
    createVendorSchema,
    updateVendorSchema,
    estesRateSchema,
    vendorCoverageSchema,
    vendorApiSchema,
    vendorAirSchema,
    vendorOceanSchema,
    fedexRateSchema,
    createVendorAccessorials,
    arcBestRateSchema,
    daylightRateSchema,
    yrcRateSchema,
    newPennRateSchema,
    usfRateSchema,
    xpoRateSchema,
    dhlRateSchema,
    vendorsLimitSchema,
    vendorsEquipmentTypeIdSchema,
    forwardAirRateSchema,
    allVendorsRateScema,
    jpExpressRateSchema,
    documentTrackingSchema,
    wardRateSchema,
    xpoDocumentSchema,
    estesDocumentSchema,
    usfTrackingSchema,
} = require('./vendorValidate')
const vendorProfileRepo = require(`${__base}database/repo/vendor/vendorProfileRepo`)
const estesRateService = require('../../service/estes/rateService/estesRateService')
const estesTrackingService = require('../../service/estes/trackingService/estesTrackingService')
const forwardAirService = require('../../service/forwardAir/forwardRateService')
const { fedexService } = require('../../service/fedex/fedexService')
const arcBestService = require('../../service/arcBestApi/arcBestService')
const { daylightService } = require('../../service/DaylightApi/daylightService')
const yrcService = require('../../service/yrc/yrcService')
const newPennService = require('../../service/newPenn/newPennService')
const {
    usfHollandService,
    usfReddawayService,
    usfHollandServiceTracking,
    usfReddawayServiceTracking,
    usfHollandServiceDocumentTracking,
    usfReddawayServiceDocumentTracking,
} = require('../../service/usfApiService/usfService')
const { xpoService } = require('../../service/xpoApi/xpoService')
const dhlService = require('../../service/dhlApi/dhlService')
const {
    saveVendorsLimit,
    getVendorsLimitByVenId,
    saveVendorsEquipmentsTypeById,
    getVendorsByEquipmentId,
    getAllVendorsRate,
    vendorTrackingRepo,
    getVendorsEquipmentsTypeByVendorsId,
    saveVendorsGround,
} = require('../../database/repo/vendor/vendorProfileRepo')
const jpExpressService = require('../../service/jpExpressApi/jpExpressService')
const wardService = require('../../service/wardApi/wardApiService')
const daylightTracking = require('../../service/DaylightApi/daylightTracking/daylightTracking')
const {
    wardTrackPayload,
} = require('../../service/wardApi/trackingService/wardTrackPayload')
const wardTrackService = require('../../service/wardApi/trackingService/wardTrackService')
const daylightDocumentTrackingService = require('../../service/DaylightApi/daylightDocumentTracking/daylightDocumentTrackingService')
const arcBestDocumentsTracking = require('../../service/arcBestApi/arcBestDocumentsTracking/arcBestDocumentsTracking')
const arcBestTracking = require('../../service/arcBestApi/arcBestTracking')
const estesDocumentService = require('../../service/estes/documentService/estesDocumentService')
const xpoTrackingService = require('../../service/xpoApi/xpoTrackingService')
const xpoDocumentService = require('../../service/xpoApi/xpoDocumentService')
const yrcTrackingService = require('../../service/yrc/tracking/yrcTrackingService')
const yrcDocumentService = require('../../service/yrc/document/yrcDocumentService')
const {
    fedexTrackingService,
} = require('../../service/fedex/fedexTracking/fedexTrackingService')

const vendorRoutes = async (app) => {
    // post vendor info
    app.post(
        '/api/vendors',
        auth,
        validate(createVendorSchema),
        async (req, res) => {
            try {
                const data = req.body
                const existingVendor =
                    await vendorProfileRepo.isVendorExistsByLocationId(
                        data.locationsId
                    )
                data['modifiedBy'] = req.userId
                if (existingVendor.length === 0) {
                    data['createdBy'] = req.userId
                    const result = await vendorProfileRepo.saveVendorProfile(
                        data
                    )
                    return res.status(result.statusCode).json(result)
                }
                const currentTime = DateTime.getCurrentTime()
                data['modifiedDate'] = currentTime
                const response = await vendorProfileRepo.updateVendorProfile(
                    data,
                    existingVendor[0].id
                )
                return res.status(response.statusCode).json(response)
            } catch (err) {
                return res
                    .status(500)
                    .json(errorResponse('Could not create vendor'))
            }
        }
    )

    // GET all vendors info
    app.get('/api/vendors', auth, async (req, res) => {
        try {
            let page = req.query.page || false
            if (page && !Number.isInteger(Number(page))) {
                return res
                    .status(400)
                    .send(errorResponse('Page must be a number'))
            }
            page && page <= 0 ? (page = 1) : page
            const result = await vendorProfileRepo.getAllVendors(page)
            return res.status(result.statusCode).json(result)
        } catch (err) {
            logger.error(
                'Error on getAllVendors  getVendorById,Function err=>',
                err
            )
            return res.status(500).json(errorResponse('Could not get vendor'))
        }
    })

    // GET a single vendor by id
    app.get('/api/vendors/:id', auth, async (req, res) => {
        try {
            const id = req.params.id
            if (id && id == 'air') {
                const result = await vendorProfileRepo.getVendorAir()
                return res.status(result.statusCode).json(result)
            }
            if (id && id == 'ocean') {
                const result = await vendorProfileRepo.getVendorOcean()
                return res.status(result.statusCode).json(result)
            }
            const result = await vendorProfileRepo.getVendorById(req.params.id)
            return res.status(result.statusCode).json(result)
        } catch (err) {
            return res.status(500).json(errorResponse('Could not get vendor'))
        }
    })

    // update vendor profile
    app.patch(
        '/api/vendors/:id',
        auth,
        validate(updateVendorSchema),
        async (req, res) => {
            try {
                const data = req.body
                data['modifiedBy'] = req.userId
                data['modifiedDate'] = DateTime.getCurrentTime()
                delete data.blackListed
                const result = await vendorProfileRepo.updateVendorProfile(
                    data,
                    req.params.id
                )
                return res.status(result.statusCode).json(result)
            } catch (err) {
                return res
                    .status(500)
                    .json(errorResponse('Could not update vendor'))
            }
        }
    )

    // delete vendor profile
    app.delete('/api/vendors/:id', auth, async (req, res) => {
        try {
            const result = await vendorProfileRepo.deleteVendorProfile(
                req.params.id
            )
            return res.status(result.statusCode).json(result)
        } catch (err) {
            return res
                .status(500)
                .json(errorResponse('Could not delete vendor'))
        }
    })

    // estes rate service
    app.post(
        '/api/test-vendors/estes',
        auth,
        validate(estesRateSchema),
        async (req, res) => {
            try {
                const data = req.body
                const result = await estesRateService(data)
                return res.status(result.statusCode).json(result)
            } catch (err) {
                logger.error('Error on estesRateService,Function err=>', err)
                return res
                    .status(500)
                    .json(errorResponse('Could not get estes rate', 500))
            }
        }
    )

    // estes tracking service
    app.post('/api/test-vendors/estes/tracking', auth, async (req, res) => {
        try {
            const data = req.body
            const result = await estesTrackingService(data)
            return res.status(result.statusCode).json(result)
        } catch (err) {
            logger.error('Error on trackingService,Function err=>', err)
            return res
                .status(500)
                .json(errorResponse('Could not get tracking', 500))
        }
    })

    // estes document service
    app.post(
        '/api/test-vendors/estes/document',
        auth,
        validate(estesDocumentSchema),
        async (req, res) => {
            try {
                const data = req.body
                const result = await estesDocumentService(data)
                return res.status(result.statusCode).json(result)
            } catch (err) {
                logger.error(
                    'Error on estesDocumentService, Function err=>',
                    err
                )
                return res
                    .status(500)
                    .json(errorResponse('Could not get estes document', 500))
            }
        }
    )

    // daylight tracking service
    app.post('/api/test-vendors/daylight/tracking', auth, async (req, res) => {
        try {
            const data = req.body.trackingNumber

            if (!data) {
                return res
                    .status(400)
                    .send(errorResponse('Please provide tracking number'))
            }
            const result = await daylightTracking(data)
            return res.status(result.statusCode).send(result)
        } catch (err) {
            logger.error(
                'Error on daylight trackingService,Function err=>',
                err
            )
            return res
                .status(500)
                .json(errorResponse('Could not get tracking', 500))
        }
    })

    // daylight document tracking service
    app.post(
        '/api/test-vendors/daylight/document',
        auth,
        validate(documentTrackingSchema),
        async (req, res) => {
            try {
                const trackingNumber = req.body.trackingNumber
                const docType = req.body.docType

                const result = await daylightDocumentTrackingService(
                    trackingNumber,
                    docType
                )
                return res.status(result.statusCode).send(result)
            } catch (err) {
                logger.error(
                    'Error on daylight document trackingService,Function err=>',
                    err
                )
                return res
                    .status(500)
                    .json(
                        errorResponse(
                            'Could not get daylight document tracking',
                            500
                        )
                    )
            }
        }
    )

    // arcBest document tracking service
    app.post(
        '/api/test-vendors/arcbest/document',
        auth,
        validate(documentTrackingSchema),
        async (req, res) => {
            try {
                const trackingNumber = req.body.trackingNumber
                const docType = req.body.docType

                const result = await arcBestDocumentsTracking(
                    trackingNumber,
                    docType
                )
                return res.status(result.statusCode).send(result)
            } catch (err) {
                logger.error(
                    'Error on arcBest document trackingService,Function err=>',
                    err
                )
                return res
                    .status(500)
                    .json(
                        errorResponse(
                            'Could not get arcBest document tracking',
                            500
                        )
                    )
            }
        }
    )
    // arcbest tracking service
    app.post('/api/test-vendors/arcbest/tracking', auth, async (req, res) => {
        try {
            const data = req.body.trackingNumber
            if (!data) {
                return res
                    .status(400)
                    .send(errorResponse('Please provide tracking number'))
            }
            const result = await arcBestTracking(data)
            return res.status(200).send(result)
        } catch (err) {
            logger.error('Error on arcbest trackingService,Function err=>', err)
            return res
                .status(500)
                .json(errorResponse('Could not get  arcbest tracking', 500))
        }
    })

    // estes tracking service
    app.post('/api/test-vendors/wardrate/tracking', async (req, res) => {
        try {
            const data = req.body.trackingNumber
            if (!data) {
                return res
                    .status(400)
                    .send(errorResponse('Please provide tracking number'))
            }
            const result = await wardTrackService(data)
            return res.status(result.statusCode).send(result)
        } catch (err) {
            logger.error(
                'Error on daylight trackingService,Function err=>',
                err
            )
            return res
                .status(500)
                .json(errorResponse('Could not get tracking', 500))
        }
    })

    // GET /api/tracking/:vendorsId/:trackingNumber
    app.get(
        '/api/tracking/:vendorsId/:trackingNumber',
        auth,
        async (req, res) => {
            try {
                const { vendorsId, trackingNumber } = req.params
                const result = await vendorTrackingRepo.getVendorTracking(
                    vendorsId,
                    trackingNumber
                )

                return res.status(200).json(result)
            } catch (err) {
                logger.error('Error on trackingService,Function err=>', err)
                return res
                    .status(500)
                    .json(errorResponse('Could not get tracking', 500))
            }
        }
    )

    //// fedex rate service
    app.post(
        '/api/test-vendors/fedex',
        auth,
        validate(fedexRateSchema),
        async (req, res) => {
            try {
                const data = req.body
                const result = await fedexService(data)
                return res.status(result.statusCode).send(result)
            } catch (err) {
                logger.error('Error on fedX,Function api err=>', err)
                return res.status(500).json(errorResponse(err.message))
            }
        }
    )

    // fedex tracking service
    app.post('/api/test-vendors/fedex/tracking', auth, async (req, res) => {
        try {
            const data = req.body.trackingNumber
            console.log(data)
            if (!data) {
                return res
                    .status(400)
                    .send(errorResponse('Please provide tracking number'))
            }
            const result = await fedexTrackingService(data)
            return res.status(result.statusCode).send(result)
        } catch (err) {
            logger.error('Error on fedex trackingService,Function err=>', err)
            return res
                .status(500)
                .json(errorResponse('Could not get  fedex tracking', 500))
        }
    })

    // post vendors/:id/coverage
    app.post(
        '/api/vendors/:id/coverage',
        auth,
        validate(vendorCoverageSchema),
        async (req, res) => {
            try {
                const vendorId = req.params.id
                if (!isUUID(vendorId)) {
                    return res
                        .status(400)
                        .json(errorResponse('Vendor id is not valid'))
                }
                const { province } = req.body
                const result = await vendorProfileRepo.saveVendorCoverage(
                    vendorId,
                    province
                )
                return res.status(result.statusCode).json(result)
            } catch (err) {
                return res
                    .status(500)
                    .json(errorResponse('Could not create vendor'))
            }
        }
    )

    // GET /api/vendors/:id/coverage
    app.get('/api/vendors/:id/coverage', auth, async (req, res) => {
        try {
            const vendorId = req.params.id
            if (!isUUID(vendorId)) {
                return res
                    .status(400)
                    .json(errorResponse('Vendor id is not valid uuid'))
            }
            const result = await vendorProfileRepo.getVendorCoverage(vendorId)
            return res.status(result.statusCode).json(result)
        } catch (err) {
            return res.status(500).json(errorResponse('Could not get vendor'))
        }
    })

    // POST /api/vendors/:id/accessorials
    app.post(
        '/api/vendors/:id/accessorials',
        auth,
        validate(createVendorAccessorials),
        async (req, res) => {
            try {
                const vendorId = req.params.id
                if (!isUUID(vendorId)) {
                    return res
                        .status(400)
                        .json(errorResponse('Vendor id is not valid uuid'))
                }
                const data = req.body
                const result = await vendorProfileRepo.saveVendorAccessorials(
                    vendorId,
                    data
                )
                return res.status(result.statusCode).json(result)
            } catch (err) {
                return res
                    .status(500)
                    .json(errorResponse('Could not create vendor'))
            }
        }
    )

    // GET /api/vendors/:id/accessorials
    app.get('/api/vendors/:id/accessorials', auth, async (req, res) => {
        try {
            const vendorId = req.params.id
            if (!isUUID(vendorId)) {
                return res
                    .status(400)
                    .json(errorResponse('Vendor id is not valid uuid'))
            }
            const result = await vendorProfileRepo.getVendorAccessorials(
                vendorId
            )
            return res.status(result.statusCode).json(result)
        } catch (err) {
            return res.status(500).json(errorResponse('Could not get vendor'))
        }
    })

    // // UPDATE /api/vendors/:id/accessorials
    // app.patch('/api/vendors/:id/accessorials', auth, async (req, res) => {
    //   try {
    //     const vendorId = req.params.id
    //     if (!isUUID(vendorId)) {
    //       return res.status(400).json(errorResponse('Vendor id is not valid uuid'))
    //     }
    //     const { accessorialsId } = req.body
    //     if(!accessorialsId){
    //       return res.status(400).json(errorResponse('accessorialsId is required'))
    //     }
    //     if(!Number.isInteger(Number(accessorialsId))){
    //       return res.status(400).json(errorResponse('accessorialsId must be integer'))
    //     }
    //     const result = await vendorProfileRepo.updateVendorAccessorials(vendorId, accessorialsId)
    //     return res.status(result.statusCode).json(result)
    //   } catch (err) {
    //     return res.status(500).json(errorResponse('Could not update vendor'))
    //   }
    // })

    // POST vendors/:id/api
    app.post(
        '/api/vendors/:id/api',
        auth,
        validate(vendorApiSchema),
        async (req, res) => {
            try {
                const vendorId = req.params.id
                if (!isUUID(vendorId)) {
                    return res
                        .status(400)
                        .json(errorResponse('Vendor id is not valid uuid'))
                }
                const dataObj = req.body
                const result = await vendorProfileRepo.saveVendorApi(
                    vendorId,
                    dataObj
                )
                return res.status(result.statusCode).json(result)
            } catch (err) {
                return res
                    .status(500)
                    .json(errorResponse('Could not create vendor'))
            }
        }
    )

    // GET vendors/:id/api
    app.get('/api/vendors/:id/api', auth, async (req, res) => {
        try {
            const vendorId = req.params.id
            if (!isUUID(vendorId)) {
                return res
                    .status(400)
                    .json(errorResponse('Vendor id is not valid uuid'))
            }
            const result = await vendorProfileRepo.getVendorApi(vendorId)
            return res.status(result.statusCode).json(result)
        } catch (err) {
            return res.status(500).json(errorResponse('Could not get vendor'))
        }
    })

    //POST /api/vendors/:id/air
    app.post(
        '/api/vendors/:id/air',
        auth,
        validate(vendorAirSchema),
        async (req, res) => {
            try {
                const vendorId = req.params.id
                if (!isUUID(vendorId)) {
                    return res
                        .status(400)
                        .json(errorResponse('Vendor id is not valid uuid'))
                }
                const dataObj = req.body
                const result = await vendorProfileRepo.saveVendorAir(
                    vendorId,
                    dataObj
                )
                return res.status(result.statusCode).json(result)
            } catch (err) {
                return res
                    .status(500)
                    .json(errorResponse('Could not create vendor'))
            }
        }
    )

    // POST /api/vendors/:id/ocean
    app.post(
        '/api/vendors/:id/ocean',
        auth,
        validate(vendorOceanSchema),
        async (req, res) => {
            try {
                const vendorId = req.params.id
                if (!isUUID(vendorId)) {
                    return res
                        .status(400)
                        .json(errorResponse('Vendor id is not valid uuid'))
                }
                const dataObj = req.body
                const result = await vendorProfileRepo.saveVendorOcean(
                    vendorId,
                    dataObj
                )
                return res.status(result.statusCode).json(result)
            } catch (err) {
                return res
                    .status(500)
                    .json(errorResponse('Could not create vendor'))
            }
        }
    )

    // POST vendors/:id/coverageCountries
    app.post('/api/vendors/:id/coverageCountries', auth, async (req, res) => {
        try {
            const vendorId = req.params.id
            if (!isUUID(vendorId)) {
                return res
                    .status(400)
                    .json(errorResponse('Vendor id is not valid uuid'))
            }
            const dataObj = req.body
            if (!dataObj.country) {
                return res
                    .status(400)
                    .json(errorResponse('country is required'))
            }
            if (dataObj.country.length !== 2) {
                return res
                    .status(400)
                    .json(errorResponse('country should be 2 letter code'))
            }
            const result = await vendorProfileRepo.saveVendorsCoverageCountry(
                vendorId,
                dataObj
            )
            return res.status(result.statusCode).json(result)
        } catch (err) {
            return res
                .status(500)
                .json(errorResponse('Could not create vendor coverage country'))
        }
    })

    // GET vendors/:id/coverageCountries
    app.get('/api/vendors/:id/coverageCountries', auth, async (req, res) => {
        try {
            const vendorId = req.params.id
            if (!isUUID(vendorId)) {
                return res
                    .status(400)
                    .json(errorResponse('Vendor id is not valid uuid'))
            }
            const result = await vendorProfileRepo.getVendorsCoverageCountry(
                vendorId
            )
            return res.status(result.statusCode).json(result)
        } catch (err) {
            return res.status(500).json(errorResponse('Could not get vendor'))
        }
    })

    // GET getVendorsCoverageCountryByCountry
    app.get(
        '/api/vendors/coverageCountries/:country',
        auth,
        async (req, res) => {
            try {
                const country = req.params.country
                if (country.length !== 2 || !isAlpha(country)) {
                    return res
                        .status(400)
                        .json(errorResponse('Country should be 2 letter code'))
                }
                const result =
                    await vendorProfileRepo.getVendorsCoverageCountryByCountry(
                        country
                    )
                return res.status(result.statusCode).json(result)
            } catch (err) {
                return res
                    .status(500)
                    .json(
                        errorResponse('Could not get vendor coverage country')
                    )
            }
        }
    )

    const isAlpha = (str) => {
        return /^[a-zA-Z]+$/.test(str)
    }

    //// arcBest rate service
    app.post(
        '/api/test-vendors/arcbest',
        auth,
        validate(arcBestRateSchema),
        async (req, res) => {
            try {
                const data = req.body
                const result = await arcBestService(data)
                return res.status(result.statusCode).send(result)
            } catch (err) {
                logger.error('Error on arcBest api,Function api err=>', err)
                return res
                    .status(500)
                    .json(errorResponse('Could not get ArcBest rate'))
            }
        }
    )
    // forward air service
    app.post(
        '/api/test-vendors/forwardair',
        auth,
        validate(forwardAirRateSchema),
        async (req, res) => {
            try {
                const data = req.body
                const result = await forwardAirService(data)
                return res.status(result.statusCode).send(result)
            } catch (err) {
                logger.error('Error on forward air api,Function api err=>', err)
                return res
                    .status(500)
                    .json(errorResponse('Could not get forward air rate'))
            }
        }
    )

    app.post(
        '/api/test-vendors/yrc',
        auth,
        validate(yrcRateSchema),
        async (req, res) => {
            try {
                const data = req.body
                const result = await yrcService(data)
                return res.status(result.statusCode).send(result)
            } catch (err) {
                return res
                    .status(500)
                    .json(errorResponse('Could not get yrc api rate'))
            }
        }
    )

    // yrc tracking service
    app.post('/api/test-vendors/yrc/tracking', auth, async (req, res) => {
        try {
            const data = req.body
            const result = await yrcTrackingService(data)
            return res.status(result.statusCode).json(result)
        } catch (err) {
            logger.error('Error on yrcTrackingService, Function err=>', err)
            return res
                .status(500)
                .json(errorResponse('Could not get yrc tracking', 500))
        }
    })

    // yrc document service
    app.post('/api/test-vendors/yrc/document', auth, async (req, res) => {
        try {
            const data = req.body
            const result = await yrcDocumentService(data)
            return res.status(result.statusCode).send(result)
        } catch (err) {
            logger.error('Error on yrcDocumentService, Function err=>', err)
            return res
                .status(500)
                .json(errorResponse('Could not get yrc document', 500))
        }
    })

    // new penn api service
    app.post(
        '/api/test-vendors/newpenn',
        auth,
        validate(newPennRateSchema),
        async (req, res) => {
            try {
                const data = req.body
                const result = await newPennService(data)
                return res.status(result.statusCode).send(result)
            } catch (err) {
                return res
                    .status(500)
                    .json(errorResponse('Could not get new penn api rate'))
            }
        }
    )

    //// usfHolland rate service
    app.post(
        '/api/test-vendors/holland',
        auth,
        validate(usfRateSchema),
        async (req, res) => {
            try {
                const data = req.body
                const result = await usfHollandService(data)
                return res.status(result.statusCode).send(result)
            } catch (err) {
                logger.error('Error on usfHolland APi ,Function api err=>', err)
                return res
                    .status(500)
                    .json(errorResponse('Could not get USFHolland rate'))
            }
        }
    )

    app.post('/api/test-vendors/holland/tracking', auth,validate(usfTrackingSchema), async (req, res) => {
        try {
            const data = req.body.trackingNumber
            const result = await usfHollandServiceTracking(data)
            return res.status(result.statusCode).json(result)
        } catch (err) {
            logger.error('Error on Holland Tracking, Function err=>', err)
            return res
                .status(500)
                .json(errorResponse('Could not get Holland tracking', 500))
        }
    })
    app.post('/api/test-vendors/holland/document', auth, async (req, res) => {
        try {
            const trackingNumber = req.body.trackingNumber
            const docType = req.body.docType
            const result = await usfHollandServiceDocumentTracking(
                trackingNumber,
                docType
            )
            return res.status(result.statusCode).json(result)
        } catch (err) {
            logger.error('Error on Holland doc Tracking, Function err=>', err)
            return res
                .status(500)
                .json(errorResponse('Could not get Holland doc tracking', 500))
        }
    })

    //// usfHolland rate service
    app.post(
        '/api/test-vendors/reddaway',
        auth,
        validate(usfRateSchema),
        async (req, res) => {
            try {
                const data = req.body
                const result = await usfReddawayService(data)
                return res.status(result.statusCode).send(result)
            } catch (err) {
                logger.error(
                    'Error on usfReddawayService APi ,Function api err=>',
                    err
                )
                return res
                    .status(500)
                    .json(
                        errorResponse('Could not get usfReddawayService rate')
                    )
            }
        }
    )
    app.post('/api/test-vendors/reddaway/tracking', auth,validate(usfTrackingSchema), async (req, res) => {
        try {
            const data = req.body.trackingNumber
            const result = await usfReddawayServiceTracking(data)
            return res.status(result.statusCode).json(result)
        } catch (err) {
            logger.error('Error on Reddaway Tracking, Function err=>', err)
            return res
                .status(500)
                .json(errorResponse('Could not get Reddaway tracking', 500))
        }
    })

    app.post('/api/test-vendors/reddaway/document', auth, async (req, res) => {
        try {
            const trackingNumber = req.body.trackingNumber
            const docType = req.body.docType
            const result = await usfReddawayServiceDocumentTracking(
                trackingNumber,
                docType
            )

            return res.status(result.statusCode).json(result)
        } catch (err) {
            logger.error('Error on Reddaway doc Tracking, Function err=>', err)
            return res
                .status(500)
                .json(errorResponse('Could not get Reddaway doc tracking', 500))
        }
    })

    //// daylight transport service
    app.post(
        '/api/test-vendors/daylight',
        auth,
        validate(daylightRateSchema),
        async (req, res) => {
            try {
                const data = req.body
                const result = await daylightService(data)
                return res.status(result.statusCode).send(result)
            } catch (err) {
                logger.error('Error on daylight api, Function api err=>', err)
                return res
                    .status(500)
                    .json(errorResponse('Could not get Daylight rate'))
            }
        }
    )

    //// dhl service
    app.post(
        '/api/test-vendors/dhl',
        auth,
        validate(dhlRateSchema),
        async (req, res) => {
            try {
                const data = req.body
                const result = await dhlService(data)
                return res.status(result.statusCode).send(result)
            } catch (err) {
                logger.error('Error on dhl api, Function api err=>', err)
                return res
                    .status(500)
                    .json(errorResponse('Could not get dhl rate'))
            }
        }
    )

    //// xpo logistics service
    app.post(
        '/api/test-vendors/xpo',
        auth,
        validate(xpoRateSchema),
        async (req, res) => {
            try {
                const data = req.body
                const result = await xpoService(data)
                return res.status(result.statusCode).send(result)
            } catch (err) {
                logger.error('Error on xpo api, Function api err=>', err)
                return res
                    .status(500)
                    .json(errorResponse('Could not get xpo rate'))
            }
        }
    )

    // xpo logistics tracking service
    app.post('/api/test-vendors/xpo/tracking', auth, async (req, res) => {
        try {
            const data = req.body
            const result = await xpoTrackingService(data)
            return res.status(result.statusCode).json(result)
        } catch (err) {
            logger.error('Error on xpoTrackingService, Function err=>', err)
            return res
                .status(500)
                .json(errorResponse('Could not get xpo tracking', 500))
        }
    })

    // xpo logistics document service
    app.post(
        '/api/test-vendors/xpo/document',
        auth,
        validate(xpoDocumentSchema),
        async (req, res) => {
            try {
                const data = req.body
                const result = await xpoDocumentService(data)
                return res.status(result.statusCode).json(result)
            } catch (err) {
                logger.error('Error on xpoDocumentService, Function err=>', err)
                return res
                    .status(500)
                    .json(errorResponse('Could not get xpo document', 500))
            }
        }
    )

    //// jp express service
    app.post(
        '/api/test-vendors/jpexpress',
        auth,
        validate(jpExpressRateSchema),
        async (req, res) => {
            try {
                const data = req.body
                const result = await jpExpressService(data)
                return res.status(result.statusCode).send(result)
            } catch (err) {
                logger.error('Error on jp express api, Function api err=>', err)
                return res
                    .status(500)
                    .json(errorResponse('Could not get jp express rate'))
            }
        }
    )

    //Save vendors limitation by vendors id
    app.post(
        '/api/vendors/:id/limits',
        auth,
        validate(vendorsLimitSchema),
        async (req, res) => {
            try {
                const vendorId = req.params.id
                if (!isUUID(vendorId)) {
                    return res
                        .status(400)
                        .json(errorResponse('Vendor id is not valid uuid'))
                }
                const response = await saveVendorsLimit(vendorId, req.body)
                return res.status(response.statusCode).json(response)
            } catch (err) {
                return res.status(500).json('something wrong in vendors limit ')
            }
        }
    )

    ////Get vendors limitation by vendors id

    app.get('/api/vendors/:id/limits', async (req, res) => {
        try {
            const id = req.params.id
            const response = await getVendorsLimitByVenId(id)
            return res.status(response.statusCode).send(response)
        } catch (err) {
            return res
                .status(500)
                .json('Something wrong get vendors limitation......')
        }
    })

    //Save vendors limitation by vendors id
    app.post(
        '/api/vendors/:id/equipmentTypes',
        auth,
        validate(vendorsEquipmentTypeIdSchema),
        async (req, res) => {
            try {
                const vendorId = req.params.id
                const equipmentTypesId = req.body.equipmentTypesId
                if (!isUUID(vendorId)) {
                    return res
                        .status(400)
                        .json(errorResponse('Vendor id is not valid uuid'))
                }

                const response = await saveVendorsEquipmentsTypeById(
                    vendorId,
                    equipmentTypesId
                )
                return res.status(response.statusCode).json(response)
            } catch (err) {
                return res.status(500).json('something wrong in vendors limit ')
            }
        }
    )

    //Get vendors limitation by vendors id
    app.get('/api/vendors/:id/equipmentTypes', auth, async (req, res) => {
        try {
            const vendorId = req.params.id
            if (!isUUID(vendorId)) {
                return res
                    .status(400)
                    .json(errorResponse('Vendor id is not valid uuid'))
            }

            const response = await getVendorsEquipmentsTypeByVendorsId(vendorId)
            return res.status(response.statusCode).json(response)
        } catch (err) {
            return res.status(500).json('something wrong in vendors limit ')
        }
    })

    app.get(
        '/api/vendors/equipmentTypes/:equipmentTypesId',
        auth,
        async (req, res) => {
            try {
                const id = req.params.equipmentTypesId
                const response = await getVendorsByEquipmentId(id)
                return res.status(200).send(response)
            } catch (err) {
                return res.status(500).json('Something Wrong....')
            }
        }
    )

    //// testVendor all rate service
    app.post(
        '/api/test-vendors/all',
        validate(allVendorsRateScema),
        auth,
        async (req, res) => {
            try {
                const data = req.body
                const result = await getAllVendorsRate(data)
                return res.status(result.statusCode).send(result)
            } catch (err) {
                logger.error(
                    'Error on test-vendor all rate APi ,Function api err=>',
                    err
                )
                return res
                    .status(500)
                    .json(errorResponse('Could not get all rate'))
            }
        }
    )

    //// jp express service
    app.post(
        '/api/test-vendors/wardrate',
        validate(wardRateSchema),
        async (req, res) => {
            try {
                const data = req.body
                const result = await wardService(data)
                return res.status(result.statusCode).send(result)
            } catch (err) {
                logger.error(
                    'Error on wardApi rate api, Function api err=>',
                    err
                )
                return res
                    .status(500)
                    .json(errorResponse('Could not get wardApi rate'))
            }
        }
    )

    app.post('/api/vendors/:id/ground', async (req, res) => {
        try {
            const id = req.params.id
            const data = req.body
            const result = await saveVendorsGround(id, data)
            return res.status(result.statusCode).send(result)
        } catch (err) {
            logger.error('Error on saveVendorsGround, Function api err=>', err)
            return res
                .status(500)
                .json(errorResponse('Failed to save vendors ground data'))
        }
    })
}

module.exports = vendorRoutes
