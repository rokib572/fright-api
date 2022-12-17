const getCurrentTime = () => {
  return new Date().toISOString().slice(0, 19).replace('T', ' ')
}

const getTimeWithInterval = (interval) => {
  interval = interval * 24 * 60 * 60 * 1000
  return new Date(new Date().getTime() + interval).toISOString().slice(0, 19).replace('T', ' ')
}

const getTimeWithIntervalWithMinutes = (minutes) => {
  minutes = minutes  * 60 * 1000
  return new Date(new Date().getTime() + minutes).toISOString().slice(0, 19).replace('T', ' ')
}

// get today date with format like 'YYYY-MM-DD'
const getToday = () => {
  const today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const yyyy = today.getFullYear()
  return `${yyyy}-${mm}-${dd}`
}

const DateTime = {
  getCurrentTime,
  getTimeWithInterval,
  getTimeWithIntervalWithMinutes,
  getToday
}

module.exports = DateTime
