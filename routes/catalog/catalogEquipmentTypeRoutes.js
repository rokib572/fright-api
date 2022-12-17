const {
    getCatalogEquipmentType,
} = require('../../database/repo/catalog/catalogEquipmentTypeRepo')

const { errorResponse } = require(`${__base}helpers`)
const auth = require(`${__base}utils/auth`)

const catalogEquipmentTypeRoutes = async (app) => {
    app.get('/api/catalog/equipmentType', auth, async (req, res) => {
        try {
            // #swagger.tags = ['Catalog']
            const response = await getCatalogEquipmentType()
            return res.status(200).send(response)
        } catch (err) {
            return res.status(500).send(errorResponse(err.message))
        }
    })
}

module.exports = catalogEquipmentTypeRoutes
