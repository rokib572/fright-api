const { successResponse, errorResponse } = require('../../../helpers')
const getUtcTime = require('../../../utils/getUTCTime')
const logger = require('../../../utils/logger')
const quotes = require('../../models/quotes')
const usersStaff = require('../../models/usersStaff')
const { findContactById } = require('../contact/contactRepo')
const { findLocationById } = require('../location/locationRepo')
const { generateUUID } = require(`${__base}service/authService`)
const saveQuotes = async (quote) => {
    try {
        const data = {
            quoteNumber: await generateUUID(),
            quoteDate: getUtcTime(),
            createdBy: quote.createdBy,
            requestedBy: quote.requestedBy,
            billingParty: '',
            serviceType: '',
            salesPerson: '',
        }
        let isUser = await checkUserID(quote.createdBy)
        if (isUser) {
            await quotes.save(data)

            return successResponse('Quotes saved successfully')
        }
        return errorResponse('User not found')
    } catch (e) {
        logger.error('error on quotes repo response--->', e.message)
        return errorResponse(e, 500)
    }
}

const updateQuotes = async (quote, id) => {
    try {
        const isQuotes = await quotes.get({ where: { quotesId: id } })
        if (isQuotes.length === 0) {
            return errorResponse('Quotes id not found')
        }

        const data = {
            quoteNumber: quote?.quoteNumber,
            quoteDate: getUtcTime(quote?.quoteDate),
            billingParty: quote?.billingParty,
            serviceType: quote?.serviceType,
            salesPerson: quote?.salesPerson,
        }

        if (quote.createdBy) {
            let isUser = await checkUserID(quote.createdBy)
            if (!isUser) {
                return errorResponse('createdBy(UserStaffId) not found')
            }
            data.createdBy = quote.createdBy
        }
        if (quote.requestedBy) {
            let contact = await findContactById(quote.requestedBy)
            if (!contact) {
                return errorResponse('requestedBy(ContactId) not found')
            }
            data.requestedBy = quote.requestedBy
        }
        if (quote.billingParty) {
            let location = await findLocationById(quote.billingParty)
            if (!location) {
                return errorResponse('billingParty(LocationId) not found')
            }
            data.billingParty = quote.billingParty
        }
        //console.table(data)
        let response = await quotes.update(data, {
            where: {
                quotesId: id,
            },
        })
        return successResponse(response)
    } catch (e) {
        logger.error('error on quotes repo response--->', e)
        return errorResponse('Failed to update quotes', 500)
    }
}

const checkUserID = async (Id) => {
    try {
        const isID = await usersStaff.get({
            where: {
                id: Id,
                isDeleted: 0,
            },
        })
        if (isID.length === 0) {
            return false
        }
        return true
    } catch (e) {
        logger.error('error on quotes repo checkUserID response--->', e.message)
    }
}

const checkQuotesNumber = async (quoteNumber) => {
    try {
        const isID = await quotes.get({
            where: {
                quoteNumber: quoteNumber,
            },
        })
        if (isID.length === 0) {
            return false
        }
        return true
    } catch (e) {
        logger.error(
            'error on quotes repo checkQuotesNumber response--->',
            e.message
        )
        return false
    }
}

module.exports = {
    saveQuotes,
    updateQuotes,
    checkQuotesNumber,
}
