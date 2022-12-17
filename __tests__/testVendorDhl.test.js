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

describe('Test dhl api', () => {
	const payload = {
		origin: {
			city: 'Prague',
			province: 'Prague',
			postalCode: '14800',
			country: 'CZ'
		},
		destination: {
			city: 'Los Angeles',
			province: 'CA',
			postalCode: '90011',
			country: 'US'
		},
		pieces: [
			{
				quantity: '1',
				quantityType: 'LB',
				weightType: 'KG',
				totalWeight: '5',
				freightClass: '500',
				dimLength: 10.5,
				dimWidth: 5.9,
				dimHeight: 5.9
			}
		],
		accessorials: ['ABCD']
	}

	let token = ''

	beforeAll(async () => {
		token = await getToken()
	}, TEST_TIMEOUT)

	it(
		'It should return dhl rate quotes',
		async () => {
			const response = await request(BASE_URL)
				.post('/test-vendors/dhl')
				.send(payload)
				.set('x-auth-token', `${token}`)

			expect(response.statusCode).toBe(200)
			let result = response.body?.result
			expect(result?.length > 0).toBe(true)
			expect(!isNaN(result[0].totalRate)).toBe(true)
		},
		TEST_TIMEOUT
	)
})
