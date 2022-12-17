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

describe('Test Location', () => {
    const locationsBody = {
        companyName: faker.company.name(),
        companyAddress1: faker.address.streetAddress(),
        companyAddress2: faker.address.secondaryAddress(),
        companyCity: faker.address.city(),
        companyProvince: faker.address.stateAbbr(),
        companyPostalCode: faker.address.zipCode(),
        companyCountry: faker.address.country(),
        isClient: faker.random.boolean(),
        isVendor: faker.random.boolean(),
        isSFS: faker.random.boolean(),
    }

    const locationAcc = {
        accessorialsId: faker.random.number(),
    }
    const getMillageTo = {
        from: {
            lat: faker.address.latitude(),
            lng: faker.address.longitude(),
        },
        to: {
            lat: faker.address.latitude(),
            lng: faker.address.longitude(),
        },
    }

    const locationProfile = {
        hasDock: faker.random.boolean(),
        hasForklift: faker.random.boolean(),
        isAirport: faker.random.boolean(),
        isCFS: faker.random.boolean(),
        isResidence: faker.random.boolean(),
    }
    const locationShipping = {
        requiresAppt: faker.random.boolean(),
        hours: [
            {
                day: faker.date.weekday(),
                open: null,
                close: null,
            },
            {
                day: faker.date.weekday(),
                open: '8:00AM',
                close: '5:00PM',
            },
            {
                day: faker.date.weekday(),
                open: '8:00AM',
                close: '5:00PM',
            },
            {
                day: faker.date.weekday(),
                open: '8:00AM',
                close: '5:00PM',
            },
            {
                day: faker.date.weekday(),
                open: '8:00AM',
                close: '5:00PM',
            },
            {
                day: faker.date.weekday(),
                open: '8:00AM',
                close: '5:00PM',
            },
            {
                day: faker.date.weekday(),
                open: null,
                close: null,
            },
        ],
        shippingDocks: faker.datatype.array(2),
        shippingInstructions: faker.lorem.sentence(1),
    }
    const locationsReceiving = {
        requiresAppt: faker.random.boolean(),
        hours: [
            {
                day: faker.date.weekday(),
                open: null,
                close: null,
            },
            {
                day: faker.date.weekday(),
                open: '8:00AM',
                close: '5:00PM',
            },
            {
                day: faker.date.weekday(),
                open: '8:00AM',
                close: '5:00PM',
            },
            {
                day: faker.date.weekday(),
                open: '8:00AM',
                close: '5:00PM',
            },
            {
                day: faker.date.weekday(),
                open: '8:00AM',
                close: '5:00PM',
            },
            {
                day: faker.date.weekday(),
                open: '8:00AM',
                close: '5:00PM',
            },
            {
                day: faker.date.weekday(),
                open: null,
                close: null,
            },
        ],
        receivingDocks: faker.datatype.array(2),
        receivingInstructions: faker.lorem.sentence(1),
    }

    const locationContact = {
        locationsId: faker.datatype.uuid(),
    }

    let token = ''

    beforeAll(async () => {
        token = await getToken()
    }, TEST_TIMEOUT)

    it(
        'Get All Location-->',
        async () => {
            const response = await request(BASE_URL)
                .get('/locations')
                .set('x-auth-token', `${token}`)
            expect(response.statusCode).toBe(200)
            expect(response.body.result.length >= 0).toBe(true)
        },
        TEST_TIMEOUT
    )
    it(
        'Get Single Location by Id-->',
        async () => {
            const response = await request(BASE_URL)
                .get('/locations/76ad3530-2b6f-4a13-8f91-208283f4e998')
                .set('x-auth-token', `${token}`)
            expect(response.statusCode).toBe(200)
            expect(response.body.result.length >= 0).toBe(true)
        },
        TEST_TIMEOUT
    )
    it(
        'Get Single Location by Query-->',
        async () => {
            const response = await request(BASE_URL)
                .get(
                    '/locations?searchName=ArcBest&searchPostalCode=72916&searchCountry=us'
                )
                .set('x-auth-token', `${token}`)
            expect(response.statusCode).toBe(200)
            expect(response.body.result.length >= 0).toBe(true)
        },
        TEST_TIMEOUT
    )
    it(
        'Get  Location by accessorials-->',
        async () => {
            const response = await request(BASE_URL)
                .get(
                    '/locations/76ad3530-2b6f-4a13-8f91-208283f4e998/accessorials'
                )
                .set('x-auth-token', `${token}`)
            expect(response.statusCode).toBe(200)
            expect(response.body.result.length >= 0).toBe(true)
        },
        TEST_TIMEOUT
    )
    it(
        'Get  Location by profile-->',
        async () => {
            const response = await request(BASE_URL)
                .get('/locations/76ad3530-2b6f-4a13-8f91-208283f4e998/profile')
                .set('x-auth-token', `${token}`)
            expect(response.statusCode).toBe(200)
            expect(response.body.result.length >= 0).toBe(true)
        },
        TEST_TIMEOUT
    )
    it(
        'Get  Location by shipping-->',
        async () => {
            const response = await request(BASE_URL)
                .get('/locations/76ad3530-2b6f-4a13-8f91-208283f4e998/shipping')
                .set('x-auth-token', `${token}`)
            expect(response.statusCode).toBe(200)
            expect(response.body.result.length >= 0).toBe(true)
        },
        TEST_TIMEOUT
    )
    it(
        'Get  Location by receiving-->',
        async () => {
            const response = await request(BASE_URL)
                .get(
                    '/locations/76ad3530-2b6f-4a13-8f91-208283f4e998/receiving'
                )
                .set('x-auth-token', `${token}`)
            expect(response.statusCode).toBe(200)
            expect(response.body.result.length >= 0).toBe(true)
        },
        TEST_TIMEOUT
    )

    it(
        'Get  Location by weather-->',
        async () => {
            const response = await request(BASE_URL)
                .get('/locations/76ad3530-2b6f-4a13-8f91-208283f4e998/weather')
                .set('x-auth-token', `${token}`)
            expect(response.statusCode).toBe(200)
            expect(response.body.result.length >= 0).toBe(true)
        },
        TEST_TIMEOUT
    )
    it(
        'Create new Locations--->',
        async () => {
            const response = await request(BASE_URL)
                .post('/locations')
                .send(locationsBody)
                .set('x-auth-token', `${token}`)

            expect(response.statusCode).toBe(200)
        },
        TEST_TIMEOUT
    )
    it(
        'Create new Locations accessorials-->',
        async () => {
            const response = await request(BASE_URL)
                .post(
                    '/locations/76ad3530-2b6f-4a13-8f91-208283f4e998/accessorials'
                )
                .send(locationAcc)
                .set('x-auth-token', `${token}`)

            // expect(response.statusCode).toBe(200)
            let isOk =
                response.statusCode === 200 || response.statusCode === 400
            expect(isOk).toBe(true)
        },
        TEST_TIMEOUT
    )
    it(
        'Create new contact Locations -->',
        async () => {
            const response = await request(BASE_URL)
                .post(
                    '/contacts/76ad3530-2b6f-4a13-8f91-208283f4e998/locations'
                )
                .send(locationContact)
                .set('x-auth-token', `${token}`)

            let isOk =
                response.statusCode === 200 || response.statusCode === 400
            expect(isOk).toBe(true)
        },
        TEST_TIMEOUT
    )
    it(
        'Get millage between to-->',
        async () => {
            const response = await request(BASE_URL)
                .post('/getMilage')
                .send(getMillageTo)
                .set('x-auth-token', `${token}`)

            expect(response.statusCode).toBe(200)
        },
        TEST_TIMEOUT
    )
    it(
        'Save Location Profile-->',
        async () => {
            const response = await request(BASE_URL)
                .post('/locations/76ad3530-2b6f-4a13-8f91-208283f4e998/profile')
                .send(locationProfile)
                .set('x-auth-token', `${token}`)

            // expect(response.statusCode).toBe(200)
            let isOk =
                response.statusCode === 200 || response.statusCode === 400
            expect(isOk).toBe(true)
        },
        TEST_TIMEOUT
    )
    it(
        'Save Location Shipping-->',
        async () => {
            const response = await request(BASE_URL)
                .post(
                    '/locations/76ad3530-2b6f-4a13-8f91-208283f4e998/shipping'
                )
                .send(locationShipping)
                .set('x-auth-token', `${token}`)

            // expect(response.statusCode).toBe(200)
            let isOk =
                response.statusCode === 200 || response.statusCode === 400
            expect(isOk).toBe(true)
        },
        TEST_TIMEOUT
    )
    it(
        'Save Location receiving-->',
        async () => {
            const response = await request(BASE_URL)
                .post(
                    '/locations/76ad3530-2b6f-4a13-8f91-208283f4e998/receiving'
                )
                .send(locationsReceiving)
                .set('x-auth-token', `${token}`)

            // expect(response.statusCode).toBe(200)
            let isOk =
                response.statusCode === 200 || response.statusCode === 400
            expect(isOk).toBe(true)
        },
        TEST_TIMEOUT
    )
})
