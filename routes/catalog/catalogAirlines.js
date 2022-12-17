const {
    getCatalogAirlines,
    getCatalogAirlineById,
} = require('../../database/repo/catalog/catalogAirlinesRepo')

const auth = require(`${__base}utils/auth`)
const logger = require(`${__base}/utils/logger`)

const catalogAirlines = (app) => {
    //Get all airlines
    app.get('/api/catalog/airlines', auth, async (req, res) => {
        try {
            // #swagger.tags = ['Catalog']
            let query = req.query
            const response = await getCatalogAirlines(query)
            return res.status(response.statusCode).send(response)
        } catch (err) {
            logger.error('Error in get all Catalog Airlines api ', err)
            return res.status(500).send(err.message)
        }
    })

    //Get airlines By Id

    app.get('/api/catalog/airlines/:id', auth, async (req, res) => {
        try {
            // #swagger.tags = ['Catalog']
            const { id } = req.params
            const response = await getCatalogAirlineById(id)
            return res.status(response.statusCode).send(response)
        } catch (err) {
            logger.error('Error in get Catalog Airlines by id api ', err)
            return res.status(500).send(err.message)
        }
    })
}

module.exports = catalogAirlines
