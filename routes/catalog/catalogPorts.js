const {
    getCatalogPorts,
    getCatalogPortById,
} = require('../../database/repo/catalog/catalogPortsRepo')

const auth = require(`${__base}utils/auth`)
const logger = require(`${__base}/utils/logger`)

const catalogPorts = (app) => {
    app.get('/api/catalog/ports', auth, async (req, res) => {
        try {
            // #swagger.tags = ['Catalog']
            let query = req.query
            const response = await getCatalogPorts(query)
            return res.status(response.statusCode).send(response)
        } catch (err) {
            logger.error('Error in get all Catalog Ports api ', err)
            return res.status(500).send(err.message)
        }
    })

    //Get airlines By Id

    app.get('/api/catalog/ports/:id', auth, async (req, res) => {
        try {
            // #swagger.tags = ['Catalog']
            const { id } = req.params
            const response = await getCatalogPortById(id)
            return res.status(response.statusCode).send(response)
        } catch (err) {
            logger.error('Error in get Catalog Ports by id api ', err)
            return res.status(500).send(err.message)
        }
    })
}

module.exports = catalogPorts
