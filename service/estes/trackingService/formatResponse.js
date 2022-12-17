const getFormattedAddress = (address) => {
  let formattedAddress = [];

  if (address?.line && address?.line?.length > 0) {
    formattedAddress.push(address?.line.join(', '));
  }

  if (address?.city) {
    formattedAddress.push(address?.city)
  }

  if (address?.postalCode) {
    formattedAddress.push(address?.postalCode)
  }

  if (address?.state) {
    formattedAddress.push(address?.state)
  }

  if (address?.country) {
    formattedAddress.push(address?.country)
  }

  return formattedAddress.join(', ');
}

const formatResponse = (serviceType, data) => {

  const payload = {
    serviceType: serviceType,
    proNumber: data?.pro,
    documentsAvailable: data?.documentReference ?? [],
    currentStatus: data?.status?.expandedStatus,
    pickupRequestNumber: null,
    pickupDate: data?.pickupDate,
    transitTime: data?.pickupTime,
    isExpedited: null,
    isGuaranteed: null,
    expectedDelivery: data?.deliveryDate,
    actualDelivery: data?.deliveryDate,
    shipmentHistory: [],
    shipperInfo: {
      accountNumber: data?.shipperParty?.accountNumber,
      label: data?.shipperParty?.name,
      address: getFormattedAddress(data?.shipperParty?.address),
    },
    consigneeInfo: {
      accountNumber: data?.consigneeParty?.accountNumber,
      label: data?.consigneeParty?.name,
      address: getFormattedAddress(data?.consigneeParty?.address)
    },
    thirdPartyInfo: {
      accountNumber: data?.thirdParty?.accountNumber,
      label: data?.thirdParty?.name,
      address: getFormattedAddress(data?.thirdParty?.address)
    },
    originTerminal: {
      id: data?.originTerminal?.number,
      label: data?.originTerminal?.name,
      address: getFormattedAddress(data?.originTerminal?.address),
      phone: data?.originTerminal?.telephone,
      email: data?.originTerminal?.email
    },
    destinationTerminal: {
      id: data?.destinationTerminal?.number,
      label: data?.destinationTerminal?.name,
      address: getFormattedAddress(data?.destinationTerminal?.address),
      phone: data?.destinationTerminal?.telephone,
      email: data?.destinationTerminal?.email
    },
    carrierNotes: data?.disclaimers,
    cost: data?.freightCharges
  }

  return payload;
}

module.exports = formatResponse
