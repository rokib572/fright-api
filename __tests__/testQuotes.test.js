const request = require('supertest')
const {
    BASE_URL,
    UNIT_TEST_STUFF_USER,
    TEST_TIMEOUT,
} = require('../utils/testConstant')
const { faker } = require('@faker-js/faker')

//Get token
const getToken = async () => {
    const response = await request(BASE_URL)
        .post('/staff/users/login')
        .send(UNIT_TEST_STUFF_USER)
    return response.body.token
}

describe('Test Quotes', () => {
    let token = ''
    let quotesId = '0270419d-ee46-46a0-8ecc-5de499b94bc6'
    let quotesNumber = 'e4a17d86-00c7-4454-b24e-85622c580a20'
    const quotesData = {
        createdBy: '0270419d-ee46-46a0-8ecc-5de499b94bc6',
        requestedBy: '0270419d-ee46-46a0-8ecc-5de499b94bc6',
    }

    const quotesRoutes = {
        locationsId: 'fcd03773-d22c-4e40-a60c-c0421f91c4c6',
        quotesId: '0270419d-ee46-46a0-8ecc-5de499b94bc6',
        city: faker.address.cityName(),
        province: faker.address.cityName(),
        postalCode: faker.address.zipCode(),
        country: 'US',
        movementType: 2,
    }

    const quotesEquipment = {
        equipmentTypeId: 3,
    }

    const quotesPieces = {
        quantity: faker.random.numeric(),
        quantityTypeId: faker.random.numeric(),
        pieceWeight: faker.random.numeric(),
        dimLength: faker.random.numeric(),
        dimWidth: faker.random.numeric(),
        dimHeight: faker.random.numeric(),
        freightClass: faker.random.numeric(),
        nmfc: faker.random.word(),
        description: faker.random.words(),
        isHazardous: faker.random.numeric(),
    }

    beforeAll(async () => {
        token = await getToken()
    }, TEST_TIMEOUT)

    it(
        'It should get quotes routes',
        async () => {
            const response = await request(BASE_URL)
                .get('/quotes/' + quotesId + '/routes')
                .set('x-auth-token', `${token}`)
            expect(response.statusCode).toBe(200)
            expect(response.body.result.length >= 1).toBe(true)
        },
        TEST_TIMEOUT
    )

    it(
        'It should get quotes equipment',
        async () => {
            const response = await request(BASE_URL)
                .get('/quotes/' + quotesId + '/equipment')
                .set('x-auth-token', `${token}`)
            expect(response.statusCode).toBe(200)
            expect(response.body.result.length >= 1).toBe(true)
        },
        TEST_TIMEOUT
    )

    it(
        'Create new quotes',
        async () => {
            const response = await request(BASE_URL)
                .post('/quotes')
                .send(quotesData)
                .set('x-auth-token', `${token}`)

            expect(response.statusCode).toBe(200)
            expect('Quotes saved successfully')
        },
        TEST_TIMEOUT
    )

    it(
        'Create quotes routes',
        async () => {
            const response = await request(BASE_URL)
                .post('/quotes/' + quotesNumber + '/routes')
                .send(quotesRoutes)
                .set('x-auth-token', `${token}`)

            expect(response.statusCode).toBe(200)
            expect('Quote routes save successfully')
        },
        TEST_TIMEOUT
    )

    it(
        'Create quotes equipment',
        async () => {
            const response = await request(BASE_URL)
                .post('/quotes/' + quotesNumber + '/equipment')
                .send(quotesEquipment)
                .set('x-auth-token', `${token}`)

            expect(response.statusCode).toBe(200)
            expect('Quotes equipment saved successfully')
        },
        TEST_TIMEOUT
    )

    it(
        'Create quotes pieces',
        async () => {
            const response = await request(BASE_URL)
                .post('/quotes/' + quotesNumber + '/pieces')
                .send(quotesPieces)
                .set('x-auth-token', `${token}`)

            expect(response.statusCode).toBe(200)
            expect('Quotes pieces saved successfully')
        },
        TEST_TIMEOUT
    )
})
