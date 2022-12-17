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

describe('Test All Tracking', () => {
    const trackingBody = {
        vendorsId: '0e92d6d0-c9c0-4949-94c2-fa88aae8153a',
        trackingNumber: 7321,
    }
    let token = ''

    beforeAll(async () => {
        token = await getToken()
    }, TEST_TIMEOUT)

    it(
        'It should return Tracking By VendorsId',
        async () => {
            const response = await request(BASE_URL)
                .get(
                    '/tracking/1161a066-e733-48dc-8e9c-476bd3c416e3/0431928154'
                )
                .set('x-auth-token', `${token}`)
            expect(response.statusCode).toBe(200)
            expect(response.body.result.length >= 0).toBe(true)
        },
        TEST_TIMEOUT
    )
    it(
        'Return All Tracking',
        async () => {
            const response = await request(BASE_URL)
                .post('/tracking')
                .send(trackingBody)
                .set('x-auth-token', `${token}`)

            expect(response.statusCode).toBe(200)
            expect(response.body.result.length >= 0).toBe(true)
        },
        TEST_TIMEOUT
    )
})
