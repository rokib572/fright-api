const {
    saveCatalogAccessorials,
    getCatalogAccessorials,
} = require('../../database/repo/catalog/catalogAccessorialsRepo')
const validate = require(`${__base}utils/validate`)
const {
    catalogAccessorialsSchemaValidation,
} = require('./catalogSchemaValidation')

const auth = require(`${__base}utils/auth`)

const logger = require(`${__base}/utils/logger`)
const catalogAccessorials = (app) => {
    // save Accessorials
    app.post(
        '/api/catalog/accessorials',
        auth,
        validate(catalogAccessorialsSchemaValidation),
        async (req, res) => {
            try {
                // #swagger.tags = ['Catalog']
                const data = req.body.accessorial

                const response = await saveCatalogAccessorials(data)
                return res.status(response.statusCode).send(response)
            } catch (err) {
                logger.error(
                    'Error in Save Catalog Accessorials route, error ->>',
                    err
                )
                return res.status(500).send(err.message)
            }
        }
    )

    app.get('/api/catalog/accessorials', auth, async (req, res) => {
        try {
            // #swagger.tags = ['Catalog']
            const response = await getCatalogAccessorials()
            return res.status(response.statusCode).send(response)
        } catch (err) {
            logger.error(
                'Error in Save Catalog Accessorials route, error ->>',
                err
            )
            return res.status(500).send(err.message)
        }
    })
}

module.exports = catalogAccessorials
