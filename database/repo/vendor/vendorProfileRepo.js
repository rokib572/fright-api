const { generateUUID } = require('../../../service/authService')
const logger = require(`${__base}/utils/logger`)
const { successResponse, errorResponse } = require(`${__base}helpers`)
const vendor = require('../../models/vendors')
const customQuery = require('../../models/customQuery')
const DateTime = require('../../../utils/DateTime')
const vendorsCoverage = require('../../models/vendorsCoverage')
const vendorsCoverageCountry = require('../../models/vendorsCoverageCountry')
const vendorsCoverageCountries = require('../../models/vendorsCoverageCountries')
const vendorsAccessorials = require('../../models/vendorsAccessorials')
const vendorsAir = require('../../models/vendorsAir')
const vendorsAccounting = require('../../models/vendorsAccounting')
const vendorsLimit = require('../../models/vendorsLimits')
const vendorsEquipmentType = require('../../models/vendorsEquipmentTypes')
const catalogEquipmentType = require('../../models/catalogEquipmentType')
const catalogAccessorial = require('../../models/catalogAccessorial')
const vendorsAPI = require('../../models/vendorsAPI')
const vendorsOcean = require('../../models/vendorsOcean')
const credential = require('../../models/credentials')
const usersLocation = require('../../models/usersLocation')
const {
    getClientByLocationId,
} = require(`${__base}database/repo/client/clientProfileRepo`)

const fs = require('fs')
const { fedexService } = require('../../../service/fedex/fedexService')
const arcBestService = require('../../../service/arcBestApi/arcBestService')
const estesRateService = require('../../../service/estes/rateService/estesRateService')
const {
    usfHollandService,
    usfReddawayService,
} = require('../../../service/usfApiService/usfService')
const yrcService = require('../../../service/yrc/yrcService')
const dhlService = require('../../../service/dhlApi/dhlService')
const { xpoService } = require('../../../service/xpoApi/xpoService')
const {
    daylightService,
} = require('../../../service/DaylightApi/daylightService')
const forwardRateService = require('../../../service/forwardAir/forwardRateService')
const jpExpressService = require('../../../service/jpExpressApi/jpExpressService')
const newPennService = require('../../../service/newPenn/newPennService')
const wardService = require('../../../service/wardApi/wardApiService')
const vendorsGround = require('../../models/vendorsGround')

//Create vendor Profile Function
const createVendorProfile = async (locationsId, userId) => {
    try {
        var vendorObj = {}
        let vendorId = generateUUID()

        vendorObj['id'] = vendorId
        vendorObj['locationsId'] = locationsId
        vendorObj['createdBy'] = userId
        vendorObj['modifiedBy'] = userId

        vendor.save(vendorObj)
        vendorsAccounting.save({
            vendorsId: vendorId,
        })
    } catch (err) {
        logger.error('Error on creteVendorProfile Function err=>', err)
        return errorResponse('Something went wrong in server', 500)
    }
}

//save vendor profile
const saveVendorProfile = async (data) => {
    try {
        const vendorId = generateUUID()
        // const location = await usersLocation.get({
        //   where: {
        //     id: data.locationsId,
        //     isDeleted: 0,
        //   },
        // })
        // if (location.length === 0) {
        //   return errorResponse(
        //     'The locationsId you are trying to use is not valid',
        //     400
        //   )
        // }

        const vendorObj = {
            id: vendorId,
            locationsId: data.locationsId,
            createdBy: data.createdBy,
            modifiedBy: data.modifiedBy,
            createdDate: DateTime.getCurrentTime(),
            modifiedDate: DateTime.getCurrentTime(),
            website: data.website,
            idFactoringCompany: data.idFactoringCompany,
            requiresFactoringCompany: data.requiresFactoringCompany,
            isFactoringCompany: data.isFactoringCompany,
        }

        await vendor.save(vendorObj)

        vendorsLimit.save({
            vendorsId: vendorId,
        })

        return successResponse('Vendor created successfully')
    } catch (err) {
        logger.error('Error on saveVendorProfile Function err=>', err)
        return errorResponse('Something went wrong in server', 500)
    }
}

// GET vendor info
const getAllVendors = async (page) => {
    try {
        let sql = `SELECT vendors.id as vendorId, vendors.locationsId as locationId, vendors.isFactoringCompany, vendors.requiresFactoringCompany, vendors.website, vendors.idFactoringCompany, vendors.vendorSince, locations.companyName, locations.companyAddress1, locations.companyAddress2, locations.companyCity, locations.companyProvince, locations.companyPostalCode, locations.companyCountry, locations.latitude, locations.longitude, locations.isSFS, locations.timeZone, locations.zoneCode FROM vendors INNER JOIN locations ON vendors.locationsId = locations.id WHERE locations.isDeleted = 0 AND vendors.blackListed = 0`
        // if (!page) {
        //     sql += ` ORDER BY locations.companyName ASC`
        // } else {
        //     const limit = 10
        //     sql += ` ORDER BY locations.companyName ASC`
        //     sql += ` LIMIT ${limit} OFFSET ${(page - 1) * limit}`
        // }
        sql += ` ORDER BY locations.companyName ASC`
        const result = await customQuery.query(sql)
        if (result.length === 0) {
            return errorResponse('No vendors found', 404)
        }
        const response = {
            statusCode: 200,
            status: 'success',
        }
        response.page = page ? page : 1
        response.limit = page
            ? `${page == 1 ? 1 : page * 10 - 9}-${page == 1 ? result.length : page * 10 - 10 + result.length
            }`
            : `1-${result.length}`
        response.result = result
        return response
    } catch (err) {
        logger.error('Error on getAllVendors Function err=>', err)
        return errorResponse('Something went wrong in server', 500)
    }
}

//GET a single vendor by id
const getVendorById = async (vendorId) => {
    try {
        const result = await vendor.get({
            columns: [
                'id',
                'locationsId',
                'isFactoringCompany',
                'requiresFactoringCompany',
                'website',
                'idFactoringCompany',
                'vendorSince',
            ],
            where: {
                id: vendorId,
                blackListed: 0,
            },
        })
        if (result.length === 0) {
            return errorResponse('Vendor not found', 404)
        }
        return successResponse(result[0])
    } catch (err) {
        logger.error('Error on getVendorById Function err=>', err)
        return errorResponse('Something went wrong in server', 500)
    }
}

// const update vendor profile
const updateVendorProfile = async (vendorObj, vendorId) => {
    try {
        const vendorVerify = await vendor.get({
            where: {
                id: vendorId,
            },
        })

        if (vendorVerify.length === 0) {
            return errorResponse('Vendor not found')
        }

        if (vendorVerify[0].blackListed === 1) {
            return errorResponse('Vendor is blacklisted')
        }

        const updateObj = {
            isFactoringCompany: vendorObj.isFactoringCompany,
            requiresFactoringCompany: vendorObj.requiresFactoringCompany,
            website: vendorObj.website,
            idFactoringCompany: vendorObj.idFactoringCompany,
            vendorSince: vendorObj.vendorSince,
            modifiedBy: vendorObj.modifiedBy,
            modifiedDate: vendorObj.modifiedDate,
        }

        for (const key in updateObj) {
            if (updateObj[key] === undefined) {
                delete updateObj[key]
            }
        }

        var result = await vendor.update(updateObj, {
            where: {
                id: vendorId,
                blackListed: 0,
            },
        })
        if (!result) {
            return errorResponse('Vendor not found', 404)
        }

        return successResponse('Vendor updated successfully', 200)
    } catch (err) {
        logger.error('Error on updateVendorProfile Function err=>', err)
        return errorResponse('Something went wrong in server', 500)
    }
}

// delete vendor profile
const deleteVendorProfile = async (vendorId) => {
    try {
        const result = await vendor.update(
            {
                blackListed: 1,
                modifiedDate: DateTime.getCurrentTime(),
            },
            {
                where: {
                    id: vendorId,
                    blackListed: 0,
                },
            }
        )
        if (!result) {
            return errorResponse('Vendor not found', 404)
        }
        return successResponse('Vendor deleted successfully', 200)
    } catch (err) {
        logger.error('Error on deleteVendorProfile Function err=>', err)
        return errorResponse('Something went wrong in server', 500)
    }
}

//verify Client  by locationId ends
const isVendorExistsByLocationId = async (locationsId) => {
    try {
        var response = await vendor.get({
            where: {
                locationsId: locationsId,
            },
        })
        return response
    } catch (err) {
        logger.error('Error on isVendorExistsByLocationId Function err=>', err)
        throw new Error(err)
    }
}

//get vendor by locationId
const getVendorByLocationId = async (locationsId, functionRef, country) => {
    try {
        if (functionRef == 'single') {
            let result = await customQuery.callProcedure(
                'sp_getVendorInfoByLocationId',
                [locationsId]
            )
            result.map((item) => {
                item.vendorsCoverage = item.vendorsCoverage
                    ? JSON.parse(item.vendorsCoverage)
                    : []
                item.vendorsAccessorials = item.vendorsAccessorials
                    ? JSON.parse(item.vendorsAccessorials)
                    : []
                item.vendorsAir = item.vendorsAir
                    ? JSON.parse(item.vendorsAir)
                    : []
                item.vendorsOcean = item.vendorsOcean
                    ? JSON.parse(item.vendorsOcean)
                    : []
                item.vendorsCoverageCountry = [
                    {
                        id: item.countryId,
                        country: item.country,
                    },
                ]
                delete item.countryId
                delete item.country
                item.vendorsLimits = [
                    {
                        hasLinearFeetRule: item.hasLinearFeetRule,
                        linearFeet: item.linearFeet,
                        hasCubicFeetRule: item.hasCubicFeetRule,
                        cubicFeet: item.cubicFeet,
                    },
                ]
                delete item.hasLinearFeetRule
                delete item.linearFeet
                delete item.hasCubicFeetRule
                delete item.cubicFeet

                item.vendorsCoverage.map((coverage) => {
                    for (const key in coverage) {
                        if (coverage[key] === null) {
                            delete coverage[key]
                        }
                    }
                })
                item.vendorsCoverage = item.vendorsCoverage.filter((item) => {
                    return Object.keys(item).length !== 0
                })

                item.vendorsAccessorials.map((accessorial) => {
                    for (const key in accessorial) {
                        if (accessorial[key] === null) {
                            delete accessorial[key]
                        }
                    }
                })

                item.vendorsAccessorials = item.vendorsAccessorials.filter(
                    (item) => {
                        return Object.keys(item).length !== 0
                    }
                )

                item.vendorsAir.map((vendAir) => {
                    for (const key in vendAir) {
                        if (vendAir[key] === null) {
                            delete vendAir[key]
                        }
                    }
                })

                item.vendorsAir = item.vendorsAir.filter((item) => {
                    return Object.keys(item).length !== 0
                })

                item.vendorsOcean.map((venOcean) => {
                    for (const key in venOcean) {
                        if (venOcean[key] === null) {
                            delete venOcean[key]
                        }
                    }
                })

                item.vendorsOcean = item.vendorsOcean.filter((item) => {
                    return Object.keys(item).length !== 0
                })

                item.vendorsCoverageCountry.map((venCovCountry) => {
                    for (const key in venCovCountry) {
                        if (venCovCountry[key] === null) {
                            delete venCovCountry[key]
                        }
                    }
                })

                item.vendorsCoverageCountry =
                    item.vendorsCoverageCountry.filter((item) => {
                        return Object.keys(item).length !== 0
                    })

                item.vendorsLimits.map((venLimit) => {
                    for (const key in venLimit) {
                        if (venLimit[key] === null) {
                            delete venLimit[key]
                        }
                    }
                })

                item.vendorsLimits = item.vendorsLimits.filter((item) => {
                    return Object.keys(item).length !== 0
                })
            })
            return result
        } else {
            return await vendor.get({
                columns: [
                    'id',
                    'locationsId',
                    'isFactoringCompany',
                    'requiresFactoringCompany',
                    'website',
                    'idFactoringCompany',
                    'vendorSince',
                ],
                where: {
                    locationsId: locationsId,
                    blackListed: 0,
                },
            })
        }
    } catch (err) {
        logger.error('Error on getVendorByLocationId Function err=>', err)
        throw new Error(err)
    }
}

const saveVendorCoverage = async (vendorId, province) => {
    try {
        const vendorData = await vendor.get({
            where: {
                id: vendorId,
                blackListed: 0,
            },
        })
        if (vendorData.length === 0) {
            return errorResponse('Vendor not found', 404)
        }

        const result = await vendorsCoverage.delete({
            where: {
                vendorsId: vendorId,
                province: province,
            },
        })
        if (result != 0) {
            return errorResponse('Vendor coverage already exists and deleted')
        }

        await vendorsCoverage.save({
            vendorsId: vendorId,
            province: province,
        })
        return successResponse('Vendor coverage saved successfully')
    } catch (err) {
        logger.error('Error on saveVendorCoverage Function err=>', err)
        throw new Error(err)
    }
}

const getVendorCoverage = async (vendorId) => {
    try {
        const vendorData = await vendor.get({
            where: {
                id: vendorId,
                blackListed: 0,
            },
        })

        if (vendorData.length === 0) {
            return errorResponse('Vendor not found')
        }
        const result = await vendorsCoverage.get({
            columns: ['province'],
            where: {
                vendorsId: vendorId,
            },
        })
        if (result.length === 0) {
            return errorResponse('Vendor coverage not found', 404)
        }
        return successResponse(result)
    } catch (err) {
        logger.error('Error on getVendorCoverage Function err=>', err)
        throw new Error(err)
    }
}

const saveVendorAccessorials = async (vendorId, data) => {
    try {
        const sql = `SELECT id FROM
    (
    SELECT id from vendors where id = '${vendorId}' and blackListed=0
    UNION
    SELECT id from catalogAccessorials where id = '${data.accessorialsId}'
    ) as T`
        const result1 = await customQuery.query(sql)
        if (result1.length < 2) {
            return errorResponse('Vendor or accessorial not found')
        }

        const result = await vendorsAccessorials.delete({
            where: {
                vendorsId: vendorId,
                accessorialsId: data.accessorialsId,
            },
        })
        if (result != 0) {
            return errorResponse(
                'Vendor accessorial already exists and deleted'
            )
        }
        await vendorsAccessorials.save({
            vendorsId: vendorId,
            accessorialsId: data.accessorialsId,
            labelledAs: data.labelledAs,
            vendorsAccessorialCode: data.vendorsAccessorialCode,
        })
        return successResponse('Vendor accessorial saved successfully')
    } catch (err) {
        logger.error('Error on saveVendorAccessorials Function err=>', err)
        throw new Error(err)
    }
}

const getVendorAccessorials = async (vendorId) => {
    try {
        const sql = `SELECT
          VA.id AS id,
          VA.accessorialsId AS accessorialsId,
          VA.labelledAs AS labelledAs,
          CA.accessorial as accessorialLabel,
          VA.vendorsAccessorialCode AS vendorsAccessorialCode
      FROM
          vendors AS V
              JOIN
          vendorsAccessorials AS VA ON V.id = VA.vendorsId
              LEFT JOIN
          catalogAccessorials AS CA ON VA.accessorialsId = CA.id
      WHERE
          V.id = '${vendorId}'
              AND V.blackListed = 0`

        const result = await customQuery.query(sql)
        if (result.length === 0) {
            return successResponse([])
        }
        return successResponse(result)
    } catch (err) {
        logger.error('Error on getVendorAccessorials Function err=>', err)
        throw new Error(err)
    }
}

const saveVendorApi = async (vendorId, dataObj) => {
    try {
        const sql = `SELECT id FROM
    (
    SELECT id from vendors where id = '${vendorId}' and blackListed=0
    UNION
    SELECT id from credentials where id = '${dataObj.credentialsId}' and isDeleted=0
    ) as T`
        const result1 = await customQuery.query(sql)
        if (result1.length < 2) {
            return errorResponse('Vendor or Credentials not found')
        }
        const apiObj = {
            vendorsId: vendorId,
            accountNumber: dataObj.accountNumber,
            credentialsId: dataObj.credentialsId,
            tokenA: dataObj.tokenA,
            tokenB: dataObj.tokenB,
            apiUrl: dataObj.apiUrl,
            label: dataObj.label,
        }
        await vendorsAPI.save(apiObj)
        return successResponse('Vendor api saved successfully')
    } catch (err) {
        logger.error('Error on saveVendorApi Function err=>', err)
        throw new Error(err)
    }
}

const getVendorApi = async (vendorId) => {
    try {
        const vendorData = await vendor.get({
            where: {
                id: vendorId,
                blackListed: 0,
            },
        })

        if (vendorData.length === 0) {
            return errorResponse('Vendor not found')
        }
        const result = await vendorsAPI.get({
            where: {
                vendorsId: vendorId,
            },
        })
        if (result.length === 0) {
            return errorResponse('Vendor api not found', 404)
        }
        return successResponse(result)
    } catch (err) {
        logger.error('Error on getVendorApi Function err=>', err)
        throw new Error(err)
    }
}

const saveVendorAir = async (vendorId, dataObj) => {
    try {
        const sql = `select venExists, vendorsAir.vendorsId as vaExists from
    (select id as venExists from vendors where id = '${vendorId}' and blackListed = 0) as T
    left join vendorsAir on T.venExists = vendorsAir.vendorsId`
        const result = await customQuery.query(sql)
        if (result.length === 0) {
            return errorResponse('Vendor not found')
        }
        if (!result[0].venExists) return errorResponse('Vendor not found')

        if (dataObj.flag) {
            dataObj.flag = dataObj.flag.toLowerCase()
            const sql = `select alpha2 from catalogCountries where alpha2 = '${dataObj.flag}'`
            const result = await customQuery.query(sql)
            if (result.length === 0) {
                return errorResponse('Flag Country not found')
            }
        }

        if (dataObj.iataCode && dataObj.awbPrefix) {
            const sql = `SELECT iataCode, awbPrefix FROM catalogAirlines where iataCode = '${dataObj.iataCode}' and awbPrefix = '${dataObj.awbPrefix}'`
            const result = await customQuery.query(sql)
            if (result.length === 0) {
                return errorResponse('iataCode and awbPrefix not found')
            }
        }

        const vendorAirObj = {
            vendorsId: vendorId,
            iataCode: dataObj.iataCode,
            awbPrefix: dataObj.awbPrefix,
            hasCAO: dataObj.hasCAO,
            hasPassenger: dataObj.hasPassenger,
            flag: dataObj.flag,
        }

        vendorAirObj.flag == null && delete vendorAirObj.flag

        if (result[0].vaExists) {
            await vendorsAir.update(vendorAirObj, {
                where: {
                    vendorsId: vendorId,
                },
            })
            return successResponse('Vendor air updated successfully')
        }
        await vendorsAir.save(vendorAirObj)
        return successResponse('Vendor air inserted successfully')
    } catch (err) {
        logger.error('Error on saveVendorAir Function err=>', err)
        return errorResponse("Couldn't save vendor air")
    }
}

const getVendorAir = async () => {
    try {
        const result = await customQuery.callProcedure('get_loc_vendor_air')
        if (result.length === 0) {
            return errorResponse('Vendor air not found')
        }
        const mappedResult = result.map((item) => {
            const vendorInfo = {
                vendorId: item.vendorId,
                isFactoringCompany: item.isFactoringCompany,
                requiresFactoringCompany: item.requiresFactoringCompany,
                website: item.website,
                idFactoringCompany: item.idFactoringCompany,
                vendorSince: item.vendorSince,
                vendorsAir: {
                    id: item.vendorsAirId,
                    iataCode: item.iataCode,
                    awbPrefix: item.awbPrefix,
                    hasCAO: item.hasCAO,
                    hasPassenger: item.hasPassenger,
                    flag: item.flag,
                },
            }
            return {
                locationId: item.locationId,
                companyName: item.companyName,
                companyAddress1: item.companyAddress1,
                companyAddress2: item.companyAddress2,
                companyCity: item.companyCity,
                companyProvince: item.companyProvince,
                companyPostalCode: item.companyPostalCode,
                companyCountry: item.companyCountry,
                latitude: item.latitude,
                longitude: item.longitude,
                isSFS: item.isSFS,
                timeZone: item.timeZone,
                vendorInfo,
            }
        })
        return successResponse(mappedResult)
    } catch (err) {
        logger.error('Error on getVendorAir Function err=>', err)
        throw new Error(err)
    }
}

const saveVendorOcean = async (vendorId, dataObj) => {
    try {
        let sql = `select T.venExists as venExists, T.locExists as locExists, vendorsOcean.vendorsId as voExists from
    (select vendors.id as venExists, locations.id as locExists from vendors 
      join locations on vendors.locationsId = locations.id  
      where vendors.id = '${vendorId}' and vendors.blackListed = 0
      and locations.isDeleted = 0 ) as T
    left join vendorsOcean on T.venExists = vendorsOcean.vendorsId`

        const result = await customQuery.query(sql)
        if (result.length === 0) {
            return errorResponse('Vendor not found')
        }
        if (!result[0].venExists) return errorResponse('Vendor not found')
        if (!result[0].locExists) return errorResponse('Location not found')

        if (dataObj.flag) {
            dataObj.flag = dataObj.flag.toLowerCase()
            const sql2 = `select alpha2 from catalogCountries where alpha2='${dataObj.flag}'`
            const result2 = await customQuery.query(sql2)
            if (result2.length === 0) {
                return errorResponse('Flag Country not found')
            }
        }

        const vendorOceanObj = {
            vendorsId: vendorId,
            fmcNumber: dataObj.fmcNumber,
            scacNumber: dataObj.scacNumber,
            flag: dataObj.flag,
        }

        vendorOceanObj.flag == null && delete vendorOceanObj.flag

        if (result[0].voExists) {
            await vendorsOcean.update(vendorOceanObj, {
                where: {
                    vendorsId: vendorId,
                },
            })
            return successResponse('Vendor ocean updated successfully')
        }
        await vendorsOcean.save(vendorOceanObj)
        return successResponse('Vendor ocean inserted successfully')
    } catch (err) {
        logger.error('Error on saveVendorOcean Function err=>', err)
        return errorResponse("Couldn't save vendor ocean")
    }
}

const getVendorOcean = async () => {
    try {
        const result = await customQuery.callProcedure('get_loc_vendor_ocean')
        if (result.length === 0) {
            return errorResponse('Vendor ocean not found')
        }
        const mappedResult = result.map((item) => {
            const vendorInfo = {
                vendorId: item.vendorId,
                isFactoringCompany: item.isFactoringCompany,
                requiresFactoringCompany: item.requiresFactoringCompany,
                website: item.website,
                idFactoringCompany: item.idFactoringCompany,
                vendorSince: item.vendorSince,
                vendorsOcean: {
                    id: item.vendorOceanId,
                    fmcNumber: item.fmcNumber,
                    scacNumber: item.scacNumber,
                    flag: item.flag,
                },
            }
            return {
                locationId: item.locationId,
                companyName: item.companyName,
                companyAddress1: item.companyAddress1,
                companyAddress2: item.companyAddress2,
                companyCity: item.companyCity,
                companyProvince: item.companyProvince,
                companyPostalCode: item.companyPostalCode,
                companyCountry: item.companyCountry,
                latitude: item.latitude,
                longitude: item.longitude,
                isSFS: item.isSFS,
                timeZone: item.timeZone,
                vendorInfo,
            }
        })
        return successResponse(mappedResult)
    } catch (err) {
        logger.error('Error on getVendorOcean Function err=>', err)
        throw new Error(err)
    }
}

const saveVendorsCoverageCountry = async (vendorId, dataObj) => {
    try {
        const sql = `select venExists, vendorsCoverageCountry.vendorsId as vccExists, vendorsCoverageCountry.country as vccCountryExists  from
    (select id as venExists from vendors where id = '${vendorId}' and blackListed = 0) as T
    left join vendorsCoverageCountry on T.venExists = vendorsCoverageCountry.vendorsId`
        const result = await customQuery.query(sql)
        if (result.length === 0) {
            return errorResponse('Vendor not found')
        }

        if (dataObj.country) {
            dataObj.country = dataObj.country.toLowerCase()
            const sql2 = `select alpha2 from catalogCountries where alpha2='${dataObj.country}'`
            const result2 = await customQuery.query(sql2)
            if (result2.length === 0) {
                return errorResponse('Country code not found')
            }
        }

        if (dataObj.country == 'us') {
            const countryResult = await vendorsCoverageCountries.delete({
                where: {
                    vendorsId: vendorId,
                    country: dataObj.country,
                },
            })

            if (countryResult !== 0) {
                return successResponse(
                    'Vendor coverage country deleted successfully'
                )
            }

            const vendorCoverageCountryObj = {
                vendorsId: vendorId,
                country: dataObj.country,
            }

            await vendorsCoverageCountries.save(vendorCoverageCountryObj)
            return successResponse(
                'Vendor coverage country inserted successfully'
            )
        }
        const countryResult = await vendorsCoverageCountry.delete({
            where: {
                vendorsId: vendorId,
                country: dataObj.country,
            },
        })

        if (countryResult !== 0) {
            return successResponse(
                'Vendor coverage country deleted successfully'
            )
        }

        const vendorCoverageCountryObj = {
            vendorsId: vendorId,
            country: dataObj.country,
        }

        await vendorsCoverageCountry.save(vendorCoverageCountryObj)
        return successResponse('Vendor coverage country inserted successfully')
    } catch (err) {
        logger.error(
            'Error on save Vendors Coverage Country Function err=>',
            err
        )
        return errorResponse("Couldn't save vendor coverage country")
    }
}

const getVendorsCoverageCountry = async (vendorId) => {
    try {
        let sql = `
    SELECT 
      VCC.id AS id, VCC.country AS alpha2, CC.name
      FROM
      vendors AS V
      JOIN
      vendorsCoverageCountry AS VCC ON V.id = VCC.vendorsId
      LEFT JOIN catalogCountries AS CC ON VCC.country = CC.alpha2
      WHERE
      V.id = '${vendorId}' AND V.blackListed = 0 
      UNION
      SELECT 
      VCC.id AS id, VCC.country AS alpha2, CC.name
      FROM
      vendors AS V
      JOIN
      vendorsCoverageCountries AS VCC ON V.id = VCC.vendorsId
      LEFT JOIN catalogCountries AS CC ON VCC.country = CC.alpha2
      WHERE
      V.id = '${vendorId}' AND V.blackListed = 0`
        const result = await customQuery.query(sql)

        return successResponse(result)
    } catch (err) {
        logger.error('Error on getVendorsCoverageCountry Function err=>', err)
        throw new Error(err)
    }
}

const getVendorsCoverageCountryByCountry = async (country) => {
    try {
        const result = await customQuery.callProcedure(
            'get_loc_vendor_cov_country',
            [country]
        )
        if (result.length === 0) {
            return errorResponse('Vendor coverage country not found')
        }
        const mappedResult = result.map((item) => {
            const vendorInfo = {
                vendorId: item.vendorId,
                isFactoringCompany: item.isFactoringCompany,
                requiresFactoringCompany: item.requiresFactoringCompany,
                website: item.website,
                idFactoringCompany: item.idFactoringCompany,
                vendorSince: item.vendorSince,
                vendorsCoverageCountry: {
                    id: item.vccId,
                    country: item.country,
                },
            }
            return {
                locationId: item.locationId,
                companyName: item.companyName,
                companyAddress1: item.companyAddress1,
                companyAddress2: item.companyAddress2,
                companyCity: item.companyCity,
                companyProvince: item.companyProvince,
                companyPostalCode: item.companyPostalCode,
                companyCountry: item.companyCountry,
                latitude: item.latitude,
                longitude: item.longitude,
                isSFS: item.isSFS,
                timeZone: item.timeZone,
                vendorInfo,
            }
        })
        return successResponse(mappedResult)
    } catch (err) {
        logger.error(
            'Error on getVendorsCoverageCountryByCountry Function err=>',
            err
        )
        throw new Error(err)
    }
}

//Save Vendors limit
const saveVendorsLimit = async (vendorId, data) => {
    try {
        const vendorData = await vendor.get({
            where: {
                id: vendorId,
                blackListed: 0,
            },
        })
        if (vendorData.length === 0) {
            return errorResponse('Vendor not found', 404)
        }

        const isExistsId = await vendorsLimit.get({
            where: { vendorsId: vendorId },
        })

        if (isExistsId.length > 0) {
            return errorResponse('Vendors Id already exists')
        }

        let dataObj = {}
        dataObj.vendorsId = vendorId
        dataObj.hasLinearFeetRule = data.hasLinearFeetRule
        dataObj.linearFeet = data.linearFeet
        dataObj.hasCubicFeetRule = data.hasCubicFeetRule
        dataObj.cubicFeet = data.cubicFeet
        await vendorsLimit.save(dataObj)
        return successResponse('data insertion successfully')
    } catch (err) {
        logger.error('Error in save vendors limit-->', err)
        return errorResponse(err.message)
    }
}

//Get vendors limitation by id

const getVendorsLimitByVenId = async (id) => {
    try {
        let columns = [
            'vendorsId',
            'hasLinearFeetRule',
            'linearFeet',
            'hasCubicFeetRule',
            'cubicFeet',
        ]
        const result = await vendorsLimit.get({
            columns,
            where: { vendorsId: id },
        })
        if (result.length > 0) {
            const ven = await vendor.get({ where: { id, blackListed: 0 } })
            if (ven.length > 0) {
                return successResponse(result)
            } else {
                return errorResponse('Data Not Found', 404)
            }
        } else {
            return errorResponse('Data Not Found', 404)
        }
    } catch (err) {
        logger.error('Error get vendors limit by vendors by venId repo', err)
        return errorResponse(err.message)
    }
}

const saveVendorsEquipmentsTypeById = async (vendorsId, equipmentId) => {
    try {
        const vendorData = await vendor.get({
            where: {
                id: vendorsId,
                blackListed: 0,
            },
        })
        if (vendorData.length === 0) {
            return errorResponse('Vendor id did not match', 404)
        }

        const equipmentTypeData = await catalogEquipmentType.get({
            where: {
                id: equipmentId,
            },
        })
        if (equipmentTypeData.length === 0) {
            return errorResponse('equipment id did not match', 404)
        }

        let data = {}
        data.vendorsId = vendorsId
        data.equipmentTypesId = equipmentId
        await vendorsEquipmentType.save(data)
        return successResponse('Data inserted successfully')
    } catch (err) {
        logger.error(
            'Error in saveVendorsEquipmentsTypeById repo--->>',
            err.message
        )
        return errorResponse(err.message)
    }
}

const getVendorsEquipmentsTypeByVendorsId = async (vendorsId) => {
    try {
        const vendorData = await vendor.get({
            where: {
                id: vendorsId,

                blackListed: 0,
            },
        })
        if (vendorData.length === 0) {
            return errorResponse('Vendors Not Found', 404)
        }
        const vendorsEquipmentTypeData = await vendorsEquipmentType.get({
            where: {
                vendorsId,
            },
        })
        if (vendorsEquipmentTypeData.length === 0) {
            return errorResponse('Data Not Found', 404)
        }
        return successResponse(vendorsEquipmentTypeData)
    } catch (err) {
        logger.error(
            'Error in getVendorsEquipmentsTypeByVendorsId repo--->>',
            err.message
        )
        return errorResponse(err.message)
    }
}

const getVendorsByEquipmentId = async (id) => {
    try {
        const equipmentType = await vendorsEquipmentType.get({
            where: { equipmentTypesId: id },
        })

        let dataObj = new Array()
        for (let i in equipmentType) {
            const ven = await vendor.get({
                columns: [
                    'id',
                    'locationsId',
                    'isFactoringCompany',
                    'requiresFactoringCompany',
                    'website',
                    'idFactoringCompany',
                    'vendorSince',
                ],
                where: { id: equipmentType[i].vendorsId, blackListed: 0 },
            })
            dataObj.push(ven[0])
        }
        if (dataObj.length === 0) {
            return errorResponse('Data Not Found', 404)
        }
        const vendors = {}
        vendors.equipmentTypesId = id
        vendors.vendors = dataObj
        return successResponse(vendors)
    } catch (err) {
        logger.error('Error in getVendorsByEquipmentId-->>', err.message)
        return errorResponse(err.message)
    }
}

const getAllVendorsRate = async (data) => {
    let dataF = { ...data }
    dataF.accessorials = []
    let dataA = { ...data }
    dataA.accessorials = []
    let dataH = { ...data }
    dataH.accessorials = []
    let dataR = { ...data }
    dataR.accessorials = []
    let dataY = { ...data }
    dataY.accessorials = []
    let dataDhl = { ...data }
    dataDhl.accessorials = []
    let dataDL = { ...data }
    dataDL.accessorials = []
    let dataX = { ...data }
    dataX.accessorials = []
    let dataE = { ...data }
    dataE.accessorials = []
    let dataForward = { ...data }
    dataForward.accessorials = []
    let dataJPE = { ...data }
    dataJPE.accessorials = []
    let dataNewPenn = { ...data }
    dataNewPenn.accessorials = []
    let dataWardRate = { ...data }
    dataWardRate.accessorials = []
    try {
        const allVendorRate = new Array()
        // const sql = `SELECT companyName,companyAddress1,companyAddress2,companyCity,companyProvince,companyPostalCode,companyCountry FROM  locations loc INNER JOIN vendors vn ON vn.locationsId=loc.id INNER JOIN  vendorsAPI vapi ON vapi.vendorsId = vn.id  WHERE loc.isDeleted=0 and vn.blackListed=0`
        // let vendorLocInfo = await customQuery.query(sql)

        const rateData = {}
        const rate = new Array()
        let acc = data.accessorials

        for (let i in acc) {
            let venAcc = await vendorsAccessorials.get({
                columns: ['vendorsId'],
                where: {
                    vendorsAccessorialCode: acc[i],
                },
            })
            if (venAcc.length > 0) {
                let vId = venAcc[0].vendorsId
                let apiUrl = await vendorsAPI.get({
                    columns: ['apiURL'],
                    where: {
                        vendorsId: vId,
                    },
                })
                let url = apiUrl[0].apiURL
                if (url === 'www.reddawayregional.com') {
                    dataR.accessorials.push(acc[i])
                } else if (url === 'www.dylt.com') {
                    dataDL.accessorials.push(acc[i])
                } else if (url === 'www.arcb.com') {
                    dataA.accessorials.push(acc[i])
                } else if (url === 'www.yrc.com') {
                    dataY.accessorials.push(acc[i])
                } else if (url === 'www.xpo.com') {
                    dataX.accessorials.push(acc[i])
                } else if (url === 'www.estes-express.com') {
                    dataE.accessorials.push(acc[i])
                } else if (url === 'www.hollandregional.com') {
                    dataH.accessorials.push(acc[i])
                } else if (url === 'www.fedex.com') {
                    dataF.accessorials.push(acc[i])
                } else if (url === 'www.dhl.com') {
                    dataDhl.accessorials.push(acc[i])
                } else if (url === 'www.myjpexpress.com') {
                    dataJPE.accessorials.push(acc[i])
                } else if (url === 'www.forwardair.com') {
                    dataForward.accessorials.push(acc[i])
                } else if (url === 'www.newpenn.com') {
                    dataNewPenn.accessorials.push(acc[i])
                } else if (url === 'www.wardtlc.com') {
                    dataWardRate.accessorials.push(acc[i])
                }
            }
        }
        let [
            fedex,
            arcBest,
            estes,
            usfHolland,
            usfReddaway,
            yrc,
            dhl,
            xpo,
            daylight,
            forwardAir,
            jpexpressApi,
            newPennApi,
            wardRateApi,
        ] = await Promise.all([
            fedexService(dataF),
            arcBestService(dataA),
            estesRateService(dataE),
            usfHollandService(dataH),
            usfReddawayService(dataR),
            yrcService(dataY),
            dhlService(dataDhl),
            xpoService(dataX),
            daylightService(dataDL),
            forwardRateService(dataForward),
            jpExpressService(dataJPE),
            newPennService(dataNewPenn),
            wardService(dataWardRate),
        ])

        let [
            fedexL,
            arcBestL,
            estesL,
            usfHollandL,
            usfReddawayL,
            yrcL,
            dhlL,
            xpoL,
            daylightL,
            forwardAirL,
            jpexpressApiL,
            newpennApiL,
            wardRateApiL,
        ] = await Promise.all([
            getAllVendorsRateLoc('www.fedex.com'),
            getAllVendorsRateLoc('www.arcb.com'),
            getAllVendorsRateLoc('www.estes-express.com'),
            getAllVendorsRateLoc('www.hollandregional.com'),
            getAllVendorsRateLoc('www.reddawayregional.com'),
            getAllVendorsRateLoc('www.yrc.com'),
            getAllVendorsRateLoc('www.dhl.com'),
            getAllVendorsRateLoc('www.xpo.com'),
            getAllVendorsRateLoc('www.dylt.com'),
            getAllVendorsRateLoc('www.forwardair.com'),
            getAllVendorsRateLoc('www.myjpexpress.com'),
            getAllVendorsRateLoc('www.newpenn.com'),
            getAllVendorsRateLoc('www.wardtlc.com'),
        ])

        // fedex.location = fedexL
        rateData.fedex = getTotalRateResponse(fedex, 'fedex', fedexL)
        rateData.fedex.map((e) => {
            rate.push(e)
        })
        // arcBest.location = arcBestL
        rateData.arcBest = getTotalRateResponse(arcBest, 'arcBest', arcBestL)
        rateData.arcBest.map((e) => {
            rate.push(e)
        })

        // estes = estes.result || estes.error
        // estes.location = estesL
        rateData.estes = getTotalRateResponse(estes, 'estes', estesL)
        rateData.estes.map((e) => {
            rate.push(e)
        })

        // usfHolland = usfHolland.result || usfHolland.error
        // usfHolland.location = usfHollandL
        rateData.usfHolland = getTotalRateResponse(
            usfHolland,
            'usfHolland',
            usfHollandL
        )
        rateData.usfHolland.map((e) => {
            rate.push(e)
        })

        // usfReddaway = usfReddaway.result || usfReddaway.error
        // usfReddaway.location = usfReddawayL
        rateData.usfReddaway = getTotalRateResponse(
            usfReddaway,
            'usfReddaway',
            usfReddawayL
        )
        rateData.usfReddaway.map((e) => {
            rate.push(e)
        })

        // yrc = yrc.result || yrc.error
        // yrc.location = yrcL
        rateData.yrc = getTotalRateResponse(yrc, 'yrc', yrcL)
        rateData.yrc.map((e) => {
            rate.push(e)
        })
        // dhl = dhl.result || dhl.error
        // dhl.location = dhlL
        rateData.dhl = getTotalRateResponse(dhl, 'dhl', dhlL)
        rateData.dhl.map((e) => {
            rate.push(e)
        })
        // xpo = xpo.result || xpo.error
        // xpo.location = xpoL
        rateData.xpo = getTotalRateResponse(xpo, 'xpo', xpoL)
        rateData.xpo.map((e) => {
            rate.push(e)
        })
        // daylight = daylight.result || daylight.error
        // daylight.location = daylightL
        rateData.daylight = getTotalRateResponse(
            daylight,
            'daylight',
            daylightL
        )
        rateData.daylight.map((e) => {
            rate.push(e)
        })
        // forwardAir = forwardAir.result || forwardAir.error
        // forwardAir.location = forwardAirL
        rateData.forwardAir = getTotalRateResponse(
            forwardAir,
            'forwardAir',
            forwardAirL
        )
        rateData.forwardAir.map((e) => {
            rate.push(e)
        })
        // jpexpressApi = jpexpressApi.result || jpexpressApi.error
        // jpexpressApi.location = jpexpressApiL
        rateData.jpexpressApi = getTotalRateResponse(
            jpexpressApi,
            'jpexpress',
            jpexpressApiL
        )
        rateData.jpexpressApi.map((e) => {
            rate.push(e)
        })

        // newPennApi = newPennApi.result || newPennApi.error
        // newPennApi.location = newpennApiL
        rateData.newPenn = getTotalRateResponse(
            newPennApi,
            'newPenn',
            newpennApiL
        )
        rateData.newPenn.map((e) => {
            rate.push(e)
        })
        rateData.wardRate = getTotalRateResponse(
            wardRateApi,
            'ward Rate',
            wardRateApiL
        )
        rateData.wardRate.map((e) => {
            rate.push(e)
        })

        return successResponse(
            rate.sort(function (a, b) {
                return a.totalCharge - b.totalCharge
            })
        )
    } catch (err) {
        logger.error('Error in all vendors rate-->>', err)
        return errorResponse(err.message)
    }
}

const getAllVendorsRateLoc = async (data) => {
    const sql = `SELECT companyName,companyAddress1,companyAddress2,companyCity,companyProvince,companyPostalCode,companyCountry FROM  locations loc INNER JOIN vendors vn ON vn.locationsId=loc.id INNER JOIN  vendorsAPI vapi ON vapi.vendorsId = vn.id  WHERE loc.isDeleted=0 and vn.blackListed=0 and vn.website="${data}"`

    let result = await customQuery.query(sql)
    return result[0]
}

const getTotalRateResponse = (data, vendor, loc) => {
    if (!data.result) {
        // return { error: data.error }
        return []
    }
    let response = new Array()

    // return data.result
    data.result.forEach((e, i) => {
        let a = {}
        a.vendor = vendor
        a.quoteId = e.quoteId ?? ''
        a.totalCharge = e.totalRate
        a.vendorInfo = loc
        a.ETA = e.ETA
        a.serviceLevel = e.serviceLevel
        a.transitTime = e.transitTime
        response.push(a)
    })
    return response
}

const saveVendorsGround = async (vendorsId, requestData) => {
    try {
        const vendorData = await vendor.get({
            where: {
                id: vendorsId,
                blackListed: 0,
            },
        });
        if (vendorData.length === 0) {
            return errorResponse('Vendor not found', 404)
        }

        let vendorGround = await vendorsGround.get({
            where: {
                vendorsId: vendorsId
            }
        });

        if (vendorGround.length > 0) {
            let data = { ...vendorGround[0] }
            await vendorsGround.update(data, {
                where: {
                    id: data.id
                }
            });
            return successResponse('Data updated successfully')
        } else {
            let data = {}
            data.vendorsId = vendorsId
            await vendorsGround.save(data)
            return successResponse('Data inserted successfully')
        }

    } catch (err) {
        logger.error('Error in saveVendorsGround ', err)
        return errorResponse(err.message)
    }
}

module.exports = {
    createVendorProfile,
    saveVendorProfile,
    getAllVendors,
    getVendorById,
    updateVendorProfile,
    deleteVendorProfile,
    isVendorExistsByLocationId,
    getVendorByLocationId,
    saveVendorCoverage,
    getVendorCoverage,
    saveVendorAccessorials,
    getVendorAccessorials,
    saveVendorApi,
    getVendorApi,
    saveVendorAir,
    getVendorAir,
    saveVendorOcean,
    getVendorOcean,
    saveVendorsCoverageCountry,
    getVendorsCoverageCountry,
    getVendorsCoverageCountryByCountry,
    saveVendorsLimit,
    getVendorsLimitByVenId,
    saveVendorsEquipmentsTypeById,
    getVendorsByEquipmentId,
    getAllVendorsRate,
    getVendorsEquipmentsTypeByVendorsId,
    saveVendorsGround,
    vendorTrackingRepo: require('./vendorTrackingRepo'),
}
