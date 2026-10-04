import test from "node:test";
import assert from "node:assert/strict";
import { AiLimiter } from "./limiter";
test("persistent global budget reserves once per minute and caps UTC day", async () => {
  const values = new Map();
  const tx = {
    get: async (k: string) => values.get(k),
    put: async (k: string, v: number) => {
      values.set(k, v);
    },
  };
  const state = {
    storage: {
      ...tx,
      transaction: async <T>(cb: (t: typeof tx) => Promise<T>) => cb(tx),
    },
  };
  const limiter = new AiLimiter(state);
  const request = () =>
    new Request("https://limiter/reserve", { method: "POST" });
  assert.equal((await limiter.fetch(request())).status, 200);
  assert.equal((await limiter.fetch(request())).status, 429);
  values.set("last", 0);
  values.set("count", 20);
  assert.equal((await limiter.fetch(request())).status, 429);
  values.set("day", Math.floor(Date.now() / 86400000) - 1);
  assert.equal((await limiter.fetch(request())).status, 200);
});
