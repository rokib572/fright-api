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

describe('Test kalculator api', () => {
	const payload = {
		convertDimsFrom: 'cm',
		convertDimsTo: 'in',
		convertWeightFrom: 'kg',
		convertWeightTo: 'lb',
		quantities: [
			{
				quantity: '10',
				dimL: '20',
				dimW: '25',
				dimH: '50',
				weight: '100'
			},
			{
				quantity: '50',
				dimL: '50',
				dimW: '60',
				dimH: '30',
				weight: '200'
			},
			{
				quantity: '12',
				dimL: '12',
				dimW: '52',
				dimH: '67',
				weight: '65'
			}
		]
	}

	let token = ''

	beforeAll(async () => {
		token = await getToken()
	}, TEST_TIMEOUT)

	it(
		'It should return kalculator result',
		async () => {
			const response = await request(BASE_URL)
				.post('/services/kalculator')
				.send(payload)
				.set('x-auth-token', `${token}`)

			expect(response.statusCode).toBe(200)
			let result = response.body?.result
			expect(typeof result == 'object').toBe(true)
		},
		TEST_TIMEOUT
	)
})
