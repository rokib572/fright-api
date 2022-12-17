const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')
const logger = require(`${__base}utils/logger`)

const createJWT = async (obj) => {
  const token = await jwt.sign(obj, process.env.JWT_SECRET)
  return token
}

const generateToken = async (obj) => {
  try {
    let tokenInfo = {
      userId: obj.userId,
      email: obj.email,
      firstName: obj.firstName,
      lastName: obj.lastName,
    }
    const jwt = await createJWT(tokenInfo)
    return jwt
  } catch (err) {
    logger.error('Error in generateToken', err)
  }
}

const generateUUID = () => uuidv4()

const passwordCompareSync = (passwordToTest, passwordHash) => {
  bcrypt.compareSync(passwordToTest, passwordHash)
}

const verifyToken = async (token) => {
  try {
    const decodeToken = await jwt.verify(token, process.env.JWT_SECRET)
    delete decodeToken.iat
    return decodeToken
  } catch (err) {
    logger.error('Error in verifyToken', err)
    return false
  }
}

module.exports = {
  createJWT,
  generateToken,
  generateUUID,
  passwordCompareSync,
  verifyToken,
}
