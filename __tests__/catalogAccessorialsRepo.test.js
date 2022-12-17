const request = require('supertest')
const { faker } = require('@faker-js/faker')
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

describe('Test catelogAccessorials', () => {
    const accessorials = {
        accessorial: 'test',
    }
    let token = ''

    beforeAll(async () => {
        token = await getToken()
    }, TEST_TIMEOUT)

    it(
        'It should return catelog Accessorials',
        async () => {
            const response = await request(BASE_URL)
                .get('/catalog/accessorials')
                .set('x-auth-token', `${token}`)
            expect(response.statusCode).toBe(200)
            expect(response.body.result.length >= 0).toBe(true)
        },
        TEST_TIMEOUT
    )
    it(
        'Create new Accessorials',
        async () => {
            const response = await request(BASE_URL)
                .post('/catalog/accessorials')
                .send(accessorials)
                .set('x-auth-token', `${token}`)

            expect(response.statusCode).toBe(200)
            let isOk =
                response.body.result ==
                    'Catalog Accessorial insertion successfully' ||
                response.body.result == 'Data insert successfully'
            expect(isOk).toBe(true)
        },
        TEST_TIMEOUT
    )
})
