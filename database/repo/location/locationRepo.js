const { generateUUID } = require('../../../service/authService')
const logger = require(`${__base}/utils/logger`)
const getLatLngByAddress = require(`${__base}service/getLatLngByAddress`)
const {
    getTimeZoneByLocation,
} = require(`${__base}service/timeZoneDbApi/timeZoneDbApiService`)
const {
    createClientProfile,
    getClientByLocationId,
} = require(`${__base}database/repo/client/clientProfileRepo`)
const {
    createVendorProfile,
    getVendorByLocationId,
} = require(`${__base}database/repo/vendor/vendorProfileRepo`)
const {
    getTimeZoneIdByZoneCode,
} = require(`${__base}database/repo/catalog/timeZoneRepo`)
const { successResponse, errorResponse } = require(`${__base}helpers`)
const {
    getWeatherByLocation,
} = require('../../../service/WeatherApi/weatherApiService')
const { checkHours } = require('../../../routes/location/locationValidate')
const usersLocation = require('../../models/usersLocation')
const catalogAccessorial = require('../../models/catalogAccessorial')
const locationsProfile = require('../../models/locationsProfile')
const locationsShipping = require('../../models/locationsShipping')
const locationsAccessorials = require('../../models/locationsAccessorials')
const locationsReceiving = require('../../models/locationsReceiving')
const DateTime = require('../../../utils/DateTime')
const customQuery = require('../../models/customQuery')
const { isInDaylight } = require('./formatter')
const getUtcTime = require('../../../utils/getUTCTime')
const {
    fahrenheitToCelsius,
    kelvinToCelsius,
    kelvinToFahrenheit,
} = require('../../../utils/converter')

const saveLocation = async (data) => {
    try {
        let {
            companyAddress1,
            companyAddress2,
            companyCity,
            companyProvince,
            companyCountry,
            isClient,
            isVendor,
        } = data

        const locationsId = generateUUID()

        let companyFullAddress = ''

        if (companyAddress1) {
            companyAddress1 = companyAddress1.split(' ').join('+')
            companyFullAddress += companyAddress1
        }
        if (companyAddress2) {
            companyAddress2 = companyAddress2.split(' ').join('+')
            companyFullAddress += `%2C+${companyAddress2}`
        }
        if (companyCity) {
            companyCity = companyCity.split(' ').join('+')
            companyFullAddress += `%2C+${companyCity}`
        }
        if (companyProvince) {
            companyProvince = companyProvince.split(' ').join('+')
            companyFullAddress += `%2C+${companyProvince}`
        }
        if (companyCountry) {
            companyCountry = companyCountry.split(' ').join('+')
            companyFullAddress += `%2C+${companyCountry}`
        }

        const { status, result } = await getLatLngByAddress(companyFullAddress)
        // const { status, result } = {
        //   status: 'success',
        //   result: {
        //     lat: '-37.81411',
        //     lng: '144.96328',
        //   },
        // }

        if (status !== 'success') {
            logger.error('Could not get location lat/lng')
            return errorResponse('Could not get location lat/lng')
        }

        const { lat, lng } = result
        const timZoneResponse = await getTimeZoneByLocation(lat, lng)
        if (timZoneResponse.status !== 'success') {
            return errorResponse('Could not get timezone by lat/lng')
        }
        const timeZoneDetails = timZoneResponse.result
        const zodeId = await getTimeZoneIdByZoneCode(timeZoneDetails)
        data['id'] = locationsId
        data['latitude'] = lat
        data['longitude'] = lng
        data['timeZone'] = zodeId
        data['isSFS'] = data['isSFS'] ? 1 : 0
        // delete data.isClient
        // delete data.isVendor
        delete data.isDeleted

        await usersLocation.save(data)

        if (isClient === true || isClient == 1) {
            createClientProfile(locationsId, data.createdBy)
        }

        if (isVendor === true || isVendor == 1) {
            createVendorProfile(locationsId, data.createdBy)
        }

        const locationsProfileObj = {
            locationsId: locationsId,
            createdBy: data.createdBy,
            createdDate: DateTime.getCurrentTime(),
            modifiedDate: DateTime.getCurrentTime(),
            modifiedBy: data.modifiedBy,
        }

        const locationsShippingObj = {
            locationsId: locationsId,
            requiresAppt: 0,
            hours: JSON.stringify(dataHours),
            shippingDocks: '[]',
        }

        const locationsReceivingObj = {
            locationsId: locationsId,
            requiresAppt: 0,
            hours: JSON.stringify(dataHours),
            receivingDocks: '[]',
        }

        Promise.all([
            locationsProfile.save(locationsProfileObj),
            locationsShipping.save(locationsShippingObj),
            locationsReceiving.save(locationsReceivingObj),
        ])

        return successResponse('Location inserted')
    } catch (err) {
        logger.error('Error in saveLocation_function. Error =>', err)
        return errorResponse('Could not save location data')
    }
}

const getLocationById = async (locationId) => {
    try {
        const result = await customQuery.callProcedure('get_loc_details', [
            locationId,
        ])

        if (result.length === 0) {
            return errorResponse('Location not found')
        }

        const location = result[0]
        const timeZoneDetails = JSON.parse(location.timeZone)
        location.timeZone = {
            id: timeZoneDetails.id,
            label: timeZoneDetails.label,
            offset: isInDaylight()
                ? timeZoneDetails.offset_dst
                : timeZoneDetails.offset,
        }

        let locAcc = []
        locAcc.push(JSON.parse(location.locationAccessorials))
        location.locationAccessorials = locAcc
        // for (const key in location.locationAccessorials) {
        //   if (location.locationAccessorials[key] === null) {
        //     delete location.locationAccessorials[key]
        //   }
        // }
        location.locationsProfile = JSON.parse(location.locationsProfile)
        for (const key in location.locationsProfile) {
            if (location.locationsProfile[key] === null) {
                delete location.locationsProfile[key]
            }
        }
        location.locationsReceiving = JSON.parse(location.locationsReceiving)
        location.locationsReceiving.hours = JSON.parse(
            location.locationsReceiving.hours
        )
        location.locationsReceiving.receivingDocks = location.locationsReceiving
            .receivingDocks
            ? JSON.parse(location.locationsReceiving.receivingDocks)
            : []

        location.locationsReceiving.shippingInstructions = location
            .locationsReceiving.shippingInstructions
            ? location.locationsReceiving.shippingInstructions
            : ''
        for (const key in location.locationsReceiving) {
            if (location.locationsReceiving[key] === null) {
                delete location.locationsReceiving[key]
            }
        }

        location.locationsShipping = JSON.parse(location.locationsShipping)
        // let a = JSON.parse(location.locationsShipping)
        // delete location.locationsShipping
        // delete location.locationsReceiving

        location.locationsShipping.hours = JSON.parse(
            location.locationsShipping.hours
        )
        location.locationsShipping.shippingDocks = location.locationsShipping
            .shippingDocks
            ? JSON.parse(location.locationsShipping.shippingDocks)
            : []
        // location.shippingDocks = JSON.parse(a.shippingDocks)
        location.locationsShipping.shippingInstructions = location
            .locationsShipping.shippingInstructions
            ? location.locationsShipping.shippingInstructions
            : ''
        for (const key in location.locationsShipping) {
            if (location.locationsShipping[key] === null) {
                delete location.locationsShipping[key]
            }
        }

        const clientInfo = await getClientByLocationId(location.id, 'single')
        const vendorInfo = await getVendorByLocationId(location.id, 'single')
       // location['isClient'] = false
        location['clientInfo'] = {}
       // location['isVendor'] = false
        location['vendorInfo'] = {}
        if (clientInfo.length > 0) {
          //  location['isClient'] = true
            location['clientInfo'] = clientInfo[0]
        }
        if (vendorInfo.length > 0) {
           // location['isVendor'] = true
            location['vendorInfo'] = vendorInfo[0]
        }
        delete location.isDeleted
        return successResponse(location)
    } catch (err) {
        logger.error('Error in getLocationById_function. Error =>', err)
        return errorResponse('Could not get location')
    }
}

const getLocationByQuery = async (query) => {
    try {
        const columns = `id,companyName,companyAddress1,companyAddress2,companyCity,companyProvince,companyPostalCode,companyCountry,timeZone,isSFS,zoneCode,latitude,longitude`

        let sql = `SELECT ${columns} FROM locations`
        let where = ''
        if (query.searchName) {
            where += ` WHERE companyName LIKE '%${query.searchName.toLowerCase()}%'`
        }
        if (query.searchPostalCode) {
            if (where.length > 0) {
                where += ` AND companyPostalCode LIKE '%${query.searchPostalCode}%'`
            } else {
                where += ` WHERE companyPostalCode LIKE '%${query.searchPostalCode}%'`
            }
        }
        if (query.searchCountry) {
            const companyCountry = query.searchCountry.toLowerCase()
            const countryF1 = companyCountry
            let countryF2 = companyCountry
            if (companyCountry === 'ca' || companyCountry === 'cn') {
                countryF2 = 'canada'
            }
            if (companyCountry === 'us' || companyCountry === 'usa') {
                countryF2 = 'united states'
            }
            if (where.length > 0) {
                where += ` AND (companyCountry LIKE '%${countryF1}%' OR companyCountry LIKE '%${countryF2}%')`
            } else {
                where += ` WHERE (companyCountry LIKE '%${countryF1}%' OR companyCountry LIKE '%${countryF2}%' )`
            }
        }
        where +=
            where.length > 0
                ? ' AND isDeleted = 0 LIMIT 1'
                : ' WHERE isDeleted = 0 LIMIT 1'
        sql += where
        const locations = await customQuery.query(sql)
        if (locations.length === 0) {
            return errorResponse('No location found', 404)
        }
        const timeZoneDetails = await Promise.all(
            locations.map(async (location) => {
                const timeZoneDetails = await getTimeZoneDetailsById(
                    location.timeZone
                )
                location['timeZone'] = timeZoneDetails
                const clientInfo = await getClientByLocationId(
                    location.id,
                    'single'
                )
                const vendorInfo = await getVendorByLocationId(
                    location.id,
                    'single'
                )
                location['isClient'] = false
                location['clientInfo'] = []
                location['isVendor'] = false
                location['vendorInfo'] = []
                if (clientInfo.length > 0) {
                    location['isClient'] = true
                    location['clientInfo'] = clientInfo
                }
                if (vendorInfo.length > 0) {
                    location['isVendor'] = true
                    vendorInfo.forEach((vendor) => {
                        delete vendor.blackListed
                        delete vendor.vendorsCoverage
                        delete vendor.vendorsAccessorials
                        delete vendor.vendorsAir
                        delete vendor.vendorsOcean
                        delete vendor.vendorsCoverageCountry
                        delete vendor.vendorsLimits
                    })
                    location['vendorInfo'] = vendorInfo
                }
                return location
            })
        )
        return successResponse(timeZoneDetails)
    } catch (err) {
        logger.error('Error in getLocationByQuery_function. Error =>', err)
        return errorResponse('Could not get locations')
    }
}

const getTimeZoneDetailsById = async (timeZoneId) => {
    try {
        let sql = `SELECT id, timezone, offset, offset_dst FROM catalogTimeZones WHERE id = '${timeZoneId}'`
        const result = await customQuery.query(sql)

        if (result.length === 0) {
            return {}
        }
        return {
            id: result[0].id,
            label: result[0].timezone,
            offset: isInDaylight() ? result[0].offset_dst : result[0].offset,
        }
    } catch (err) {
        logger.error('Error in getTimeZoneDetailsById_function. Error =>', err)
        throw new Error('Could not get timezone details')
    }
}

const getAllLocations = async (page) => {
    try {
        let locations
        if (page) {
            locations = await usersLocation.get({
                columns: [
                    'id',
                    'companyName',
                    'companyAddress1',
                    'companyAddress2',
                    'companyCity',
                    'companyProvince',
                    'companyPostalCode',
                    'companyCountry',
                    'timeZone',
                    'isSFS',
                    'zoneCode',
                    'latitude',
                    'longitude',
                    'isDeleted',
                ],
                where: {
                    isDeleted: 0,
                },
                orderBy: 'companyName ASC',
                page: page,
                limit: 10,
            })
        } else {
            locations = await usersLocation.get({
                columns: [
                    'id',
                    'companyName',
                    'companyAddress1',
                    'companyAddress2',
                    'companyCity',
                    'companyProvince',
                    'companyPostalCode',
                    'companyCountry',
                    'timeZone',
                    'isSFS',
                    'zoneCode',
                    'latitude',
                    'longitude',
                    'isDeleted',
                ],
                where: {
                    isDeleted: 0,
                },
                orderBy: 'companyName ASC',
            })
        }
        if (locations.length > 0) {
            const locationDetails = await getClientAndVendorDetails(locations)
            const response = {
                statusCode: 200,
                status: 'success',
            }

            response.page = page ? page : 1
            response.limit = page
                ? `${page == 1 ? 1 : page * 10 - 9}-${
                      page == 1
                          ? locations.length
                          : page * 10 - 10 + locations.length
                  }`
                : `1-${locations.length}`
            response.result = locationDetails
            return response
        } else if (locations.length === 0) {
            return errorResponse('No locations found', 404)
        }
    } catch (er) {
        logger.error('Error in getAllLocations_function. Error =>', er)
        return errorResponse('Could not get locations')
    }
}

const getClientAndVendorDetails = async (locations) => {
    try {
        return new Promise((resolve) => {
            const modifiedResult = locations.map(async (location) => {
                const clientInfo = await getClientByLocationId(
                    location.id,
                    'all'
                )
                const vendorInfo = await getVendorByLocationId(
                    location.id,
                    'all'
                )
                location['isClient'] = false
                location['clientInfo'] = {}
                location['isVendor'] = false
                location['vendorInfo'] = {}
                if (clientInfo.length > 0) {
                    location['isClient'] = true
                    location['clientInfo'] = clientInfo[0]
                }
                if (vendorInfo.length > 0) {
                    location['isVendor'] = true
                    location['vendorInfo'] = vendorInfo[0]
                }
                delete location.isDeleted
                return location
            })
            Promise.all(modifiedResult).then((values) => {
                resolve(values)
            })
        })
    } catch (er) {
        logger.error(
            'Error in getClientAndVendorDetails_function. Error =>',
            er
        )
        return errorResponse('Could not get locations')
    }
}

const updateLocation = async (locationId, data) => {
    try {
        let {
            companyAddress1,
            companyAddress2,
            companyCity,
            companyProvince,
            companyCountry,
        } = data

        let companyFullAddress = ''

        if (companyAddress1) {
            companyAddress1 = companyAddress1.split(' ').join('+')
            companyFullAddress += companyAddress1
        }
        if (companyAddress2) {
            companyAddress2 = companyAddress2.split(' ').join('+')
            companyFullAddress += `%2C+${companyAddress2}`
        }
        if (companyCity) {
            companyCity = companyCity.split(' ').join('+')
            companyFullAddress += `%2C+${companyCity}`
        }
        if (companyProvince) {
            companyProvince = companyProvince.split(' ').join('+')
            companyFullAddress += `%2C+${companyProvince}`
        }
        if (companyCountry) {
            companyCountry = companyCountry.split(' ').join('+')
            companyFullAddress += `%2C+${companyCountry}`
        }

        if (
            companyFullAddress.length > 5 &&
            companyProvince &&
            companyCountry
        ) {
            const { status, result } = await getLatLngByAddress(
                companyFullAddress
            )
            if (status !== 'success') {
                return errorResponse('Could not get location lat/lng')
            }
            const { lat, lng } = result
            data['latitude'] = lat
            data['longitude'] = lng

            const timZoneResponse = await getTimeZoneByLocation(lat, lng)
            if (timZoneResponse.status !== 'success') {
                return errorResponse('Could not get timezone by lat/lng')
            }
            const timeZoneDetails = timZoneResponse.result
            const zodeId = await getTimeZoneIdByZoneCode(timeZoneDetails)
            data['timeZone'] = zodeId
        }
        const locationObj = {
            companyName: data.companyName,
            companyAddress1: data.companyAddress1,
            companyAddress2: data.companyAddress2,
            companyCity: data.companyCity,
            companyProvince: data.companyProvince,
            companyPostalCode: data.companyPostalCode,
            companyCountry: data.companyCountry,
            timeZone: data.timeZone,
            isSFS: data.isSFS ? 1 : 0,
            isClient: data.isClient ? 1 : 0,
            isVendor: data.isVendor ? 1 : 0,
            zoneCode: data.zoneCode,
            latitude: data.latitude,
            longitude: data.longitude,
            modifiedBy: data.modifiedBy,
            lastModified: DateTime.getCurrentTime(),
        }

        // loop through the object and remove all the empty values
        for (const key in locationObj) {
            if (locationObj[key] === undefined) {
                delete locationObj[key]
            }
        }

        const location = await usersLocation.update(locationObj, {
            where: {
                id: locationId,
                isDeleted: 0,
            },
        })
        if (!location) {
            return errorResponse('Location not found')
        }
        return successResponse('Location updated')
    } catch (err) {
        logger.error('Error in updateLocation_function. Error =>', err)
        return errorResponse('Could not update location')
    }
}

const deleteLocation = async (locationId) => {
    try {
        const location = await usersLocation.update(
            {
                isDeleted: 1,
                lastModified: DateTime.getCurrentTime(),
            },
            {
                where: {
                    id: locationId,
                    isDeleted: 0,
                },
            }
        )
        if (!location) {
            return errorResponse('Location not found')
        }
        return successResponse('Location deleted')
    } catch (err) {
        logger.error('Error in deleteLocation_function. Error =>', err)
        return errorResponse('Could not delete location')
    }
}

const saveLocationAccessorial = async (locationId, accessorialId) => {
    try {
        const [location, accessorial] = await Promise.all([
            usersLocation.get({
                where: {
                    id: locationId,
                    isDeleted: 0,
                },
            }),
            catalogAccessorial.get({
                where: {
                    id: accessorialId,
                },
            }),
        ])
        if (location.length === 0) {
            return errorResponse('Location not found')
        }
        if (accessorial.length === 0) {
            return errorResponse('Accessorial not found')
        }

        const isDeletable = await locationsAccessorials.delete({
            where: {
                locationsId: locationId,
                accessorialsId: accessorialId,
            },
        })
        if (isDeletable) {
            return successResponse('Location accessorial deleted')
        }
        await locationsAccessorials.save({
            locationsId: locationId,
            accessorialsId: accessorialId,
        })
        return successResponse('Location accessorial saved')
    } catch (err) {
        logger.error('Error in saveLocationAccessorial_function. Error =>', err)
        return errorResponse('Could not save location accessorial')
    }
}

const getAccessorialsByLocationId = async (locationId) => {
    try {
        const result = await customQuery.callProcedure('get_loc_accessorials', [
            locationId,
        ])
        if (result.length > 0) {
            return successResponse(result)
        }
        return successResponse([])
    } catch (err) {
        logger.error(
            'Error in getAccessorialsByLocationId_function. Error =>',
            err
        )
        return errorResponse('Could not get accessorials')
    }
}

const saveLocationProfile = async (locationId, data) => {
    try {
        const sql = `select loExists, locationsProfile.locationsId as lpExists from
    (select id as loExists from locations where id = '${locationId}' and isDeleted = 0) as T
    left join locationsProfile on T.loExists = locationsProfile.locationsId`
        const result = await customQuery.query(sql)
        if (result.length === 0) {
            return errorResponse('Location not found')
        }
        if (result.length > 0) {
            if (result[0].lpExists)
                return errorResponse('Location profile already exists')
            if (!result[0].loExists) return errorResponse('Location not found')
        }
        const dataObj = {
            locationsId: locationId,
            hasDock: data.hasDock,
            hasForklift: data.hasForklift,
            isAirport: data.isAirport,
            isCFS: data.isCFS,
            isResidence: data.isResidence,
            createdBy: data.createdBy,
            modifiedBy: data.modifiedBy,
            modifiedDate: DateTime.getCurrentTime(),
            createdDate: DateTime.getCurrentTime(),
        }
        await locationsProfile.save(dataObj)
        return successResponse('Location profile saved')
    } catch (err) {
        logger.error('Error in saveLocationProfile_function. Error =>', err)
        return errorResponse('Could not save location profile')
    }
}

const getLocationProfile = async (locationId) => {
    try {
        const sql = `select id as locationsProfileID, locationsId, hasDock, hasForklift, isAirport, isCFS, isResidence from
    (select id as loExists from locations where id = '${locationId}' and isDeleted = 0) as T
    join locationsProfile on T.loExists = locationsProfile.locationsId`
        const result = await customQuery.query(sql)
        if (result.length === 0) {
            return errorResponse('Location Profile not found')
        }
        return successResponse(result[0])
    } catch (err) {
        logger.error('Error in getLocationProfile_function. Error =>', err)
        return errorResponse('Could not get location profile')
    }
}

const saveLocationShipping = async (locationId, data) => {
    try {
        const validHours = checkHours(data.hours)
        if (validHours != 'YES') {
            return errorResponse(validHours)
        }
        const sql = `select loExists, locationsShipping.locationsId as lsExists from
    (select id as loExists from locations where id = '${locationId}' and isDeleted = 0) as T
    left join locationsShipping on T.loExists = locationsShipping.locationsId`
        const result = await customQuery.query(sql)
        if (result.length === 0) {
            return errorResponse('Location not found')
        }
        if (result.length > 0) {
            if (result[0].lsExists)
                return errorResponse('Location shipping already exists')
            if (!result[0].loExists) return errorResponse('Location not found')
        }
        const dataObj = {
            locationsId: locationId,
            requiresAppt: data.requiresAppt,
            hours: data.hours ? JSON.stringify(data.hours) : null,
            shippingDocks: data.shippingDocks
                ? JSON.stringify(data.shippingDocks)
                : null,
            shippingInstructions: data.shippingInstructions,
        }
        await locationsShipping.save(dataObj)
        return successResponse('Location shipping saved')
    } catch (err) {
        logger.error('Error in saveLocationShipping_function. Error =>', err)
        return errorResponse('Could not save location shipping')
    }
}

const getLocationShipping = async (locationId) => {
    try {
        const sql = `select id as locationsShippingID, locationsId, requiresAppt, hours, shippingDocks, shippingInstructions from
    (select id as loExists from locations where id = '${locationId}' and isDeleted = 0) as T
    join locationsShipping on T.loExists = locationsShipping.locationsId`
        const result = await customQuery.query(sql)
        if (result.length === 0) {
            return errorResponse('Shipping data not found', 404)
        }
        result.forEach((element) => {
            element.hours = JSON.parse(element.hours)
            element.shippingDocks = JSON.parse(element.shippingDocks)
        })
        return successResponse(result[0])
    } catch (err) {
        logger.error('Error in getLocationShipping_function. Error =>', err)
        return errorResponse('Could not get location shipping')
    }
}

const updateLocationShipping = async (locationId, data) => {
    try {
        const validHours = checkHours(data.hours)
        if (validHours != 'YES') {
            return errorResponse(validHours)
        }
        const sql = `select loExists, locationsShipping.locationsId as lsExists from
    (select id as loExists from locations where id = '${locationId}' and isDeleted = 0) as T
    left join locationsShipping on T.loExists = locationsShipping.locationsId`
        const result = await customQuery.query(sql)
        if (result.length === 0) {
            return errorResponse('Location not found')
        }
        if (result.length > 0) {
            if (!result[0].lsExists)
                return errorResponse('Location shipping does not exist')
            if (!result[0].loExists)
                return errorResponse('Location does not exist')
        }
        const dataObj = {
            locationsId: locationId,
            requiresAppt: data.requiresAppt,
            hours: data.hours ? JSON.stringify(data.hours) : null,
            shippingDocks: data.shippingDocks
                ? JSON.stringify(data.shippingDocks)
                : null,
            shippingInstructions: data.shippingInstructions,
        }
        await locationsShipping.update(dataObj, {
            where: {
                locationsId: locationId,
            },
        })
        return successResponse('Location shipping updated')
    } catch (err) {
        logger.error('Error in updateLocationShipping_function. Error =>', err)
        return errorResponse('Could not update location shipping')
    }
}

const saveLocationReceiving = async (locationId, data) => {
    try {
        const validHours = checkHours(data.hours)
        if (validHours != 'YES') {
            return errorResponse(validHours)
        }
        const sql = `select loExists, locationsReceiving.locationsId as lrExists from
    (select id as loExists from locations where id = '${locationId}' and isDeleted = 0) as T
    left join locationsReceiving on T.loExists = locationsReceiving.locationsId`
        const result = await customQuery.query(sql)
        if (result.length === 0) {
            return errorResponse('Location not found')
        }
        if (result.length > 0) {
            if (result[0].lrExists)
                return errorResponse('Location receiving already exists')
            if (!result[0].loExists) return errorResponse('Location not found')
        }
        const dataObj = {
            locationsId: locationId,
            requiresAppt: data.requiresAppt,
            hours: data.hours ? JSON.stringify(data.hours) : null,
            receivingDocks: data.receivingDocks
                ? JSON.stringify(data.receivingDocks)
                : null,
            receivingInstructions: data.receivingInstructions,
        }
        await locationsReceiving.save(dataObj)
        return successResponse('Location Receiving saved')
    } catch (err) {
        logger.error('Error in saveLocationReceiving_function. Error =>', err)
        return errorResponse('Could not save location Receiving')
    }
}

const getLocationReceiving = async (locationId) => {
    try {
        const sql = `select id as locationsReceivingID, locationsId, requiresAppt, hours, receivingDocks, receivingInstructions from
    (select id as loExists from locations where id = '${locationId}' and isDeleted = 0) as T
    join locationsReceiving on T.loExists = locationsReceiving.locationsId`
        const result = await customQuery.query(sql)
        if (result.length === 0) {
            return errorResponse('Location Receiving not found', 404)
        }
        result.forEach((element) => {
            element.hours = JSON.parse(element.hours)
            element.receivingDocks = JSON.parse(element.receivingDocks)
        })
        return successResponse(result[0])
    } catch (err) {
        logger.error('Error in getLocationReceiving_function. Error =>', err)
        return errorResponse('Could not get location Receiving')
    }
}

const updateLocationReceiving = async (locationId, data) => {
    try {
        const validHours = checkHours(data.hours)
        if (validHours != 'YES') {
            return errorResponse(validHours)
        }
        const sql = `select loExists, locationsReceiving.locationsId as lrExists from
    (select id as loExists from locations where id = '${locationId}' and isDeleted = 0) as T
    left join locationsReceiving on T.loExists = locationsReceiving.locationsId`
        const result = await customQuery.query(sql)
        if (result.length === 0) {
            return errorResponse('Location not found')
        }
        if (result.length > 0) {
            if (!result[0].lrExists)
                return errorResponse('Location receiving does not exist')
            if (!result[0].loExists)
                return errorResponse('Location does not exist')
        }
        const dataObj = {
            locationsId: locationId,
            requiresAppt: data.requiresAppt,
            hours: data.hours ? JSON.stringify(data.hours) : null,
            receivingDocks: data.receivingDocks
                ? JSON.stringify(data.receivingDocks)
                : null,
            receivingInstructions: data.receivingInstructions,
        }
        await locationsReceiving.update(dataObj, {
            where: {
                locationsId: locationId,
            },
        })
        return successResponse('Location receiving updated')
    } catch (err) {
        logger.error('Error in updateLocationReceiving_function. Error =>', err)
        return errorResponse('Could not update location receiving')
    }
}

const getLocationWeather = async (locationId) => {
    try {
        const weatherObj = {}
        const dailyWeatherArr = new Array()
        const location = await usersLocation.get({
            columns: ['latitude', 'longitude'],
            where: {
                id: locationId,
                isDeleted: 0,
            },
        })
        if (location.length === 0) {
            return errorResponse('Location not found')
        }
        const weather = await getWeatherByLocation(
            location[0].latitude,
            location[0].longitude
        )
        if (weather.statusCode !== 200) {
            return errorResponse('Could not get weather')
        }
        let dailyWeather = weather.result.daily
        dailyWeather.map((w) => {
            let daly = {}
            daly.tempFahrenheit = `${kelvinToFahrenheit(w.temp.day)}F`
            daly.tempCelsius = `${kelvinToCelsius(w.temp.day)}C`
            daly.conditions = w.weather[0].main
            daly.icon = w.weather[0].icon
            dailyWeatherArr.push(daly)
        })
        let current = {}
        current.tempFahrenheit = `${kelvinToFahrenheit(
            weather.result.current.temp
        )}F`
        current.tempCelsius = `${kelvinToCelsius(weather.result.current.temp)}C`
        current.conditions = weather.result.current.weather[0].main
        current.icon = weather.result.current.weather[0].icon
        weatherObj.current = current
        weatherObj.weekly = dailyWeatherArr

        return successResponse(weatherObj)
        // return successResponse(weather.result)
    } catch (err) {
        logger.error('Error in getLocationWeather_function. Error =>', err)
        return errorResponse('Could not get location weather')
    }
}

const updateLocationProfileById = async (data) => {
    try {
        const {
            id,
            hasDock,
            hasForklift,
            isAirport,
            isCFS,
            isResidence,
            modifiedBy,
        } = data

        const location = await findLocationById(id)
        if (location) {
            let where = {
                where: {
                    locationsId: id,
                },
            }
            const dataObj = {}
            dataObj.hasDock = hasDock
            dataObj.hasForklift = hasForklift
            dataObj.isAirport = isAirport
            dataObj.isCFS = isCFS
            dataObj.isResidence = isResidence
            dataObj.modifiedBy = modifiedBy
            dataObj.modifiedDate = getUtcTime()
            let response = await locationsProfile.update(dataObj, where)
            let result =
                response > 0
                    ? successResponse('location updated successful')
                    : errorResponse('location profile Not Found')
            return result
        } else {
            return errorResponse('location updated failed')
        }
    } catch (err) {
        logger.error('Error in updateLocationProfileById repo--->', err.message)
        return errorResponse(err.message)
    }
}

const findLocationById = async (id) => {
    const response = await usersLocation.get({
        where: {
            id,
            isDeleted: 0,
        },
    })
    if (response.length > 0) {
        return true
    }
    return false
}

module.exports = {
    saveLocation,
    getLocationById,
    getLocationByQuery,
    updateLocation,
    getAllLocations,
    deleteLocation,
    saveLocationAccessorial,
    getAccessorialsByLocationId,
    saveLocationProfile,
    getLocationProfile,
    saveLocationShipping,
    getLocationShipping,
    updateLocationShipping,
    saveLocationReceiving,
    getLocationReceiving,
    updateLocationReceiving,
    getLocationWeather,
    updateLocationProfileById,
    findLocationById,
}

const dataHours = [
    {
        day: 'Sunday',
        open: null,
        close: null,
    },
    {
        day: 'Monday',
        open: '8:00AM',
        close: '5:00PM',
    },
    {
        day: 'Tuesday',
        open: '8:00AM',
        close: '5:00PM',
    },
    {
        day: 'Wednesday',
        open: '8:00AM',
        close: '5:00PM',
    },
    {
        day: 'Thursday',
        open: '8:00AM',
        close: '5:00PM',
    },
    {
        day: 'Friday',
        open: '8:00AM',
        close: '5:00PM',
    },
    {
        day: 'Saturday',
        open: null,
        close: null,
    },
]
