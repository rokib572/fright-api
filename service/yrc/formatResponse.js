module.exports = (responseBody) => {
  const pickupDate = responseBody.pickupDate
  const deliveryDate = responseBody.delivery.deliveryDate
  return [
    {
      quoteId: responseBody.quoteId,
      totalRate: parseFloat(
        convertToDollar(responseBody.ratedCharges.totalCharges)
      ).toFixed(2),
      serviceLevel: responseBody.delivery.requestedServiceType.value,
      transitTime: `${getDifferenceBetweenDates(
        pickupDate,
        deliveryDate
      )} days`,
    },
  ]
}

const getDifferenceBetweenDates = (date1, date2) => {
  if (date1 && date2) {
    date1 = date1.toString()
    date2 = date2.toString()
    date1 = date1.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
    date2 = date2.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
    date1 = new Date(date1)
    date2 = new Date(date2)
    const diff = Math.abs(date2 - date1)
    const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return diffDays
  }
  return 'NaN'
}

const convertToDollar = (amount) => {
  //if the ammount is 12000, then last 2 digits are penny and rest is dollar
  //so we need to convert it to dollar
  const dollar = amount.toString().substring(0, amount.toString().length - 2)
  const penny = amount.toString().substring(amount.toString().length - 2)
  return Number(`${dollar ? dollar : 0}.${penny}`)
}
