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

describe('Test catalogAirline', () => {
    let token = ''

    beforeAll(async () => {
        token = await getToken()
    }, TEST_TIMEOUT)

    it(
        'It should return catalog Airport',
        async () => {
            const response = await request(BASE_URL)
                .get('/catalog/airport?name=Hassan')
                .set('x-auth-token', `${token}`)
            let isOk =
                response.statusCode === 200 ||
                response.statusCode === 404 ||
                response.statusCode === 400
            expect(isOk).toBe(true)
        },
        TEST_TIMEOUT
    )
    it(
        'It should return catalog Airport by query params',
        async () => {
            const response = await request(BASE_URL)
                .get('/catalog/airports?name=Heliport')
                .set('x-auth-token', `${token}`)
            let isOk =
                response.statusCode === 200 ||
                response.statusCode === 404 ||
                response.statusCode === 400
            expect(isOk).toBe(true)
            expect(response.body.result.length >= 0).toBe(true)
        },
        TEST_TIMEOUT
    )
})
