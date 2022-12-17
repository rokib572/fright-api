const {
    getCatalogAirports,
} = require('../../database/repo/catalog/catalogAirportsRepo')

const auth = require(`${__base}utils/auth`)
const logger = require(`${__base}/utils/logger`)

const catalogAirports = (app) => {
    app.get('/api/catalog/airports', auth, async (req, res) => {
        try {
            // #swagger.tags = ['Catalog']
            var columns = [
                'id',
                'airportType',
                'name',
                'country',
                'region',
                'city',
                'coordinates',
                'iataCode',
            ]
            let query = req.query
            const response = await getCatalogAirports(columns, query)
            return res.status(response.statusCode).send(response)
        } catch (err) {
            logger.error('Error in get all Catalog Airports api ', err)
            return res.status(500).send(err.message)
        }
    })
}

module.exports = catalogAirports
