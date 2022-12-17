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

describe('Test arcbest api', () => {
	const payload = {
		origin: {
			city: 'DALLAS',
			province: 'TX',
			postalCode: '75247',
			country: 'US'
		},
		destination: {
			city: 'TULSA',
			province: 'OK',
			postalCode: '74104',
			country: 'US'
		},
		pieces: [
			{
				quantity: 10,
				quantityType: 'BX',
				weightType: 'KG',
				totalWeight: 100,
				freightClass: '50',
				dimLength: 12,
				dimWidth: 12,
				dimHeight: 48
			}
		],
		accessorials: []
	}

	const trackingPayload = {
		trackingNumber: '133679814'
	}

	const documentPayload = {
		trackingNumber: '133679814',
		docType: 'bol'
	}

	let token = ''

	beforeAll(async () => {
		token = await getToken()
	}, TEST_TIMEOUT)

	it(
		'It should return arcbest rate quotes',
		async () => {
			const response = await request(BASE_URL)
				.post('/test-vendors/arcbest')
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
		'It should return arcbest tracking',
		async () => {
			const response = await request(BASE_URL)
				.post('/test-vendors/arcbest/tracking')
				.send(trackingPayload)
				.set('x-auth-token', `${token}`)

			expect(response.statusCode).toBe(200)
			let result = response.body?.result
			expect(typeof result == 'object').toBe(true)
		},
		TEST_TIMEOUT
	)

	it(
		'It should return arcbest document',
		async () => {
			const response = await request(BASE_URL)
				.post('/test-vendors/arcbest/document')
				.send(documentPayload)
				.set('x-auth-token', `${token}`)

			expect(response.statusCode).toBe(200)
			let result = response.body?.result
			expect(typeof result == 'string').toBe(true)
		},
		TEST_TIMEOUT
	)
})
