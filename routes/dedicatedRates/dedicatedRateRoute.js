const { createDedicatedRateSchema } = require('./dedicatedRateValidator')
const validate = require(`${__base}utils/validate`)
const auth = require(`${__base}utils/auth`)
const logger = require(`${__base}/utils/logger`)
const {
    saveDedicatedRate,
    getDedicatedRates,
    searchDedicatedRates,
} = require('../../database/repo/dedicatedRate/dedicatedRateRepo')

const dedicatedRateRoute = (app) => {
    app.post(
        '/api/dedicatedRates',
        auth,
        validate(createDedicatedRateSchema),
        async (req, res) => {
            try {
                let data = req.body
                const response = await saveDedicatedRate(data)
                return res.status(response.statusCode).send(response)
            } catch (err) {
                logger.error('Error in post dedicated rate api ', err)
                return res.status(500).send(err.message)
            }
        }
    )

    app.get(
        '/api/dedicatedRates/search/:serviceType/:origin/:destination',
        auth,
        async (req, res) => {
            try {
                let routeParams = req.params
                const response = await getDedicatedRates(routeParams)
                return res.status(response.statusCode).send(response)
            } catch (error) {
                logger.error('Error in get dedicated rate api->', error)
                return res.status(500).send(error.message)
            }
        }
    )

    app.get('/api/dedicatedRates/search', auth, async (req, res) => {
        try {
            let routeParams = req.query
            const response = await searchDedicatedRates(routeParams)
            return res.status(response.statusCode).send(response)
        } catch (error) {
            logger.error('Error in get dedicated rate api->', error)
            return res.status(500).send(error.message)
        }
    })
}

module.exports = dedicatedRateRoute
