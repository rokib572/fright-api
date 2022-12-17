const nodemailer = require("nodemailer")
const logger = require(`${__base}/utils/logger`)
const { successResponse, errorResponse } = require(`${__base}helpers`)


const transporter = nodemailer.createTransport({
  port: process.env.EMAIL_PORT,
  host: process.env.EMAIL_HOST,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  secure: false, // upgrades later with STARTTLS -- change this based on the PORT
})

const sendEmail = async (to, subject, body) => {
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" ${process.env.EMAIL_FROM_ADDRESS}`,
    to: to,
    subject: subject,
    text: body,
  }
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        logger.error("Mail Error: error --> ", err)
        return reject("Can't send email")
      }
      return resolve("Email sent successfully")
    })
  })
}

module.exports = sendEmail
