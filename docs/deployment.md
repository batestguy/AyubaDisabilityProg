# Cloudflare free-service deployment

Continuation note (4 October 2026): the latest accepted implementation scope is local delivery, and the next user task is appearance modification. This is a deferred deployment runbook; its historical publishing instructions do not themselves request a deployment in the next session. See [SESSION-HANDOFF.md](../SESSION-HANDOFF.md).

Status: local build ready. Public deployment is not verified. On 4 October 2026, `wrangler whoami` reported the saved token expired and could not refresh in this non-interactive session.

All publishing below is within the requested public showcase scope. Use a Cloudflare **Free** account and Groq **Free** account. Do not upgrade plans.

1. From an interactive project terminal, run `npx.cmd wrangler login`. Credentials stay in Wrangler's external user config. Do not copy credentials to this project.
2. Run `npx.cmd wrangler whoami` and `npx.cmd wrangler pages project list`. If `ncpwd-impact-mosaic` does not exist, create it: `npx.cmd wrangler pages project create ncpwd-impact-mosaic --production-branch main`. Confirm the account/project before publishing.
3. Deploy the persistent budget Worker: `npx.cmd wrangler deploy --config worker/wrangler.toml`. This creates its SQLite-backed Durable Object on the Free plan. Pages binds to the class by script name; no public worker endpoint is enabled.
4. Set `GROQ_API_KEY` with `npx.cmd wrangler pages secret put GROQ_API_KEY --project-name ncpwd-impact-mosaic`. Enter it only at the secure interactive prompt, or pipe it from an external file. Never use an argument, VITE_ variable, .env file in this workspace, git or browser code. Set preview secret scope in Cloudflare if using previews.
5. Run `npm.cmd run typecheck`, `npm.cmd test`, `npm.cmd run build`.
6. Publish: `npx.cmd wrangler pages deploy dist --project-name ncpwd-impact-mosaic --branch main`. The root `functions/` directory is compiled as Pages Functions; never deploy only a ZIP of static assets without Functions.
7. Verify the deployment URL returned by Wrangler. Confirm HTTP 200 and that live HTML asset hashes match dist/index.html. Exercise the complete learner/expert/admin journey, download both PDFs, and POST invalid input to /api/assist (400). Confirm valid source-grounded AI response, missing secrets (503), shared cooldown (429) and no credentials in served assets or storage. Record deployment ID, URL and timestamp in docs/validation.md.

Shared free-budget cap: one call/minute, 20 reservations/UTC day across the entire site, including failed calls. Body <=4 KB; upstream payload <=6.5 KB; response <=600 completion tokens; upstream timeout 20 seconds. Groq published model limits reviewed 4 October 2026: gpt-oss-120b 30 RPM, 1,000 RPD, 8,000 TPM, 200,000 TPD. Other applications sharing the same provider account can consume allowance; 429 remains a normal state. See https://console.groq.com/docs/rate-limits and https://developers.cloudflare.com/durable-objects/platform/pricing/ for current limits. SQLite Durable Objects are available on Workers Free; this demo stores only three quota counters.

AI will fail closed if either key or limiter is missing. Client-side recommendations, learning and all fictional role views still work. Custom courses are excluded from the AI reviewed catalogue until manually reviewed by the developer; the AI UI must select an original sample course or programme documents.

For local Functions testing, use `npx.cmd wrangler pages dev dist` with the limiter Worker configured for the local environment. Do not put a credential in local workspace files. Set process environment only from external secret storage. Vite development returns the UI-only fallback error for AI.

Optional safe log path for a restricted Windows session: set process `WRANGLER_LOG_PATH` to `D:\AyubaGufwanDisabiliyt\output\wrangler.log`; do not change credential location.
