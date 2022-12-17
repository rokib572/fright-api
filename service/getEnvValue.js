const envVariables = require('../database/models/envVariables')
const logger = require(`${__base}/utils/logger`)
module.exports = async (env_key) => {
  try {
    const result = await envVariables.get({
      where: {
        env_key: env_key,
      },
    })
    if (result.length > 0) {
      return result[0].env_value
    }
    return false
  } catch (err) {
    logger.error('Error in getEnvValue_function, error ->>', err)
    return false
  }
}
