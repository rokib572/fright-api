const xmlToJson = require('../../utils/xmlJsonConverter')

module.exports = (xml, serviceType) => {
  try {
    const jsonResponse = JSON.parse(
      xmlToJson({
        xml: xml,
      })
    )

    let rateResponse =
      jsonResponse?.['env:Envelope']?.['env:Body']?.['ns0:quoteResponse']?.[
        'quoteReturn'
      ]?.['RateQuote']

    if (
      !rateResponse?.['quoteNumber']?.['_text'] &&
      rateResponse?.['quoteErrorMessage']?.['_text']
    ) {
      return { error: rateResponse['quoteErrorMessage']['_text'] }
    }

    let quoteDate = new Date(rateResponse['quoteDate']['_text'])
    let deliveryDate = new Date(
      rateResponse['quoteProjectedDeliveryDate']['_text']
    )

    let dayDiff = deliveryDate.getTime() - quoteDate.getTime()
    dayDiff = Math.ceil(dayDiff / (24 * 3600 * 1000))

    service = {}
    service.quoteID = rateResponse['quoteNumber']['_text']
    service.totalRate = parseFloat(
      rateResponse['quoteNetCharges']['_text']
    ).toFixed(2)
    service.serviceLevel =
      serviceType == 'Standard'
        ? 'Standard LTL'
        : 'Guaranteed Standard by 5 P.M.'
    service.transitTime = dayDiff + ' days'

    return { data: service }
  } catch (error) {
    console.log('ee', error)
    return { error: error.message }
  }
}
