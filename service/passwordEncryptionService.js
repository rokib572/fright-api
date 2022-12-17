//Checking the crypto module
const Cryptr = require('cryptr')
const crypt = new Cryptr(process.env.PASSWORD_ENCRYPTED_SERECT_KEY)
const logger = require(`${__base}/utils/logger`)

//Encryption
const encrypt = async (text) => {
  try {
    return crypt.encrypt(text)
  } catch (e) {
    logger.error(e.message)
  }
}

const decrypt = async (text) => {
  try {
    return crypt.decrypt(text)
  } catch (e) {
    logger.error(e.message)
  }
}

module.exports = {
  encrypt,
  decrypt,
}
