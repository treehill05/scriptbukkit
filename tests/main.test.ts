import { ScriptBukkit } from "../src";

const bukkit = new ScriptBukkit({
  jarPath: "./server/paper.jar",
});

beforeAll(async () => {
  await bukkit.init();
  await new Promise((resolve) => setTimeout(resolve, 3000));
}, 1000000);

afterAll(() => {
  bukkit.stop();
});

test("test if command responds back properly", async () => {
  let res = await bukkit.command("say Hello, world!");
  expect(res).toBe("[Not Secure] [Server] Hello, world!");
});
