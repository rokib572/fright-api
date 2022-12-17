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

describe('Test Quotes', () => {
    const quotes = {
        createdBy: '0270419d-ee46-46a0-8ecc-5de499b94bc6',
    }
    const quotesRoute = {
        locationsId: faker.datatype.uuid(),
        city: faker.address.city(),
        province: faker.address.stateAbbr(),
        postalCode: faker.address.zipCode(),
        country: faker.address.countryCode(),
        movementType: faker.datatype.number(9),
    }
    const quotesEquipment = {
        equipmentTypeId: faker.datatype.number(),
    }
    const quotesPieces = {
        quantity: faker.datatype.number(),
        quantityTypeId: faker.datatype.number(),
        pieceWeight: faker.datatype.number(),
        dimLength: faker.datatype.number(),
        dimWidth: faker.datatype.number(),
        dimHeight: faker.datatype.number(),
        freightClass: faker.datatype.number(),
        nmfc: faker.random.words(),
        description: faker.lorem.sentence(),
        isHazardous: faker.datatype.boolean(),
    }
    let token = ''

    beforeAll(async () => {
        token = await getToken()
    }, TEST_TIMEOUT)

    it(
        'It should return Quotes Routes',
        async () => {
            const response = await request(BASE_URL)
                .get('/quotes/0270419d-ee46-46a0-8ecc-5de499b94bc6/routes')
                .set('x-auth-token', `${token}`)

            let isOk =
                response.statusCode === 200 ||
                response.statusCode === 404 ||
                response.statusCode === 400
            expect(isOk).toBe(true)
            // expect(response.body.result.length >= 0).toBe(true)
        },
        TEST_TIMEOUT
    )
    it(
        'It should return Quotes Equipment',
        async () => {
            const response = await request(BASE_URL)
                .get('/quotes/0270419d-ee46-46a0-8ecc-5de499b94bc6/equipment')
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
        'Create new Quotes',
        async () => {
            const response = await request(BASE_URL)
                .post('/quotes')
                .send(quotes)
                .set('x-auth-token', `${token}`)

            expect(response.statusCode).toBe(200)
            expect(typeof response.body.result == 'object').toBe(true)
        },
        TEST_TIMEOUT
    )
    it(
        'Create new Quotes Routes',
        async () => {
            const response = await request(BASE_URL)
                .post('/quotes/0270419d-ee46-46a0-8ecc-5de499b94bc6/routes')
                .send(quotesRoute)
                .set('x-auth-token', `${token}`)

            expect(response.statusCode).toBe(200)
        },
        TEST_TIMEOUT
    )
    it(
        'Create new Quotes Equipment',
        async () => {
            const response = await request(BASE_URL)
                .post('/quotes/0270419d-ee46-46a0-8ecc-5de499b94bc6/equipment')
                .send(quotesEquipment)
                .set('x-auth-token', `${token}`)

            expect(response.statusCode).toBe(200)
            expect(typeof response.body.result == 'object').toBe(true)
        },
        TEST_TIMEOUT
    )
    it(
        'Create new Quotes Pieces',
        async () => {
            const response = await request(BASE_URL)
                .post('/quotes/0270419d-ee46-46a0-8ecc-5de499b94bc6/pieces')
                .send(quotesPieces)
                .set('x-auth-token', `${token}`)

            expect(response.statusCode).toBe(200)
            expect(typeof response.body.result == 'object').toBe(true)
        },
        TEST_TIMEOUT
    )
})
