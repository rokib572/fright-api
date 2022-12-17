function meterToMile(i) {
  return i * 0.000621371192
}
function mileToMeter(i) {
  return i * 1609.344
}

function lbsToKg(i) {
  if (isNaN(i)) {
    return null
  }
  return i * 0.45359237
}

function kgToLbs(i) {
  if (isNaN(i)) {
    return null
  }
  return i * 2.20462262
}

function kelvinToCelsius(temp) {
  return (temp - 273.15).toFixed(2)
}
function kelvinToFahrenheit(temp) {
  return (((temp - 273.15) * 9) / 5 + 32).toFixed(2)
}

module.exports = {
  meterToMile,
  mileToMeter,
  lbsToKg,
  kgToLbs,
  kelvinToCelsius,
  kelvinToFahrenheit,
}
