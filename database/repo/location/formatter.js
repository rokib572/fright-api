const secondSundayOfMarch = (year) => {
  let tempDate = new Date()
  tempDate.setHours(0, 0, 0, 0)
  tempDate.setMonth(2)
  tempDate.setYear(year)
  tempDate.setDate(1)

  let day = tempDate.getDay()
  let toNextSun = day !== 0 ? 7 - day : 0
  tempDate.setDate(tempDate.getDate() + toNextSun + 7 + 1)

  return tempDate
}
const firstSundayOfNovember = (year) => {
  let tempDate = new Date()
  tempDate.setHours(0, 0, 0, 0)
  tempDate.setMonth(10)
  tempDate.setYear(year)
  tempDate.setDate(1)

  let day = tempDate.getDay()
  let toNextSun = day !== 0 ? 7 - day : 0
  tempDate.setDate(tempDate.getDate() + toNextSun + 1)

  return tempDate
}

const isInDaylight = () => {
  let tempDate = new Date()
  let year = tempDate.getFullYear()
  return tempDate >= secondSundayOfMarch(year) && tempDate <= firstSundayOfNovember(year)
}

module.exports = {
  isInDaylight
}