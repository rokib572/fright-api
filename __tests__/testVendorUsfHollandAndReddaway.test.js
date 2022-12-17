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

describe('Test usf holland and reddaway api', () => {
	const payload = {
		origin: {
			city: 'Groveport',
			province: 'OH',
			postalCode: '43125',
			country: 'US'
		},
		destination: {
			city: 'Chicago',
			province: 'IL',
			postalCode: '60612',
			country: 'US'
		},
		pieces: [
			{
				quantity: 10,
				quantityType: 'BAG',
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

	const reddawayPayload = {
		origin: {
			city: 'Los Angeles',
			province: 'CA',
			postalCode: '90023',
			country: 'US'
		},
		destination: {
			city: 'Portland ',
			province: 'OR',
			postalCode: '97209',
			country: 'US'
		},
		pieces: [
			{
				quantity: 10,
				quantityType: 'BAG',
				weightType: 'KG',
				totalWeight: 100,
				freightClass: '50',
				dimLength: 12,
				dimWidth: 12,
				dimHeight: 48
			},
			{
				quantity: 10,
				quantityType: 'BAG',
				weightType: 'KG',
				totalWeight: 100,
				freightClass: '50',
				dimLength: 12,
				dimWidth: 12,
				dimHeight: 48
			},
			{
				quantity: 10,
				quantityType: 'BAG',
				weightType: 'KG',
				totalWeight: 100,
				freightClass: '50',
				dimLength: 12,
				dimWidth: 12,
				dimHeight: 48
			},
			{
				quantity: 10,
				quantityType: 'BAG',
				weightType: 'KG',
				totalWeight: 100,
				freightClass: '50',
				dimLength: 12,
				dimWidth: 12,
				dimHeight: 48
			},
			{
				quantity: 10,
				quantityType: 'BAG',
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

	let token = ''

	beforeAll(async () => {
		token = await getToken()
	}, TEST_TIMEOUT)

	it(
		'It should return usf holland rate quotes',
		async () => {
			const response = await request(BASE_URL)
				.post('/test-vendors/holland')
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
		'It should return usf reddaway rate quotes',
		async () => {
			const response = await request(BASE_URL)
				.post('/test-vendors/reddaway')
				.send(reddawayPayload)
				.set('x-auth-token', `${token}`)

			expect(response.statusCode).toBe(200)
			let result = response.body?.result
			expect(result?.length > 0).toBe(true)
			expect(!isNaN(result[0].totalRate)).toBe(true)
		},
		TEST_TIMEOUT
	)
})
