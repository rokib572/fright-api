const request = require('supertest')
const {
	BASE_URL,
	UNIT_TEST_STUFF_USER,
	TEST_TIMEOUT
} = require('../utils/testConstant')
const { faker } = require('@faker-js/faker')
//facker js documentation guide
//https://fakerjs.dev/guide/

//Get token
const getToken = async () => {
	const response = await request(BASE_URL)
		.post('/staff/users/login')
		.send(UNIT_TEST_STUFF_USER)
	return response.body.token
}

describe('Test yrc api', () => {
	const payload = {
		origin: {
			city: 'Edison',
			province: 'NJ',
			postalCode: '08817',
			country: 'USA'
		},
		destination: {
			city: 'Groveport',
			province: 'OH',
			postalCode: '43125',
			country: 'USA'
		},
		pieces: [
			{
				quantity: 1,
				quantityType: 'PLT',
				totalWeight: 485,
				weightType: 'lbs',
				freightClass: '70',
				dimLength: 40,
				dimWidth: 48,
				dimHeight: 52
			},
			{
				quantity: 1,
				quantityType: 'SKD',
				totalWeight: 40,
				weightType: 'kg',
				freightClass: '55',
				dimLength: 48,
				dimWidth: 58,
				dimHeight: 60
			}
		],
		accessorials: []
	}

	let token = ''

	beforeAll(async () => {
		token = await getToken()
	}, TEST_TIMEOUT)

	it(
		'It should return yrc rate quotes',
		async () => {
			const response = await request(BASE_URL)
				.post('/test-vendors/yrc')
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
