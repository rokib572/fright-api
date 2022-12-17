const request = require('supertest')
const { BASE_URL, UNIT_TEST_STUFF_USER, TEST_TIMEOUT } = require('../utils/testConstant')
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

describe('Test clients', () => {
  const client = {
    locationsId: '0c3de7d4-7105-4b95-9979-0dec04105e8a',//faker.datatype.uuid()
    clientSince: faker.date.past(10, new Date()),//'2022-03-12 10:14:40',
    paymentTerms: faker.datatype.number(100),
    credit: faker.datatype.number(1),
    creditLimit: faker.datatype.number({ min: 0, max: 10000, precision: 0.01 }),
    division: faker.address.cityName(),
    paperworkRequired: 0,
    paperworkTypes: { 
      name: faker.name.fullName(),
      age: faker.datatype.number(100)
    },
  }

  let token = ''

  beforeAll(async () => {
    token = await getToken()
  }, TEST_TIMEOUT)

  it('It should return clients', async () => {
    const response = await request(BASE_URL)
      .get('/clients')
      .set('x-auth-token', `${token}`)
    expect(response.statusCode).toBe(200)
    expect(response.body.result.length >= 1).toBe(true)
  }, TEST_TIMEOUT)

  it('Create new client', async () => {
    const response = await request(BASE_URL)
      .post('/clients')
      .send(client)
      .set('x-auth-token', `${token}`)

    expect(response.statusCode).toBe(200)
    let isOk = response.body.result == 'Data insertion successfully' || response.body.result == 'Data updated successfully'; 
    expect(isOk).toBe(true)
  }, TEST_TIMEOUT)
})
