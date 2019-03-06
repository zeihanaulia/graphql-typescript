import * as Redis from "ioredis";
import fetch from "node-fetch";
import { createTypeormConnection } from "./createTypeormConnection";
import { User } from "../entity/User";
import { createConfirmedEmailLink } from "./createConfirmeEmailLink";

let userId = "";

beforeAll(async () => {
  await createTypeormConnection();
  const user = await User.create({
    email: "zei1@han.com",
    password: "asdasdasd"
  }).save();

  userId = user.id;
});

test("Make sure createConfirmedEmailLink works", async () => {
  const url = await createConfirmedEmailLink(
    process.env.TEST_HOST as string,
    userId,
    new Redis()
  );

  const response = await fetch(url);
  const text = await response.text();
  console.log(text);
});
