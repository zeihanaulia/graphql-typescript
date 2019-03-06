import fetch from "node-fetch";

it("send invalid if link error", async () => {
  const response = await fetch(`${process.env.TEST_HOST}/confirm/123123`);
  const text = await response.text();
  expect(text).toEqual("invalid");
});
