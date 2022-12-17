const {
    getTimeZones,
    getTimeZonesById,
} = require('../../database/repo/catalog/timeZoneRepo')

const auth = require(`${__base}utils/auth`)

const catalogTimeZones = (app) => {
    app.get('/api/catalog/timezones', auth, async (req, res) => {
        // #swagger.tags = ['Catalog']
        let columns = ['id', 'timezone', 'offset', 'offset_dst']
        const response = await getTimeZones(columns)
        return res.status(response.statusCode).send(response)
    })

    //Get timezones by id

    app.get('/api/catalog/timezones/:id', auth, async (req, res) => {
        // #swagger.tags = ['Catalog']
        let { id } = req.params
        let columns = ['id', 'timezone', 'offset', 'offset_dst']
        const response = await getTimeZonesById(columns, id)
        return res.status(response.statusCode).send(response)
    })
}

module.exports = catalogTimeZones
