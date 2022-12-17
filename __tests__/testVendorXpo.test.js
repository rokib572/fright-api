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

describe('Test xpo api', () => {
	const payload = {
		origin: {
			city: 'Florida',
			province: 'FL',
			postalCode: '34608',
			country: 'US'
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
				quantityType: null,
				weightType: 'LBS',
				totalWeight: '2',
				freightClass: '70',
				dimLength: 10,
				dimWidth: 25,
				dimHeight: 20
			},
			{
				quantity: '2',
				quantityType: null,
				weightType: 'KG',
				totalWeight: '234',
				freightClass: '70',
				dimLength: 10,
				dimWidth: 25,
				dimHeight: 20
			}
		],
		accessorials: []
	}

	let token = ''

	beforeAll(async () => {
		token = await getToken()
	}, TEST_TIMEOUT)

	it(
		'It should return xpo rate quotes',
		async () => {
			const response = await request(BASE_URL)
				.post('/test-vendors/xpo')
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
