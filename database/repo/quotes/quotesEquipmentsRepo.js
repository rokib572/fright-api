const { successResponse, errorResponse } = require('../../../helpers')
const logger = require('../../../utils/logger')
const { checkQuotesNumber } = require('./quotesRepo')
const { generateUUID } = require('../../../service/authService')
const {
    checkCatalogEquipmentTypeID,
} = require('../catalog/catalogEquipmentTypeRepo')
const quotesEquipment = require('../../models/quotesEquipment')

const saveQuotesEquipment = async (quotesEquipmentData) => {
    try {
        let isQuotes = await checkQuotesNumber(quotesEquipmentData.quotesId)
        if (!isQuotes) {
            return errorResponse('Quotes not found', 404)
        }

        let isEquipmentType = await checkCatalogEquipmentTypeID(
            quotesEquipmentData.equipmentTypeId
        )
        if (!isEquipmentType) {
            return errorResponse('Equipment type not found', 404)
        }

        quotesEquipmentData.id = generateUUID()
        let result = await quotesEquipment.save(quotesEquipmentData)
        if (result.affectedRows > 0) {
            return successResponse('Quotes equipment saved successfully')
        } else {
            return errorResponse('data not saved')
        }
    } catch (err) {
        logger.error('error on quotes equipment save-> ', err)
        return errorResponse('Failed to save quotes equipment', 500)
    }
}

const updateQuotesEquipment = async (
    quotesEquipmentData,
    quoteId,
    quoteEquipmentId
) => {
    try {
        let isQuotes = await checkQuotesNumber(quoteId)
        if (!isQuotes) {
            return errorResponse('Quotes not found', 404)
        }

        let isEquipmentType = await checkCatalogEquipmentTypeID(
            quoteEquipmentId
        )
        if (!isEquipmentType) {
            return errorResponse('Equipment type not found', 404)
        }

        let isBodyQuotes = await checkQuotesNumber(quotesEquipmentData.quoteId)
        if (!isBodyQuotes) {
            return errorResponse('Quotes not match', 404)
        }

        let isBodyEquipmentType = await checkCatalogEquipmentTypeID(
            quotesEquipmentData.equipmentTypeId
        )
        if (!isBodyEquipmentType) {
            return errorResponse('Equipment type does not match', 404)
        }

        const data = {
            quotesId: quotesEquipmentData.quoteId,
            equipmentTypeId: quotesEquipmentData.equipmentTypeId,
        }

        await quotesEquipment.update(data, {
            where: {
                quotesId: quoteId,
                equipmentTypeId: quoteEquipmentId,
            },
        })

        return successResponse('Quotes equipment updated successfully')
    } catch (err) {
        logger.error('error on quotes equipment update-> ', err)
        return errorResponse('Failed to update quotes equipment', 500)
    }
}

const getQuotesEquipments = async (quoteNumber) => {
    try {
        const data = await quotesEquipment.get({
            where: {
                quotesId: quoteNumber,
            },
        })
        return successResponse(data)
    } catch (error) {
        logger.error('failed to get quotes equipment -> ', err)
        return errorResponse('Failed to get quotes equipment ', 500)
    }
}
module.exports = {
    saveQuotesEquipment,
    getQuotesEquipments,
    updateQuotesEquipment,
}
