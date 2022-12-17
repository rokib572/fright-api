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

describe("Test Tools", () => {
  let token = "";

  beforeAll(async () => {
    token = await getToken();
  }, TEST_TIMEOUT);

  it(
    "It should get tools",
    async () => {
      const response = await request(BASE_URL)
        .get("/tools/dot/")
        .set("x-auth-token", `${token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.result.length >= 1).toBe(true);
    },
    TEST_TIMEOUT
  );
});
