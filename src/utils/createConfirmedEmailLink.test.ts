import * as Redis from "ioredis";
import fetch from "node-fetch";
import { Connection } from "typeorm";
import { createTypeormConnection } from "./createTypeormConnection";
import { User } from "../entity/User";
import { createConfirmedEmailLink } from "./createConfirmedEmailLink";

let userId = "";
let conn: Connection;
const redis = new Redis();

beforeAll(async () => {
  conn = await createTypeormConnection();
  const user = await User.create({
    email: "zei1@han.com",
    password: "asdasdasd"
  }).save();

  userId = user.id;
});

afterAll(async () => {
  await conn.close();
});

it("Make confirmation success", async () => {
  const url = await createConfirmedEmailLink(
    process.env.TEST_HOST as string,
    userId,
    redis
  );
  const response = await fetch(url);
  const text = await response.text();
  expect(text).toEqual("ok");

  const user = await User.findOne({ where: { id: userId } });
  expect((user as User).confirmed).toBeTruthy();

  const chunks = url.split("/");
  const key = chunks[chunks.length - 1];
  const value = await redis.get(key);
  expect(value).toBeNull();
});
