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

describe('Test new penn api', () => {
	const payload = {
		origin: {
			postalCode: '08817',
			province: 'NJ',
			city: 'Edison',
			country: 'US'
		},
		destination: {
			postalCode: '10962',
			province: 'NY',
			city: 'Orangeburg',
			country: 'US'
		},
		pieces: [
			{
				quantity: '3',
				quantityType: 'PLT',
				weightType: 'LBS',
				totalWeight: '600',
				freightClass: '250',
				dimLength: '20',
				dimWidth: '40',
				dimHeight: '50'
			}
		]
	}

	let token = ''

	beforeAll(async () => {
		token = await getToken()
	}, TEST_TIMEOUT)

	it(
		'It should return new penn rate quotes',
		async () => {
			const response = await request(BASE_URL)
				.post('/test-vendors/newpenn')
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
