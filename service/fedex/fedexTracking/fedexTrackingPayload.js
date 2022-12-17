const fedexTrackingPayload = (trackingNumber) => {
    let payload = {
        masterTrackingNumberInfo: {
            trackingNumberInfo: {
                trackingNumber: trackingNumber,
            },
        },
        associatedType: 'STANDARD_MPS',
    }
    return payload
}

module.exports = { fedexTrackingPayload }
