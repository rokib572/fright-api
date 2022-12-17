const {
    getCountries,
    getCountriesByAlpha,
    getCountriesByCodeAndQuery,
} = require('../../database/repo/catalog/countriesRepo')
const logger = require(`${__base}/utils/logger`)

const auth = require(`${__base}utils/auth`)

const countries = (app) => {
    app.get('/api/catalog/countries', auth, async (req, res) => {
        try {
            // #swagger.tags = ['Catalog']
            let columns = ['alpha2', 'name']
            const response = await getCountries(columns)
            return res.status(response.statusCode).send(response)
        } catch (err) {
            logger.error('Error in get all countries  api ', err)
            return res.status(500).send(err.message)
        }
    })

    //Get countries by id

    app.get('/api/catalog/countries/:alpha2', auth, async (req, res) => {
        try {
            // #swagger.tags = ['Catalog']
            let { alpha2 } = req.params
            let columns = ['alpha2', 'name']
            const response = await getCountriesByAlpha(columns, alpha2)
            return res.status(response.statusCode).send(response)
        } catch (err) {
            logger.error('Error in get countries by alpha2 api ', err)
            return res.status(500).send(err.message)
        }
    })

    //GEt countries by country code and cities

    app.get(
        '/api/catalog/countries/:countryCode/cities',
        auth,
        async (req, res) => {
            try {
                // #swagger.tags = ['Catalog']
                const { countryCode } = req.params
                let query = req.query
                var response = await getCountriesByCodeAndQuery(
                    countryCode,
                    query
                )
                return res.status(response.statusCode).send(response)
            } catch (err) {
                logger.error('Error in get countries by cites api ', err)
                return res.status(500).send(err.message)
            }
        }
    )
}

module.exports = countries
