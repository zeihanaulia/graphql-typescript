import axios from "axios";
import { Connection } from "typeorm";
import { createTypeormConnection } from "../../utils/createTypeormConnection";
import { User } from "../../entity/User";

let conn: Connection;
const email = "zei1@me.com";
const password = "asdasdasd";
beforeAll(async () => {
  conn = await createTypeormConnection();
  await User.create({
    email: email,
    password: password,
    confirmed: true
  }).save();
});
afterAll(async () => {
  await conn.close();
});

const loginMutation = (e: string, p: string) => `
mutation {
    login(email: "${e}", password: "${p}") {
      path
      message
    }
}
`;

const meQuery = `
mutation {
    me {
      id
      email
    }
}
`;

describe("me", () => {
  test("can't get user if not logged in", () => {});
  test("get current user", async () => {
    await axios.post(
      process.env.TEST_HOST as string,
      {
        query: loginMutation(email, password)
      },
      {
        withCredentials: true
      }
    );

    const response = await axios.post(
      process.env.TEST_HOST as string,
      {
        query: meQuery
      },
      {
        withCredentials: true
      }
    );
    console.log(response);
  });
});
