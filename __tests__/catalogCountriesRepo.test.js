const request = require('supertest')
const { UNIT_TEST_STUFF_USER, BASE_URL, TEST_TIMEOUT } = require('../utils/testConstant')

//Get token
const getToken = async () => {
  const response = await request(BASE_URL)
    .post('/staff/users/login')
    .send(UNIT_TEST_STUFF_USER)
  return response.body.token
}

describe('Test catelogCountry', () => {
  let token = ''

  beforeAll(async () => {
    token = await getToken()
  }, TEST_TIMEOUT)

  it('It should return catelog countries', async () => {
    const response = await request(BASE_URL)
      .get('/catalog/countries')
      .set('x-auth-token', `${token}`)
    expect(response.statusCode).toBe(200)
    expect(response.body.result.length >= 0).toBe(true)
  }, TEST_TIMEOUT)

  it('It should return catelog country by Alpha2', async () => {
    const response = await request(BASE_URL)
      .get('/catalog/countries/al')
      .set('x-auth-token', `${token}`)
    expect(response.statusCode).toBe(200)
    expect(typeof response.body.result == 'object').toBe(true)
  }, TEST_TIMEOUT)

  it('It should return catelog city by country code', async () => {
    const response = await request(BASE_URL)
      .get('/catalog/countries/us/cities')
      .set('x-auth-token', `${token}`)
    expect(response.statusCode).toBe(200)
    expect(response.body.result.length >= 0).toBe(true)
  }, TEST_TIMEOUT)
})
