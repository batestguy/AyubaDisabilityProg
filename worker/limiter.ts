// Global, persistent free-budget reservation. No IPs, identities or prompts are stored.
export class AiLimiter {
  constructor(
    private state: {
      storage: {
        get: (k: string) => Promise<number | undefined>;
        put: (k: string, v: number) => Promise<void>;
        transaction: <T>(cb: (tx: any) => Promise<T>) => Promise<T>;
      };
    },
  ) {}
  async fetch(request: Request) {
    if (request.method !== "POST")
      return new Response("POST required", { status: 405 });
    const now = Date.now();
    const day = Math.floor(now / 86400000);
    const allowed = await this.state.storage.transaction(async (tx) => {
      const last = (await tx.get("last")) || 0;
      const recordedDay = await tx.get("day");
      const count = recordedDay === day ? (await tx.get("count")) || 0 : 0;
      if (now - last < 60000 || count >= 20) return false;
      await tx.put("last", now);
      await tx.put("day", day);
      await tx.put("count", count + 1);
      return true;
    });
    return new Response(allowed ? "Reserved" : "Quota paused", {
      status: allowed ? 200 : 429,
    });
  }
}
export default {
  fetch() {
    return new Response("Internal quota worker", { status: 404 });
  },
};
