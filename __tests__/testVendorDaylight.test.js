const request = require('supertest')
const {
	BASE_URL,
	UNIT_TEST_STUFF_USER,
	TEST_TIMEOUT
} = require('../utils/testConstant')

//Get token
const getToken = async () => {
	const response = await request(BASE_URL)
		.post('/staff/users/login')
		.send(UNIT_TEST_STUFF_USER)
	return response.body.token
}

describe('Test daylight api', () => {
	const payload = {
		origin: {
			postalCode: '90746',
			province: 'CA',
			city: 'Los Angeles',
			country: 'US'
		},
		destination: {
			postalCode: '48154',
			province: 'CA',
			city: 'Los Angeles',
			country: 'US'
		},
		pieces: [
			{
				quantity: '3',
				quantityType: null,
				weightType: 'LBS',
				totalWeight: '264.55',
				freightClass: '70',
				dimLength: '22',
				dimWidth: '43',
				dimHeight: '50'
			}
		],
		accessorials: ['COMPLIANCE SERVICES FEE']
	}

	const trackingPayload = {
		trackingNumber: '73218224'
	}

	const documentPayload = {
		trackingNumber: '73218224',
		docType: 'bol'
	}

	let token = ''

	beforeAll(async () => {
		token = await getToken()
	}, TEST_TIMEOUT)

	it(
		'It should return daylight rate quotes',
		async () => {
			const response = await request(BASE_URL)
				.post('/test-vendors/daylight')
				.send(payload)
				.set('x-auth-token', `${token}`)

			expect(response.statusCode).toBe(200)
			let result = response.body?.result
			expect(result?.length > 0).toBe(true)
			expect(!isNaN(result[0].totalRate)).toBe(true)
		},
		TEST_TIMEOUT
	)

	it(
		'It should return daylight tracking',
		async () => {
			const response = await request(BASE_URL)
				.post('/test-vendors/daylight/tracking')
				.send(trackingPayload)
				.set('x-auth-token', `${token}`)

			expect(response.statusCode).toBe(200)
			let result = response.body?.result
			expect(typeof result == 'object').toBe(true)
		},
		TEST_TIMEOUT
	)

	it(
		'It should return daylight document',
		async () => {
			const response = await request(BASE_URL)
				.post('/test-vendors/daylight/document')
				.send(documentPayload)
				.set('x-auth-token', `${token}`)

			expect(response.statusCode).toBe(200)
			let result = response.body?.result
			expect(typeof result == 'string').toBe(true)
		},
		TEST_TIMEOUT
	)
})
