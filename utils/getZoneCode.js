/*
  get zone code by - 2 Character Country abbreviation
- 2 Character Province abbreviation
- 3 Character City abbreviation
- 5 Character mixup of the company name
*/
const getZoneCode = (country, province, city, companyName) => {
  const countryAbbr = removeSpecialChar(country).substring(0, 2)
  const provinceAbbr = removeSpecialChar(province).substring(0, 2)
  const cityAbbr = removeSpecialChar(city).substring(0, 3)
  const companyNameAbbr = removeSpecialChar(companyName).substring(0, 5)
  const zoneCode = `${countryAbbr}${provinceAbbr}${cityAbbr}${companyNameAbbr}`
  return zoneCode.toUpperCase();
}

// remove all white space, hyphen, underscore, space, comma, colon, and period
const removeSpecialChar = (str) => {
  return str.replace(/[^a-zA-Z0-9]/g, '')
}

module.exports = getZoneCode
