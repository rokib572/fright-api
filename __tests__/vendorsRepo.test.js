const request = require("supertest");
const {
  BASE_URL,
  UNIT_TEST_STUFF_USER,
  TEST_TIMEOUT,
} = require("../utils/testConstant");
const { faker } = require("@faker-js/faker");

//Get token
const getToken = async () => {
  const response = await request(BASE_URL)
    .post("/staff/users/login")
    .send(UNIT_TEST_STUFF_USER);
  return response.body.token;
};

describe("Test Vendors", () => {
  let token = "";

  const vendorData = {
    locationsId: "be9f6a75-8b6b-4f0d-80cf-afd9d6cefb08",
    isFactoringCompany: 1,
    requiresFactoringCompany: faker.random.numeric(),
    website: "www.mywebsite2.com",
    idFactoringCompany: faker.datatype.uuid(), //"bd28cb2f-9bdc-4fda-bfc3-e84a4821d232"
  };

  const testVenodorRate = {
    origin: {
      city: "Edison",
      province: "NJ",
      postalCode: "08817",
      country: "US",
    },
    destination: {
      city: "Groveport",
      province: "OH",
      postalCode: "43125",
      country: "US",
    },
    pieces: [
      {
        quantity: 1,
        quantityType: "PL",
        weightType: "lbs",
        totalWeight: 485,
        freightClass: "70",
        dimLength: 40,
        dimWidth: 48,
        dimHeight: 52,
      },
    ],
    accessorials: [],
  };

  beforeAll(async () => {
    token = await getToken();
  }, TEST_TIMEOUT);

  it(
    "It should get all vendors",
    async () => {
      const response = await request(BASE_URL)
        .get("/vendors")
        .set("x-auth-token", `${token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.result.length >= 1).toBe(true);
    },
    TEST_TIMEOUT
  );

  it(
    "It should post all test vendors",
    async () => {
      const response = await request(BASE_URL)
        .post("/test-vendors/all")
        .send(testVenodorRate)
        .set("x-auth-token", `${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.result.length >= 1).toBe(true);
    },
    TEST_TIMEOUT
  );

  // it('Create new vendor', async () => {
  //   const response = await request(BASE_URL)
  //     .post('/vendors')
  //     .send(vendorData)
  //     .set('x-auth-token', `${token}`)

  //   expect(response.statusCode).toBe(200)
  //   let isOk = response.body.result == 'Vendor created successfully' || response.body.result == 'Vendor updated successfully';
  //   expect(isOk).toBe(true)
  // }, TEST_TIMEOUT)
});
