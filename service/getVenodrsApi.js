const { decrypt } = require(`${__base}service/passwordEncryptionService`)
const customQuery = require('../database/models/customQuery')

const getVendorsApi = async (url) => {
    const sql = `SELECT apiURL,tokenA apiKey,tokenB apiSecret,accountNumber,userName,password  FROM  credentials cred INNER JOIN vendorsAPI vapi  ON cred.id=vapi.credentialsId INNER JOIN  vendors vn ON vn.id =vapi.vendorsId  WHERE cred.isDeleted=0 and vn.blackListed=0 and vn.website="${url}"`
    let result = await customQuery.query(sql)
    result[0].password = await decrypt(result[0].password)
    return result[0]
}

module.exports = { getVendorsApi }
