// const axios = require('axios')

// //get time zone by address with here api
// const getTimeZoneByAddress = async (address) => {
//   // using here api
//   const url = `https://geocoder.api.here.com/6.2/geocode.json?searchtext=${address}&app_id=${process.env.HERE_API_ID}&app_code=${process.env.HERE_API_CODE}`
//   try {
//     const response = await axios.get(url)
//     const timeZone = response.data.Response.View[0].Result[0].Location.Address.TimeZone
//     return timeZone
//   } catch (err) {
//     return null
//   }
// }

// module.exports = getTimeZoneByAddress