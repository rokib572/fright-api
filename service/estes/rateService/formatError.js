const xmlToJson = require(`${__base}utils/xmlJsonConverter`)

module.exports = (xml) => {
  try {
    const jsonResponse = JSON.parse(
      xmlToJson({
        xml: xml,
      })
    )
    const fault =
      jsonResponse['soapenv:Envelope']['soapenv:Body']['soapenv:Fault']

    let message = fault['faultstring']['_text']
    let detailsObj = message
    if (fault['detail']['rat:schemaError']) {
      if (detailsObj) {
        detailsObj += ' && '
      }
      detailsObj = fault['detail']['rat:schemaError']['rat:error']['_text']
    }
    if (fault['detail']['rat:generalError']) {
      if (detailsObj) {
        detailsObj += ' && '
      }
      detailsObj =
        fault['detail']['rat:generalError']['rat:error']['rat:message']['_text']
    }

    const errorObj = {
      message: message,
      details: detailsObj,
    }

    return detailsObj
  } catch (err) {
    return err
  }
}
