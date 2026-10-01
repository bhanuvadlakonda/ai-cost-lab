# AI Cost Lab

An educational calculator for comparing text-model API costs and the operating cost of an AI workflow. Built by Bhanu Vadlakonda. MIT licensed.

[Try the calculator](https://ai-cost-lab-bhanu.bhanuv3.chatgpt.site)

## What it does

- Compare up to three models using the same input, output, cached-token and call assumptions
- Estimate cost per resolved business task with capped retries, tool fees and human escalations
- Allocate setup costs across months and shared monthly infrastructure costs across workloads
- Explore four synthetic token-budget workflows and three editable embedding/infrastructure examples
- Expose the same deterministic math through four read-only MCP tools

It makes no model API calls and needs no model-provider API key. No analytics, database, account registration or request-body logging is included in this code. Host and proxy logging policies remain the deployer's responsibility.

## Run locally

Requires Node.js 22 or later. There are no npm dependencies, and no install or lockfile is required.

```sh
npm test
npm start
```

Open http://127.0.0.1:3000. `npm test` builds the Worker and runs all suites. After changing assets or the MCP server, run `npm run build` before starting the server. The default listener is loopback only; `HOST` and `PORT` configure it.

The website works without a token. MCP tool calls are denied until the server is configured with a private `AI_COST_LAB_MCP_TOKEN` environment variable. Clients send that value in `Authorization: Bearer ...`. Keep it outside source control and URLs. Do not paste real credentials into examples, issues or browser inputs.

## Deploy the website

For a website-only deployment, upload only the eight top-level files inside `dist/` to any static host. Do not upload `dist/server/`. The UI runs entirely in the browser and does not require the MCP endpoint. Serving the generated Worker is another option.

For website plus MCP, `npm run build` generates `dist/server/index.js`, a dependency-free Web Standards Worker with a `fetch(request, env)` entry point. Supply `env.AI_COST_LAB_MCP_TOKEN` using the host's secret configuration. Alternatively run `npm start` behind an HTTPS reverse proxy. Configure TLS, rate limits, resource limits and operational logging appropriately before Internet exposure. The adapter explicitly serves an asset allowlist and `/mcp`; it does not expose source or environment files.

The portable adapter is a small bearer-token reference implementation, not an OAuth authorization server. Some ChatGPT or other MCP clients require OAuth discovery and registration; those clients need a compatible authenticated gateway. This repository does not install a plugin or reproduce any hosted service's account bindings. Neither the Node nor Worker adapter trusts client-supplied identity headers.

## MCP tools

POST JSON-RPC to `/mcp`. Supported protocol versions: 2024-11-05, 2025-03-26 and 2025-06-18. Stateless initialization, tool listing and calls are supported; no SSE, sessions, resources or prompts. Initialization and tool discovery contain public definitions and are available without authentication. Data-bearing tool calls require adapter authentication.

- `compare_model_api_costs`: identical numeric workload across 1–3 curated models; returns token subtotals
- `estimate_workflow_cost`: explicit per-model success assumptions, retry/escalation inputs and optional additional costs
- `get_workflow_examples`: synthetic step-by-step token examples
- `get_infrastructure_scenarios`: editable sourced-rate example budgets and their mapping into workflow costs

Schemas live in `src/mcp.mjs`. All tools are read-only, deterministic and accept numeric assumptions or defined identifiers. Do not submit customer text or secrets. Unknown or invalid fields are rejected. Requests are limited to 64 KiB. User success rates are assumptions, never quality benchmarks inferred from prices.

## Understanding the results

API view is a **token subtotal**. Cached tokens are a subset of total input, never counted twice. Tokens differ between model tokenizers; matching numeric token counts approximates matching workloads. Include billable reasoning in output assumptions.

One workflow attempt may contain multiple model calls. A retry repeats the entire attempt and stops after success. With success probability `p` and `r` retries, expected attempts are `sum((1-p)^i, i=0..r)`. Only remaining failures may escalate to a human; AI and human resolutions do not overlap. These assumptions treat attempts as independent with constant costs, which may not match real failure patterns.

Additional costs include:
- One-time parsing, embedding and indexing, amortized over chosen months
- Query embeddings, retrieval, reranking, transfer and other usage fees per complete attempt
- Monthly vector storage, compute, monitoring and maintenance

Setup and fixed costs use the allocated share; per-attempt usage does not. Avoid counting the same provider bill in multiple categories. Blank/omitted costs remain unknown. Explicit zero means reviewed and not applicable or counted elsewhere. A complete result means the **entered scope** is complete, not a guarantee of total business cost. At zero volume, fixed/setup costs still exist and per-task costs are undefined.

Infrastructure presets use hypothetical sizes and labour budgets with dated provider rates. They do not establish capacity. Preset selection is a preview; click “Use this example in Workflow cost” to apply it. Query usage follows actual expected attempts including retries; fixed budgets do not auto-scale. The static corpus assumption excludes ongoing corpus updates, backups and high availability. Parsing and indexing stay unknown. Scenarios below the provider minimum or outside valid mapped cost bounds cannot be loaded; this prevents misleading linear approximations.

## Prices and sources

Presets are a snapshot checked **2026-10-01**, in USD per million tokens, with editable rates in the UI. They are not live quotes. Review official pricing before relying on results.

- Model records, exact official URLs and caveats: [`dist/models.mjs`](dist/models.mjs)
- Infrastructure rates, formulas and source URLs: [`dist/infrastructure.mjs`](dist/infrastructure.mjs)
- [OpenAI embedding model](https://developers.openai.com/api/docs/models/text-embedding-3-small)
- [Railway pricing](https://docs.railway.com/pricing) and [billing minimums](https://docs.railway.com/pricing/understanding-your-bill)

Gemini 3.8 Flash rates in this snapshot are promotional through 2026-12-31; update them before relying on later estimates. Cache writes/storage, long-context and regional premiums, taxes, negotiated discounts and unentered expenses may be excluded. See visible warnings and tool metadata. The infrastructure example uses self-managed PostgreSQL/pgvector on Railway, not a managed database capacity guarantee. Labour hours and hourly rates are illustrative, not vendor prices or industry benchmarks.

## Source map and tests

- `dist/calc.mjs`: shared pure calculation and validation engine
- `dist/models.mjs`, `dist/workflows.mjs`, `dist/infrastructure.mjs`: data and illustrative assumptions
- `dist/app.mjs`, `dist/index.html`, `dist/style.css`, `dist/favicon.svg`: browser app
- `src/mcp.mjs`, `src/auth.mjs`: protocol, tools and adapter authentication
- `build.mjs`: bundles an explicit frontend allowlist and server modules
- `server.mjs`: Node HTTP adapter
- `test*.mjs`: 371 assertions covering math, bounds, completeness, workflow normalization, UI events, MCP parity and authentication

UI tests use a simulated DOM; they are not a substitute for browser, accessibility or production deployment testing. CI runs the same dependency-free suite on Node 22. No dependency lockfile is needed because no packages are installed. The source is an initial standalone export; hosting history and private configuration are intentionally absent.

## Contributing

Run `npm test` before proposing changes. Include tests for calculation changes and retain unknown-versus-zero semantics. Keep rate changes dated and link primary sources. Do not add fabricated model-quality scores. Review generated Worker output locally, but do not commit it. Do not include credentials or private customer assumptions in reports.

## License and attribution

MIT © 2026 Bhanu Vadlakonda. See [LICENSE](LICENSE). See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for dependency and source attribution notes.
