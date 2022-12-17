const mysqlCon = require('../database/mysql-connect')
const { successResponse, errorResponse } = require(`${__base}helpers`)
const logger = require(`${__base}/utils/logger`)


const insertQuery = async (data, tableName, successMessage, failedMessage) => {
  try {
    // sqlConnection()
    let sqlQuery = `INSERT INTO ${tableName} SET ?`
    return new Promise((resolve, reject) => {
      mysqlCon.query(sqlQuery, data, (err) => {
        if (err) {
          return reject(errorResponse(failedMessage, 400))
        }

        return resolve(successResponse(data, 200, successMessage))
      })
    })
  } catch (err) {
    logger.error(err.message)
    return errorResponse(err.message, 400)
  }
}

//update query function
const updateQuery = async (
  whereCondition,
  data,
  tableName,
  successMessage,
  failedMessage,
) => {
  try {
    // sqlConnection()

    let sql = `UPDATE ${tableName} SET ? ${whereCondition}`

    return new Promise((resolve, reject) => {
      mysqlCon.query(sql, data, (err, results) => {
        if (err) {
          return reject(errorResponse(err.message, 400))
        }

        let success = ''
        if (results.affectedRows > 0) {
          success = successResponse(successMessage, 200)
        } else {
          success = errorResponse(failedMessage, 400)
        }
        return resolve(success)
      })
    })
  } catch (e) {
    logger.error(e.message)
    return errorResponse(e.message, 400)
  }
}

//delete query function
const deleteQuery = async (
  whereCondition,
  data,
  tableName,
  successMessage,
  failedMessage,
) => {
  try {
    // sqlConnection()

    let sql = `UPDATE ${tableName} From ? ${whereCondition}`

    return new Promise((resolve, reject) => {
      mysqlCon.query(sql, data, (err, results) => {
        if (err) {
          return reject(errorResponse(err.message, 400))
        }

        let success = ''
        if (results.affectedRows > 0) {
          success = successResponse(successMessage, 200)
        } else {
          success = errorResponse(failedMessage, 400)
        }
        return resolve(success)
      })
    })
  } catch (e) {
    logger.error(e.message)
    return errorResponse(e.message, 400)
  }
}

//Select Query By Parameter
const selectQuery = async (
  table,
  parameter,
  whereCondition,
  errorMessage,
  page,
  offset,
) => {
  try {
    // sqlConnection()

    let sql = `SELECT ${parameter} FROM ${table} ${whereCondition}`

    return new Promise((resolve, reject) => {
      mysqlCon.query(sql, parameter, (err, results) => {
        if (err) {
          return reject(errorResponse(err.message, 400))
        }

        let success = ''
        const result = Object.values(JSON.parse(JSON.stringify(results)))

        if (page) {
          if (result.length > 0) {
            success = {
              statusCode: 200,
              status: 'success',
              Page: page,
              Limit: offset + 1 + '-' + (offset + 10),
              result: result,
            }
          } else {
            success = {
              statusCode: 200,
              status: 'Failed',
              Page: page,
              Limit: offset + 1 + '-' + (offset + 10),
              result: result,
            }
          }
        } else {
          if (result.length > 0) {
            success = successResponse(result)
          } else {
            success = errorResponse(errorMessage)
          }
        }

        return resolve(success)
      })
    })
  } catch (e) {
    logger.error(e)
    return errorResponse(e.message, 400)
  }
}

module.exports = {
  insertQuery,
  updateQuery,
  selectQuery,
  deleteQuery,
}
