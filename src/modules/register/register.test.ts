import { request } from "graphql-request";
import { User } from "../../entity/User";
import { startServer } from "../../startServer";
import {
  emailNotLongEnough,
  emailDuplicate,
  emailNotValid,
  passwordNotLongEnough
} from "./errorMessages";

let getHost = () => "";

beforeAll(async () => {
  const app = await startServer();
  const { port } = app.address();
  getHost = () => `http://127.0.0.1:${port}`;
});

const email = "zei@han.com";
const password = "123asdas";

const mutation = (e: string, p: string) => `
mutation {
  register(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

describe("Register user", async () => {
  it("create user success", async () => {
    const response = await request(getHost(), mutation(email, password));
    expect(response).toEqual({ register: null });
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
  });

  it("catch duplicate email", async () => {
    const response2: any = await request(getHost(), mutation(email, password));
    expect(response2.register).toHaveLength(1);
    expect(response2.register[0]).toEqual({
      path: "email",
      message: emailDuplicate
    });
  });

  it("catch bad email", async () => {
    const response3: any = await request(getHost(), mutation("ab", password));
    expect(response3.register).toHaveLength(2);
    expect(response3).toEqual({
      register: [
        {
          path: "email",
          message: emailNotLongEnough
        },
        {
          path: "email",
          message: emailNotValid
        }
      ]
    });
  });

  it("catch bad password", async () => {
    const response4: any = await request(getHost(), mutation(email, "1"));
    expect(response4.register).toHaveLength(1);
    expect(response4).toEqual({
      register: [
        {
          path: "password",
          message: passwordNotLongEnough
        }
      ]
    });
  });

  it("catch bad email and bad password", async () => {
    const response5: any = await request(getHost(), mutation("a", "1"));
    expect(response5.register).toHaveLength(3);
    expect(response5).toEqual({
      register: [
        {
          path: "email",
          message: emailNotLongEnough
        },
        {
          path: "email",
          message: emailNotValid
        },
        {
          path: "password",
          message: passwordNotLongEnough
        }
      ]
    });
  });
});
