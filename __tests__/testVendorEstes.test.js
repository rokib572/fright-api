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

describe('Test estes api', () => {
	const payload = {
		origin: {
			city: 'Edison',
			province: 'NJ',
			postalCode: '08817',
			country: 'US'
		},
		destination: {
			city: 'Groveport',
			province: 'OH',
			postalCode: '43125',
			country: 'US'
		},
		pieces: [
			{
				quantity: 1,
				quantityType: 'PL',
				weightType: 'lbs',
				totalWeight: 485,
				freightClass: '70',
				dimLength: 40,
				dimWidth: 48,
				dimHeight: 52
			}
		],
		accessorials: []
	}

	const trackingPayload = {
		requestID: '0431928154'
	}

	const documentPayload = {
		trackingNumber: '176-0555536',
		docType: 'DR'
	}

	let token = ''

	beforeAll(async () => {
		token = await getToken()
	}, TEST_TIMEOUT)

	it(
		'It should return estes rate quotes',
		async () => {
			const response = await request(BASE_URL)
				.post('/test-vendors/estes')
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
		'It should return estes tracking info',
		async () => {
			const response = await request(BASE_URL)
				.post('/test-vendors/estes/tracking')
				.send(trackingPayload)
				.set('x-auth-token', `${token}`)

			expect(response.statusCode).toBe(200)
			let result = response.body?.result
			expect(typeof result == 'object').toBe(true)
		},
		TEST_TIMEOUT
	)

	it(
		'It should return estes document of tracking',
		async () => {
			const response = await request(BASE_URL)
				.post('/test-vendors/estes/document')
				.send(documentPayload)
				.set('x-auth-token', `${token}`)

			expect(response.statusCode).toBe(200)
			let result = response.body?.result
			expect(typeof result == 'object').toBe(true)
		},
		TEST_TIMEOUT
	)
})
