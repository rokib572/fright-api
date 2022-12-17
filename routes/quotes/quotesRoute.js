const {
    saveQuotesEquipment,
    getQuotesEquipments,
    updateQuotesEquipment,
} = require('../../database/repo/quotes/quotesEquipmentsRepo')
const {
    saveQuotes,
    updateQuotes,
} = require('../../database/repo/quotes/quotesRepo')
const {
    saveQuotesRoutes,
    getQuotesRoutes,
    updateQuotesRoutes,
} = require('../../database/repo/quotes/quotesRoutesRepo')
const {
    createQuoteSchema,
    updateQuoteSchema,
    createQuoteRouteSchema,
    createQuotePiecesSchema,
    updateQuoteRouteSchema,
    createQuoteEquipmentSchema,
    updateQuoteEquipmentSchema,
} = require('./quotesValidator')
const validate = require(`${__base}utils/validate`)
const auth = require(`${__base}utils/auth`)
const logger = require(`${__base}/utils/logger`)
const {
    saveQuotesPieces,
    updateQuotesPieces,
} = require('../../database/repo/quotes/quotesPiecesRepo')

const quotesRoute = (app) => {
    //Post Quote
    app.post(
        '/api/quotes',
        auth,
        validate(createQuoteSchema),
        async (req, res) => {
            try {
                let data = req.body
                const response = await saveQuotes(data)
                return res.status(response.statusCode).send(response)
            } catch (err) {
                logger.error('Error in post quotesRoute api ', err)
                return res.status(500).send(err.message)
            }
        }
    )

    app.patch(
        '/api/quotes/:quoteId',
        auth,
        validate(updateQuoteSchema),
        async (req, res) => {
            try {
                let data = req.body
                let id = req.params.quoteId
                const response = await updateQuotes(data, id)
                return res.status(response.statusCode).send(response)
            } catch (err) {
                logger.error('Error in post quotesRoute api ', err)
                return res.status(500).send(err.message)
            }
        }
    )

    app.post(
        '/api/quotes/:quoteId/routes',
        auth,
        validate(createQuoteRouteSchema),
        async (req, res) => {
            try {
                let data = req.body
                data.quotesId = req.params.quoteId
                const response = await saveQuotesRoutes(data)
                return res.status(response.statusCode).send(response)
            } catch (err) {
                logger.error('Error in post quotesRoutes => ', err)
                return res.status(500).send(err.message)
            }
        }
    )

    app.get('/api/quotes/:quoteId/routes', auth, async (req, res) => {
        try {
            let quotesId = req.params.quoteId
            const response = await getQuotesRoutes(quotesId)
            return res.status(response.statusCode).send(response)
        } catch (err) {
            logger.error('Error in post quotesRoutes => ', err)
            return res.status(500).send(err.message)
        }
    })

    app.patch(
        '/api/quotes/:quoteId/routes/:routeId',
        auth,
        validate(updateQuoteRouteSchema),
        async (req, res) => {
            try {
                let data = req.body
                data.quotesId = req.params.quoteId
                data.id = req.params.routeId
                const response = await updateQuotesRoutes(data)
                return res.status(response.statusCode).send(response)
            } catch (err) {
                logger.error('Error in post quotesRoutes => ', err)
                return res.status(500).send(err.message)
            }
        }
    )

    //post quote equipment
    app.post(
        '/api/quotes/:quoteId/equipment',
        auth,
        validate(createQuoteEquipmentSchema),
        async (req, res) => {
            try {
                let data = req.body
                data.quotesId = req.params.quoteId
                const response = await saveQuotesEquipment(data)
                return res.status(response.statusCode).send(response)
            } catch (err) {
                logger.error('Error in post quotesEquipments => ', err)
                return res.status(500).send(err.message)
            }
        }
    )

    //patch quote equipment
    app.patch(
        '/api/quotes/:quoteId/equipment/:quoteEquipmentId',
        auth,
        validate(updateQuoteEquipmentSchema),
        async (req, res) => {
            try {
                let { quoteId, quoteEquipmentId } = req.params
                let data = req.body
                const response = await updateQuotesEquipment(
                    data,
                    quoteId,
                    quoteEquipmentId
                )
                return res.status(response.statusCode).send(response)
            } catch (err) {
                logger.error('Error in post quotesEquipments update => ', err)
                return res.status(500).send(err.message)
            }
        }
    )

    //get quote equipment
    app.get('/api/quotes/:quoteId/equipment', auth, async (req, res) => {
        try {
            let quotesId = req.params.quoteId
            const response = await getQuotesEquipments(quotesId)
            return res.status(response.statusCode).send(response)
        } catch (err) {
            logger.error('Error in post quotesEquipments => ', err)
            return res.status(500).send(err.message)
        }
    })

    // post quotes pieces
    app.post(
        '/api/quotes/:quoteId/pieces',
        auth,
        validate(createQuotePiecesSchema),
        async (req, res) => {
            try {
                let data = req.body
                data.quoteNumber = req.params.quoteId
                const response = await saveQuotesPieces(data)
                return res.status(response.statusCode).send(response)
            } catch (err) {
                logger.error('Error in post quotes pieces => ', err)
                return res.status(500).send(err.message)
            }
        }
    )
    // patch quotes pieces
    app.patch(
        '/api/quotes/:quoteId/pieces/:pieceId',
        auth,
        validate(createQuotePiecesSchema),
        async (req, res) => {
            try {
                let data = req.body
                data.quoteNumber = req.params.quoteId
                let pieceId = req.params.pieceId
                const response = await updateQuotesPieces(data, pieceId)
                return res.status(response.statusCode).send(response)
            } catch (err) {
                logger.error('Error in post quotesRoutes => ', err)
                return res.status(500).send(err.message)
            }
        }
    )
}

module.exports = quotesRoute
