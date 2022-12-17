const request = require('supertest')

const {
    UNIT_TEST_STUFF_USER,
    BASE_URL,
    TEST_TIMEOUT,
} = require('../utils/testConstant')

//Get token
const getToken = async () => {
    const response = await request(BASE_URL)
        .post('/staff/users/login')
        .send(UNIT_TEST_STUFF_USER)
    return response.body.token
}

describe('Test catalogPort', () => {
    let token = ''

    beforeAll(async () => {
        token = await getToken()
    }, TEST_TIMEOUT)

    it(
        'It should return catalog Port by Id',
        async () => {
            const response = await request(BASE_URL)
                .get('/catalog/ports/1')
                .set('x-auth-token', `${token}`)
            expect(response.statusCode).toBe(200)
            expect(response.body.result.length >= 0).toBe(true)
        },
        TEST_TIMEOUT
    )
    it(
        'It should return catalog Port by query params',
        async () => {
            const response = await request(BASE_URL)
                .get('/catalog/ports?country=us')
                .set('x-auth-token', `${token}`)
            expect(response.statusCode).toBe(200)
            expect(response.body.result.length >= 0).toBe(true)
        },
        TEST_TIMEOUT
    )
})
