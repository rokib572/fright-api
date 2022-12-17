const { generateUUID } = require('../../../service/authService')
const { successResponse, errorResponse } = require('../../../helpers')
const logger = require('../../../utils/logger')
const quotesPieces = require('../../models/quotesPieces')
const { checkQuotesNumber } = require('./quotesRepo')

const saveQuotesPieces = async (quotesPiecesData) => {
    try {
        let isQuotes = await checkQuotesNumber(quotesPiecesData.quoteNumber)
        if (!isQuotes) {
            return errorResponse('Quotes not found', 404)
        }
        await quotesPieces.save(quotesPiecesData)

        return successResponse('Quotes pieces saved successfully')
    } catch (err) {
        logger.error('error on quotes pieces save-> ', err)
        return errorResponse('Failed to save quotes pieces', 500)
    }
}

const updateQuotesPieces = async (quotesPiecesData, pieceId) => {
    try {
        let isQuotes = await checkQuotesNumber(quotesPiecesData.quoteNumber)
        if (!isQuotes) {
            return errorResponse('Quotes not found', 404)
        }

        let isQuotesPieces = await checkQuotesPiecesNumber(pieceId)
        if (!isQuotesPieces) {
            return errorResponse('Quotes Pieces are not found', 404)
        }
        // await quotesPieces.update(quotesPiecesData);
        let response = await quotesPieces.update(quotesPiecesData, {
            where: {
                id: pieceId,
            },
        })
        return successResponse('Data updated successfully')
    } catch (err) {
        logger.error('error on quotes pieces update-> ', err)
        return errorResponse('Failed to update quotes pieces', 500)
    }
}

const getQuotesPieces = async (quotePiecesId) => {
    try {
        const data = await quotesPieces.get({
            where: {
                id: quotePiecesId,
            },
        })
        return successResponse(data)
    } catch (error) {
        logger.error('failed to get quotes pieces -> ', err)
        return errorResponse('Failed to get quotes pieces ', 500)
    }
}

const checkQuotesPiecesNumber = async (piecesId) => {
    try {
        const isID = await quotesPieces.get({
            where: {
                id: piecesId,
            },
        })
        if (isID.length === 0) {
            return false
        }
        return true
    } catch (e) {
        logger.error(
            'error on quotes pieces repo; check pieces id response--->',
            e.message
        )
        return false
    }
}

module.exports = {
    saveQuotesPieces,
    updateQuotesPieces,
    getQuotesPieces,
    checkQuotesPiecesNumber,
}
