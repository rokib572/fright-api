const mysql = require('mysql2')

const mySqlConn = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  waitForConnections: true,
  connectionLimit: process.env.DB_CONNECTION_LIMIT,
  connectTimeout: 60000
})

module.exports = mySqlConn
