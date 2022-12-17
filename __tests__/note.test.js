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
//Post User Staff Test
describe('Note Repo--->', () => {
    const note = {
        notes: faker.lorem.sentence(),
    }

    let token = ''

    beforeAll(async () => {
        token = await getToken()
    }, TEST_TIMEOUT)

    //   afterAll(async () => {
    //     await request(baseURL)
    //       .delete(`/staff/users/${uId}`)
    //       .set('x-auth-token', `${token}`)
    //   })

    it(
        'Post note by contact',
        async () => {
            const response = await request(BASE_URL)
                .post('/contacts/caa9e872-e5cb-4dc4-a3be-93707dec45ba/notes')
                .send(note)
                .set('x-auth-token', `${token}`)
            // uId = response.body.result.id

            let isOk =
                response.statusCode === 200 || response.statusCode === 400
            expect(isOk).toBe(true)
        },
        TEST_TIMEOUT
    )

    it(
        'Post note by vendor',
        async () => {
            const response = await request(BASE_URL)
                .post('/vendors/f1947285-7b88-440c-ac29-e6d588cd04d8/notes')
                .send(note)
                .set('x-auth-token', `${token}`)
            let isOk =
                response.statusCode === 200 || response.statusCode === 400
            expect(isOk).toBe(true)
        },
        TEST_TIMEOUT
    )
})
