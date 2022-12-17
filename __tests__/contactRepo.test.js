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

describe('Test Contacts', () => {
    const contact = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number('501-###-###'),
        locations: ['975c16b3-1f16-4e29-b30b-744057038aaf'],
    }
    let token = ''

    beforeAll(async () => {
        console.log('contact', contact)
        token = await getToken()
    }, TEST_TIMEOUT)

    // it('It should create contact', async () => {
    //   const response = await request(BASE_URL)
    //     .post('/contacts')
    //     .send(contact)
    //     .set('x-auth-token', `${token}`)
    //   expect(response.statusCode).toBe(200)
    // }, TEST_TIMEOUT)

    it(
        'It should return contacts by id',
        async () => {
            const response = await request(BASE_URL)
                .get('/contacts/e855e36a-dfd2-49cf-98ff-17e6c1b1203b')
                .set('x-auth-token', `${token}`)
            expect(response.statusCode).toBe(200)
            //console.log('body', response.body);
            expect(typeof response.body.result == 'object').toBe(true)
        },
        TEST_TIMEOUT
    )
})
