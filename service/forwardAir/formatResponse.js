const xmlToJson = require('./xmlJsonConverter')

module.exports = (xmlData) => {
  try {
    const jsonResponse = xmlToJson({
      xml: xmlData,
    })

    const quoteResponse = JSON.parse(jsonResponse).FAQuoteResponse
    let response = []

    let service = {}
    service.quoteID = ''
    service.totalRate = parseFloat(
      quoteResponse?.['QuoteTotal']?.['_text']
    ).toFixed(2)
    service.serviceLevel = 'Standard'
    service.transitTime =
      quoteResponse?.['TransitDaysTotal']?.['_text'] + ' days'
    response.push(service)

    return { data: response }
  } catch (error) {
    return { error: error.message }
  }
}
