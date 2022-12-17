// const mySql = require("../config/db");
const mySql = require(`${__base}database/mysql-connect`)

class databaseOperations {
  constructor(table) {
    this.table = table
  }

  sqlConnection() {
    return true
  }

  /**
   * find from database
   * @param {object} data {columns(string_array), where(object), cwhere(string),  page(number), limit(number)}
   * @returns data
   */
  get(data = {}) {
    const sql = queryBuilder.build.filter(this.table, data)
    return new Promise((resolve, reject) => {
      this.sqlConnection()
        ? mySql.query(sql, function (err, data) {
            if (err) {
              reject(err)
            } else {
              resolve(Object.values(JSON.parse(JSON.stringify(data))))
            }
          })
        : reject('Connection to database failed!')
    })
  }

  /**
   * Insert into database
   * @param {object} data The dataObject to be inserted
   * @returns void
   */
  save(data) {
    const sql = queryBuilder.build.save(this.table)
    return new Promise((resolve, reject) => {
      this.sqlConnection()
        ? mySql.query(sql, data, (err, data) => {
            if (err) {
              reject(err)
            } else {
              resolve(data)
            }
          })
        : reject('Connection to database failed')
    })
  }

  bulkSave(data) {
    const sql = queryBuilder.build.bulkInsert(this.table, data)
    return new Promise((resolve, reject) => {
      this.sqlConnection()
        ? mySql.query(sql, (err, data) => {
            if (err) {
              reject(err)
            } else {
              resolve(data)
            }
          })
        : reject('Connection to database failed')
    })
  }

  /**
   *
   * @param {object} data the data object to be updated
   * @param {object} where {where(object), cwhere(string)}
   * @returns
   */
  update(data, where) {
    const sql = queryBuilder.build.update(this.table, where)

    return new Promise((resolve, reject) => {
      this.sqlConnection()
        ? mySql.query(sql, data, (err, data) => {
            if (err) {
              reject(err)
            } else {
              resolve(data.affectedRows)
            }
          })
        : reject('Connection to database failed')
    })
  }

  /**
   * Delete from database
   * @param {object} where {where(object), cwhere(string)}
   * @returns promise with data
   */
  delete(where) {
    const sql = queryBuilder.build.delete(this.table, where)
    return new Promise((resolve, reject) => {
      this.sqlConnection()
        ? mySql.query(sql, (err, data) => {
            if (err) {
              reject(err)
            } else {
              resolve(data.affectedRows)
            }
          })
        : reject('Connection to database failed')
    })
  }

  /**
   * Custom query
   * @param {string} query the query to be executed
   * @returns promise with data
   */
  query(query) {
    const sql = queryBuilder.build.query(query)
    return new Promise((resolve, reject) => {
      this.sqlConnection()
        ? mySql.query(sql, function (err, data) {
            if (err) {
              reject(err)
            } else {
              resolve(data)
            }
          })
        : reject('Connection to database failed')
    })
  }
  /**
   *
   * @param {string} procedure the procedure_function to be executed
   * @param {array} params the params to be passed to the procedure
   * @returns
   */
  callProcedure(procedure, params) {
    const { sql, paramArray } = queryBuilder.build.callProcedure(
      procedure,
      params
    )
    return new Promise((resolve, reject) => {
      this.sqlConnection()
        ? mySql.query(sql, paramArray, function (err, data) {
            if (err) {
              reject(err)
            } else {
              resolve(Object.values(JSON.parse(JSON.stringify(data[0]))))
            }
          })
        : reject('Connection to database failed')
    })
  }
}

const queryBuilder = {
  build: {
    save: (name) => {
      return `INSERT INTO ${name} SET ?`
    },

    //create a bulk insert query for multiple inserts with parenthesis
    bulkInsert: (name, data) => {
      const columns = Object.keys(data[0])
      const values = data.map((item) => {
        return `(${columns
          .map((column) => {
            if (typeof item[column] === 'string') {
              return `'${item[column]}'`
            }
            return item[column]
          })
          .join(',')})`
      })
      return `INSERT INTO ${name} (${columns.join(',')}) VALUES ${values.join(
        ','
      )}`
    },

    filter: (name, { columns, where, cwhere, page, limit, orderBy }) => {
      let conditions = ''
      if (where) {
        const conditionKeys = Object.keys(where)
        const conditionValues = Object.values(where).map((value) =>
          typeof value === 'string' ? `'${value}'` : value
        )
        conditionKeys.forEach((key, index) => {
          conditions += `${key} = ${conditionValues[index]}${
            index === conditionKeys.length - 1 ? '' : ' AND '
          }`
        })
      }

      let query = `SELECT ${columns ? columns.join(', ') : '*'} FROM ${name} `
      if (conditions) query += ` WHERE ${conditions}`
      if (cwhere) {
        conditions ? (query += ` AND ${cwhere}`) : (query += ` WHERE ${cwhere}`)
      }
      if (orderBy) query += ` ORDER BY ${orderBy}`

      if (page && limit) query += ` LIMIT ${limit} OFFSET ${(page - 1) * limit}`
      return query
    },
    update: (name, { where, cwhere }) => {
      let conditions = ''
      if (where) {
        const conditionKeys = Object.keys(where)
        const conditionValues = Object.values(where).map((value) =>
          typeof value === 'string' ? `'${value}'` : value
        )
        conditionKeys.forEach((key, index) => {
          conditions += `${key} = ${conditionValues[index]}${
            index === conditionKeys.length - 1 ? '' : ' AND '
          }`
        })
      }

      let query = `UPDATE ${name} SET ? `
      if (conditions) query += ` WHERE ${conditions}`
      if (cwhere) {
        conditions ? (query += ` AND ${cwhere}`) : (query += ` WHERE ${cwhere}`)
      }
      return query
    },
    delete: (name, { where, cwhere }) => {
      let conditions = ''
      if (where) {
        const conditionKeys = Object.keys(where)
        const conditionValues = Object.values(where).map((value) =>
          typeof value === 'string' ? `'${value}'` : value
        )
        conditionKeys.forEach((key, index) => {
          conditions += `${key} = ${conditionValues[index]}${
            index === conditionKeys.length - 1 ? '' : ' AND '
          }`
        })
      }
      let query = `DELETE FROM ${name} `
      if (conditions) query += ` WHERE ${conditions}`
      if (cwhere) {
        conditions ? (query += ` AND ${cwhere}`) : (query += ` WHERE ${cwhere}`)
      }
      return query
    },
    query: (query) => {
      return `${query}`
    },
    callProcedure: (procedure, params) => {
      const paramArray = []
      let sql = `CALL ${procedure}(`
      params &&
        params.forEach((param, index) => {
          sql += `?`
          paramArray.push(param)
          if (index !== params.length - 1) {
            sql += `,`
          }
        })
      sql += `)`
      return { sql, paramArray }
    },
  },
}

module.exports = {
  databaseOperations,
  queryBuilder,
}
