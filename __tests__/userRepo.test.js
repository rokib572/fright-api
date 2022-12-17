const request = require('supertest')
const {
  UNIT_TEST_STUFF_USER,
  BASE_URL,
  TEST_TIMEOUT,
} = require('../utils/testConstant')
const { faker } = require('@faker-js/faker')
//facker js documentation guide
//https://fakerjs.dev/guide/

//Get token
const getToken = async () => {
  const response = await request(BASE_URL)
      .post('/staff/users/login')
      .send(UNIT_TEST_STUFF_USER)
  return response.body.token
}

//Post User Staff Test
describe('Test userStaff api', () => {
  const user = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(10),
  }

  let token = ''

  beforeAll(async () => {
      token = await getToken()
  }, TEST_TIMEOUT)

  it('It should create user staff', async () => {
    mock = jest.fn()

    const response = await request(BASE_URL)
      .post('/staff/users')
      .send(user)
      .set('x-auth-token', `${token}`)
    expect(response.statusCode).toBe(200)
  }, TEST_TIMEOUT)

  it('It should return user staff', async () => {
    const response = await request(BASE_URL)
      .get('/staff/users/97c5dbad-cca5-4459-89dd-2e8cdca90e35')
      .set('x-auth-token', `${token}`)
    expect(response.statusCode).toBe(200)
  }, TEST_TIMEOUT)
})
