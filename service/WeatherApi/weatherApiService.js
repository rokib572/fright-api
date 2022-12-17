const { default: axios } = require('axios')
const { successResponse, errorResponse } = require(`${__base}helpers`)
const getWeatherByLocation = async (lat, lon, exclude) => {
  try {
    const apiKey = process.env.WEATHER_API_KEY
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&appid=${apiKey}`
    const headers = {
      'Content-Type': 'application/json',
    }
    const { data } = await axios.post(url, { headers: headers })
    return successResponse(data)
  } catch (err) {
    return errorResponse(err.message)
  }
}

module.exports = { getWeatherByLocation }
