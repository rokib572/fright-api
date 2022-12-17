const getMileageBetweenTwoPoint = require(`${__base}service/getMileageBetweenTwoPoint`)
const locationRepo = require(`${__base}database/repo/location/locationRepo`)
const contactLocationRepo = require(`${__base}database/repo/location/contactLocationRepo`)
const validate = require(`${__base}utils/validate`)
const zoneCodeGen = require(`${__base}middlwares/zoneCodeGen`)
const auth = require(`${__base}utils/auth`)
const { errorResponse } = require(`${__base}helpers`)
const { validate: isUUID } = require('uuid')

const {
    createLocationSchema,
    updateLocationSchema,
    createLocationProfileSchema,
    createLocationShippingSchema,
    createLocationReceivingSchema,
    getLocationByQuery,
    updateLocationProfileSchema,
} = require('./locationValidate')

const locationRoutes = async (app) => {
    app.post(
        '/api/locations',
        auth,
        validate(createLocationSchema),
        zoneCodeGen,
        async (req, res) => {
            try {
                const data = req.body
                data['createdBy'] = req.userId
                data['modifiedBy'] = req.userId
                data['isSFS'] = data['isSFS'] ? 1 : 0
                data['isClient'] = data['isClient'] ? 1 : 0
                data['isVendor'] = data['isVendor'] ? 1 : 0
                const result = await locationRepo.saveLocation(data)
                return res.status(result.statusCode).send(result)
            } catch (error) {
                return res.status(error.statusCode).send(error)
            }
        }
    )

    app.get('/api/locations/:id', auth, async (req, res) => {
        try {
            const result = await locationRepo.getLocationById(req.params.id)
            return res.status(result.statusCode).send(result)
        } catch (error) {
            return res.status(error.statusCode).send(error)
        }
    })

    app.get(
        '/api/locations',
        auth,
        validate(getLocationByQuery),
        async (req, res) => {
            try {
                let page = req.query.page || false
                if (page && !Number.isInteger(Number(page))) {
                    return res
                        .status(400)
                        .send(errorResponse('Page must be a number'))
                }
                page && page <= 0 ? (page = 1) : page
                if (
                    req.query.searchName ||
                    req.query.searchPostalCode ||
                    req.query.searchCountry
                ) {
                    const result = await locationRepo.getLocationByQuery(
                        req.query
                    )
                    return res.status(result.statusCode).send(result)
                }
                if (Object.keys(req.query).length > 0) {
                    return res
                        .status(400)
                        .send(errorResponse('Invalid query params'))
                }
                const result = await locationRepo.getAllLocations(page)
                return res.status(result.statusCode).send(result)
            } catch (error) {
                return res.status(400).send(error)
            }
        }
    )

    app.patch(
        '/api/locations/:locationId',
        auth,
        validate(updateLocationSchema),
        zoneCodeGen,
        async (req, res) => {
            try {
                const data = req.body
                data['modifiedBy'] = req.userId
                data['isSFS'] = data['isSFS'] ? 1 : 0
                const result = await locationRepo.updateLocation(
                    req.params.locationId,
                    data
                )
                return res.status(result.statusCode).send(result)
            } catch (error) {
                return res.status(error.statusCode).send(error)
            }
        }
    )

    app.delete('/api/locations/:locationId', auth, async (req, res) => {
        try {
            const locationId = req.params.locationId
            const result = await locationRepo.deleteLocation(locationId)
            return res.status(result.statusCode).send(result)
        } catch (error) {
            return res.status(error.statusCode).send(error)
        }
    })

    //get distance between two locations by query params
    app.post('/api/getMilage', async (req, res) => {
        const { from, to } = req.body
        try {
            const result = await getMileageBetweenTwoPoint(from, to)
            return res.status(200).json(result)
        } catch (err) {
            return res.status(err.statusCode).send(err)
        }
    })

    app.post('/api/contacts/:id/locations', auth, async (req, res) => {
        try {
            const contactId = req.params.id
            const { locationsId } = req.body
            if (!isUUID(contactId)) {
                return res
                    .status(400)
                    .send(errorResponse('contactId should be UUID'))
            }
            if (!isUUID(locationsId)) {
                return res
                    .status(400)
                    .send(errorResponse('locationsId should be UUID'))
            }
            const result = await contactLocationRepo.saveLocationId(
                contactId,
                locationsId
            )
            return res.status(result.statusCode).send(result)
        } catch (error) {
            return res.status(error.statusCode).send(error)
        }
    })

    app.delete(
        '/api/contacts/:id/locations/:locationsId',
        auth,
        async (req, res) => {
            try {
                const contactId = req.params.id
                const locationsId = req.params.locationsId
                if (!isUUID(contactId)) {
                    return res
                        .status(400)
                        .send(errorResponse('contactId should be UUID'))
                }
                if (!isUUID(locationsId)) {
                    return res
                        .status(400)
                        .send(errorResponse('locationsId should be UUID'))
                }
                const result =
                    await contactLocationRepo.deleteLocationsByContactId(
                        contactId,
                        locationsId
                    )
                return res.status(result.statusCode).send(result)
            } catch (error) {
                return res.status(error.statusCode).send(error)
            }
        }
    )

    // POST /api/locations/:id/accessorials
    app.post('/api/locations/:id/accessorials', auth, async (req, res) => {
        try {
            const locationId = req.params.id
            const { accessorialsId } = req.body
            if (!accessorialsId)
                return res
                    .status(400)
                    .send(errorResponse('accessorialsId is required'))
            if (!isUUID(locationId)) {
                return res
                    .status(400)
                    .send(errorResponse('locationId should be UUID'))
            }
            if (!Number.isInteger(Number(accessorialsId))) {
                return res
                    .status(400)
                    .send(errorResponse('accessorialsId should be integer'))
            }
            const result = await locationRepo.saveLocationAccessorial(
                locationId,
                accessorialsId
            )
            return res.status(result.statusCode).send(result)
        } catch (error) {
            return res.status(error.statusCode).send(error)
        }
    })

    app.get('/api/locations/:id/accessorials', auth, async (req, res) => {
        try {
            const locationId = req.params.id
            if (!isUUID(locationId)) {
                return res
                    .status(400)
                    .send(errorResponse('locationId should be UUID'))
            }
            const result = await locationRepo.getAccessorialsByLocationId(
                locationId
            )
            return res.status(result.statusCode).send(result)
        } catch (error) {
            return res.status(error.statusCode).send(error)
        }
    })

    app.post(
        '/api/locations/:id/profile',
        auth,
        validate(createLocationProfileSchema),
        async (req, res) => {
            try {
                const locationId = req.params.id
                if (!isUUID(locationId)) {
                    return res
                        .status(400)
                        .send(errorResponse('locationId should be UUID'))
                }
                const data = req.body
                data['createdBy'] = req.userId
                data['modifiedBy'] = req.userId
                const result = await locationRepo.saveLocationProfile(
                    locationId,
                    data
                )
                return res.status(result.statusCode).send(result)
            } catch (error) {
                return res.status(error.statusCode).send(error)
            }
        }
    )

    app.get('/api/locations/:id/profile', auth, async (req, res) => {
        try {
            const locationId = req.params.id
            if (!isUUID(locationId)) {
                return res
                    .status(400)
                    .send(errorResponse('locationId should be UUID'))
            }
            const result = await locationRepo.getLocationProfile(locationId)
            return res.status(result.statusCode).send(result)
        } catch (error) {
            return res.status(error.statusCode).send(error)
        }
    })

    app.post(
        '/api/locations/:id/shipping',
        auth,
        validate(createLocationShippingSchema),
        async (req, res) => {
            try {
                const locationId = req.params.id
                if (!isUUID(locationId)) {
                    return res
                        .status(400)
                        .send(errorResponse('locationId should be UUID'))
                }

                const data = req.body
                data['createdBy'] = req.userId
                data['modifiedBy'] = req.userId
                const result = await locationRepo.saveLocationShipping(
                    locationId,
                    data
                )
                return res.status(result.statusCode).send(result)
            } catch (error) {
                return res.status(error.statusCode).send(error)
            }
        }
    )

    app.get('/api/locations/:id/shipping', auth, async (req, res) => {
        try {
            const locationId = req.params.id
            if (!isUUID(locationId)) {
                return res
                    .status(400)
                    .send(errorResponse('locationId should be UUID'))
            }
            const result = await locationRepo.getLocationShipping(locationId)
            return res.status(result.statusCode).send(result)
        } catch (error) {
            return res.status(error.statusCode).send(error)
        }
    })

    app.patch(
        '/api/locations/:id/shipping',
        auth,
        validate(createLocationShippingSchema),
        async (req, res) => {
            try {
                const locationId = req.params.id
                if (!isUUID(locationId)) {
                    return res
                        .status(400)
                        .send(errorResponse('locationId should be UUID'))
                }
                const data = req.body
                data['modifiedBy'] = req.userId
                const result = await locationRepo.updateLocationShipping(
                    locationId,
                    data
                )
                return res.status(result.statusCode).send(result)
            } catch (error) {
                return res.status(error.statusCode).send(error)
            }
        }
    )

    app.post(
        '/api/locations/:id/receiving',
        auth,
        validate(createLocationReceivingSchema),
        async (req, res) => {
            try {
                const locationId = req.params.id
                if (!isUUID(locationId)) {
                    return res
                        .status(400)
                        .send(errorResponse('locationId should be UUID'))
                }
                const data = req.body
                data['createdBy'] = req.userId
                data['modifiedBy'] = req.userId
                const result = await locationRepo.saveLocationReceiving(
                    locationId,
                    data
                )
                return res.status(result.statusCode).send(result)
            } catch (error) {
                return res.status(error.statusCode).send(error)
            }
        }
    )

    app.get('/api/locations/:id/receiving', auth, async (req, res) => {
        try {
            const locationId = req.params.id
            if (!isUUID(locationId)) {
                return res
                    .status(400)
                    .send(errorResponse('locationId should be UUID'))
            }
            const result = await locationRepo.getLocationReceiving(locationId)
            return res.status(result.statusCode).send(result)
        } catch (error) {
            return res.status(error.statusCode).send(error)
        }
    })

    app.patch(
        '/api/locations/:id/receiving',
        auth,
        validate(createLocationReceivingSchema),
        async (req, res) => {
            try {
                const locationId = req.params.id
                if (!isUUID(locationId)) {
                    return res
                        .status(400)
                        .send(errorResponse('locationId should be UUID'))
                }
                const data = req.body
                data['modifiedBy'] = req.userId
                const result = await locationRepo.updateLocationReceiving(
                    locationId,
                    data
                )
                return res.status(result.statusCode).send(result)
            } catch (error) {
                return res.status(error.statusCode).send(error)
            }
        }
    )

    app.get('/api/locations/:id/weather', auth, async (req, res) => {
        try {
            const locationId = req.params.id
            if (!isUUID(locationId)) {
                return res
                    .status(400)
                    .send(errorResponse('locationId should be UUID'))
            }
            const result = await locationRepo.getLocationWeather(locationId)
            return res.status(result.statusCode).send(result)
        } catch (error) {
            return res.status(error.statusCode).send(error)
        }
    })

    //Patch Location Profile by  id

    app.patch(
        '/api/locations/:id/profile',
        auth,
        validate(updateLocationProfileSchema),

        async (req, res) => {
            try {
                const locationId = req.params.id
                if (!isUUID(locationId)) {
                    return res
                        .status(400)
                        .send(errorResponse('locationId should be UUID'))
                }
                const data = req.body
                data.id = req.params.id
                data['modifiedBy'] = req.userId
                const result = await locationRepo.updateLocationProfileById(
                    data
                )
                return res.status(200).send(result)
            } catch (err) {
                return res.status(500).json('Something Wrong....')
            }
        }
    )
}

module.exports = locationRoutes
