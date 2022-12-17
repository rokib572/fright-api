const getWeight = require('../../utils/getWeight')

const wardPayload = (data, vApi) => {
  return `<Body>
    <request>
      <User>
        <UserName>${vApi.userName}</UserName>
        <Password>${vApi.password}</Password>
      </User>
      <Details>
      ${data.pieces.map((p) => {
        return `<DetailItem>
          <Weight>${getWeight(p, 'kg')}</Weight>
          <Pieces>${p.quantity}</Pieces>
          <Class>${p.freightClass}</Class>
        </DetailItem>`
      })}
        
      </Details>
      <Accessorials>
      ${data.accessorials.map((acc) => {
        return `<AccessorialItem>
        <Code>${acc}</Code>
      </AccessorialItem>`
      })}
      </Accessorials>
      <BillingTerms>PPD</BillingTerms>
      <OriginCity>${data.origin.city}</OriginCity>
      <OriginState>${data.origin.province}</OriginState>
      <OriginZipcode>${data.origin.postalCode}</OriginZipcode>
      <DestinationCity>${data.destination.city}</DestinationCity>
      <DestinationState>${data.destination.province}</DestinationState>
      <DestinationZipcode>${data.destination.postalCode}</DestinationZipcode>
      <PalletCount>1</PalletCount>
      <Customer>0928961</Customer>
    </request>
  </Body>`
}
module.exports = wardPayload
