const xmlToJson = require(`${__base}utils/xmlJsonConverter`)

module.exports = (xml) => {
  try {
    const jsonResponse = JSON.parse(
      xmlToJson({
        xml: xml,
      })
    )

    //return jsonResponse
    if(jsonResponse['soapenv:Envelope']['soapenv:Body']?.['soapenv:Fault']){
      const details = jsonResponse['soapenv:Envelope']['soapenv:Body']['soapenv:Fault']['detail']
      
      if(details['imag:schemaError']){
        return details['imag:schemaError']['_text']
      }else if(details['imag:generalError']){
        return details['imag:generalError']['_text']
      }
      return 'Could not get response from Estes';
    }else{
      return 'Could not get response from Estes';
    }
  } catch (err) {
    return err
  }
}
