const kalculatorService = require("../../service/kalculatorApi/kalculatorService")
const { kalculatorServiceSchema } = require("./serviceValidate")
const { errorResponse } = require(`${__base}helpers`)
const validate = require(`${__base}utils/validate`)
const auth = require(`${__base}utils/auth`)
const logger = require(`${__base}/utils/logger`)

const serviceRoutes = async (app) => {

    app.post(
        '/api/services/kalculator',
        auth,
        validate(kalculatorServiceSchema),
        async (req, res) => {
          try {
            const data = req.body
            const result = kalculatorService(data)
            return res.status(200).send(result)
          } catch (err) {
            logger.error('Error on kalculator api, Function api err=>', err)
            return res.status(500).json(errorResponse('Failed to calculate'))
          }
        }
      )
}

module.exports = serviceRoutes