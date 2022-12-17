const { successResponse, errorResponse } = require('../../../helpers')
const logger = require('../../../utils/logger')
const quotesRoutes = require('../../models/quotesRoutes')
const { checkQuotesNumber } = require('./quotesRepo')
const { checkMovementTypeID } = require('../catalog/catalogMovementTypesRepo')
const { findLocationById } = require('../location/locationRepo')
const { generateUUID } = require('../../../service/authService')

const saveQuotesRoutes = async (quoteRoutes) => {
    try {
        let isQuotes = await checkQuotesNumber(quoteRoutes.quotesId)
        if (!isQuotes) {
            return errorResponse('Quotes not found', 404)
        }

        let isMovementType = await checkMovementTypeID(quoteRoutes.movementType)
        if (!isMovementType) {
            return errorResponse('Movement Type not found', 404)
        }

        let isLocation = true
        if (quoteRoutes.locationsId) {
            isLocation = await findLocationById(quoteRoutes.locationsId)
        }
        if (!isLocation) {
            return errorResponse('Location not found', 404)
        }

        let maxStep = await getMaxStepByQuoteId(quoteRoutes.quotesId)
        if (maxStep == null) {
            return errorResponse('Failed to save quotes routes', 500)
        } else {
            quoteRoutes.step = maxStep
        }

        quoteRoutes.id = generateUUID()
        await quotesRoutes.save(quoteRoutes)

        return successResponse('Quote routes save successfully')
    } catch (err) {
        logger.error('error on quotes routes save-> ', err)
        return errorResponse('Failed to save quotes routes', 500)
    }
}

const updateQuotesRoutes = async (quoteRoutes) => {
    try {
        let existingRoutes = await checkQuotesRoutes(quoteRoutes.id)

        if (existingRoutes == null) {
            return errorResponse('Quotes routes not found', 404)
        }

        let isQuotes = await checkQuotesNumber(quoteRoutes.quotesId)
        if (!isQuotes) {
            return errorResponse('Quotes not found', 404)
        }

        let isMovementType = await checkMovementTypeID(quoteRoutes.movementType)
        if (!isMovementType) {
            return errorResponse('Movement Type not found', 404)
        }

        let isLocation = true
        if (quoteRoutes.locationsId) {
            isLocation = await findLocationById(quoteRoutes.locationsId)
        }
        if (!isLocation) {
            return errorResponse('Location not found', 404)
        }

        if (quoteRoutes.step && quoteRoutes.step != existingRoutes.step) {
            let maxStep = await getMaxStepByQuoteId(quoteRoutes.quotesId)
            if (quoteRoutes.step > maxStep + 1) {
                return errorResponse('Invalid step provided', 400)
            }

            let sql = `UPDATE quotesRoutes SET step = (step + 1) WHERE quotesId = '${quoteRoutes.quotesId}' AND step >= ${quoteRoutes.step}`
            await quotesRoutes.query(sql)

            quoteRoutes.id = generateUUID()
            await quotesRoutes.save(quoteRoutes)

            return successResponse('Data Update Successfully')
        }

        quoteRoutes.step = existingRoutes.step
        await quotesRoutes.update(quoteRoutes, {
            where: {
                id: quoteRoutes.id,
            },
        })

        return successResponse('Data update Successfully')
    } catch (err) {
        logger.error('error on quotes routes save-> ', err)
        return errorResponse('Failed to save quotes routes', 500)
    }
}

const getMaxStepByQuoteId = async (quoteNumber) => {
    try {
        let sql = `SELECT max(step) as step FROM dbkms.quotesRoutes where quotesId = "${quoteNumber}"`
        const data = await quotesRoutes.query(sql)
        return data && data.length > 0 && data[0]?.step
            ? Number(data[0]?.step)
            : 1
    } catch (error) {
        logger.error('failed to get max step -> ', err)
        return null
    }
}

const getQuotesRoutes = async (quoteNumber) => {
    try {
        const data = await quotesRoutes.get({
            where: {
                quotesId: quoteNumber,
            },
        })
        return successResponse(data)
    } catch (error) {
        logger.error('failed to get all quotes routes -> ', err)
        return errorResponse('Failed to get quotes routes', 500)
    }
}

const checkQuotesRoutes = async (routeId) => {
    try {
        const quotesRoute = await quotesRoutes.get({
            where: {
                id: routeId,
            },
        })
        return quotesRoute?.length > 0 ? quotesRoute[0] : null
    } catch (err) {
        logger.error('error on quotes repo checkQuotesRoutes response--->', err)
        return null
    }
}

module.exports = {
    saveQuotesRoutes,
    updateQuotesRoutes,
    getQuotesRoutes,
}
