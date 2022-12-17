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

describe('Test jp express api', () => {
	const payload = {
		origin: {
			city: null,
			province: null,
			postalCode: '90746',
			country: 'US'
		},
		destination: {
			city: null,
			province: null,
			postalCode: '48154',
			country: 'US'
		},
		pieces: [
			{
				quantity: '1',
				quantityType: null,
				weightType: 'LBS',
				totalWeight: '5',
				freightClass: '50',
				dimLength: 10.5,
				dimWidth: 5.9,
				dimHeight: 5.9
			},
			{
				quantity: '2',
				quantityType: null,
				weightType: 'KG',
				totalWeight: '2',
				freightClass: '0500',
				dimLength: 10.5,
				dimWidth: 5.9,
				dimHeight: 5.9
			}
		],
		accessorials: []
	}

	let token = ''

	beforeAll(async () => {
		token = await getToken()
	}, TEST_TIMEOUT)

	it(
		'It should return jp express rate quotes',
		async () => {
			const response = await request(BASE_URL)
				.post('/test-vendors/jpexpress')
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
