const {getVendorsApi} = require(`${__base}service/getVenodrsApi`)

const xmlBody = async (requestObject) => {
  const estesCredentials = await getVendorsApi('www.estes-express.com')
  const items = requestObject?.trackingNumber?.split("-");

  return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:imag="http://ws.estesexpress.com/imageview">
  <soapenv:Header>
  <imag:auth>
  <imag:user>${estesCredentials.userName}</imag:user>
  <imag:password>${estesCredentials.password}</imag:password>
  </imag:auth>
  </soapenv:Header>
  <soapenv:Body>
  <imag:imgRequest>
  <imag:requestID>${requestObject?.trackingNumber}</imag:requestID>
  <imag:search>
  <imag:item1>${items[0]}</imag:item1>
  <imag:item2>${items[1] ?? ''}</imag:item2>
  </imag:search>
  <imag:document>${requestObject?.docType?.toUpperCase()}</imag:document>
  </imag:imgRequest>
  </soapenv:Body>
  </soapenv:Envelope>`
}

module.exports = xmlBody