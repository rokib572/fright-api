const wardTrackPayload = (trackingNumber, vApi) => {
  return `<Body>
    <request>
      <User>
        <UserName>${vApi.userName}</UserName>
        <Password>${vApi.password}</Password>
      </User>
      <FreightBill>${trackingNumber}</FreightBill>
      <BOPONumber></BOPONumber>
      <BOPONumberType></BOPONumberType>
      <OZip></OZip>
    </request>
  </Body>`
}

module.exports = wardTrackPayload
