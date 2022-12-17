const { successResponse, errorResponse } = require(`${__base}helpers`)
const logger = require(`${__base}/utils/logger`)
const customQuery = require('../../models/customQuery')
const dotCarrier = require('../../models/dotCarrier')
const dotCarrierLog = require('../../models/dotCarrierLogs')

const getDotCarriers = async (params, pageNo) => {
    try {
        let whereSql = ''
        let limit = 100
        let page = pageNo < 0 ? 1 : pageNo
        let pagination = `LIMIT ${limit} OFFSET ${(page - 1) * limit}`

        if (params.name) {
            whereSql += `(legalName LIKE "%${params.name}%" OR dbaName LIKE "%${params.name}%") `
        }

        if (params.city) {
            if (whereSql) whereSql += `AND `
            whereSql += `(physicalCity = "${params.city}" OR mailingCity = "${params.city}") `
        }

        if (params.state) {
            if (whereSql) whereSql += `AND `
            whereSql += `(physicalState = "${params.state}" OR mailingState = "${params.state}") `
        }

        if (params.mc) {
            if (whereSql) whereSql += `AND `
            whereSql += `mcNumber = "${params.mc}" `
        }

        if (params.dot) {
            if (whereSql) whereSql += `AND `
            whereSql += `dotNumber = "${params.dot}" `
        }

        if (whereSql) {
            whereSql = ' WHERE ' + whereSql
        }

        let sql = `SELECT * FROM dotCarriers ${whereSql} ` + pagination

        const result = await customQuery.query(sql)

        const response = {
            statusCode: 200,
            status: 'success',
        }
        response.page = page ? page : 1
        response.limit = '0-0'
        response.result = result
        if (result.length > 0) {
            const response = {
                statusCode: 200,
                status: 'success',
            }
            response.page = page ? page : 1
            response.limit = page
                ? `${(page - 1) * limit + 1}-${page * limit}`
                : `1-${result.length}`
            response.result = result
            return response
        }
        return response
    } catch (err) {
        logger.error('Error on getDotCarriers Function err=>', err)
        return errorResponse('Something went wrong in server', 500)
    }
}

//dotNumber unique check
const getDotCarrierIfExists = async (dotNumber) => {
    try {
        let where = {
            dotNumber: dotNumber,
        }
        const data = await dotCarrier.get({ where })
        return data
    } catch (err) {
        return null
    }
}

const getMaxVersionedDotCarrierLogs = async () => {
    try {
        let sql =
            'SELECT * FROM dotCarrierLogs WHERE fileVersion = (SELECT max(fileVersion) as v FROM dotCarrierLogs limit 1)'
        const data = await dotCarrierLog.query(sql)
        return data
    } catch (error) {
        return null
    }
}

const saveDotCarrierLog = async (data) => {
    try {
        await dotCarrierLog.save(data)
        return successResponse('Data insertion Successfully')
    } catch (error) {
        logger.error('Error on saveDotCarrierLog Function err=>', error)
        return errorResponse('Something went wrong in server', 500)
    }
}

module.exports = {
    getDotCarriers,
    getMaxVersionedDotCarrierLogs,
    saveDotCarrierLog,
}
