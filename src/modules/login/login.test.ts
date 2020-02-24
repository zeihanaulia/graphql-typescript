import { request } from "graphql-request";
import { loginInvalid, emailNotConfirmed } from "./errorMessages";
import { User } from "../../entity/User";
import { createTypeormConnection } from "../../utils/createTypeormConnection";
import { Connection } from "typeorm";

const email = "zei@han.com";
const password = "123";

const loginMutation = (e: string, p: string) => `
mutation {
    login(email: "${e}", password: "${p}") {
      path
      message
    }
}
`;

const registerMutation = (e: string, p: string) => `
mutation {
  register(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

let conn : Connection;
beforeAll(async () => {
  conn = await createTypeormConnection();
})
afterAll(async () => {
  // await conn.close();
});

const login = async (e: string, p: string, errMsg: string) => {
  const response = await request(
    process.env.TEST_HOST as string,
    loginMutation(e, p)
  );

  expect(response).toEqual({
    login: [
      {
        path: "email",
        message: errMsg
      }
    ]
  });
};

describe("login", () => {
  test("test login", async () => {
    await login("bob@bob.com", "whatever", loginInvalid);
  });

  test("email not confirmed", async () => {
    await request(
      process.env.TEST_HOST as string,
      registerMutation(email, password)
    );
    await login(email, password, emailNotConfirmed);
    await User.update({ email }, { confirmed: true });
    await login(email, "password", loginInvalid);

    const response = await request(
      process.env.TEST_HOST as string,
      loginMutation(email, password)
    );
    expect(response).toEqual({ login: null });
  });
});
