const xmlToJson = require('../../utils/xmlJsonConverter')

module.exports = (xml) => {
  try {
    const jsonResponse = JSON.parse(
      xmlToJson({
        xml: xml,
      })
    )

    let rateResponse =
      jsonResponse?.['soap:Envelope']?.['soap:Body']?.['GetRatesResponse']?.[
        'GetRatesResult'
      ]

    if (
      !rateResponse?.['QuoteId']?.['_text'] &&
      rateResponse?.['ErrorMessage']?.['_text']
    ) {
      return { error: rateResponse['ErrorMessage']['_text'] }
    }

    let response = []
    let service = {}
    service.quoteID = rateResponse['QuoteId']['_text']
    service.totalRate = parseFloat(rateResponse['NetFc']['_text']).toFixed(2)
    service.serviceLevel = 'Standard'
    service.transitTime = '1 day'
    response.push(service)

    return { data: response }
  } catch (error) {
    return { error: error.message }
  }
}
