Getly Backend Rewrite: Architecture Proposal
Prepared for: Directors & Stakeholders Prepared by: Emmanuel Soempit Date: July 2026


1. The core principle: Dynamism
Getly solves a fragmented problem — every module (KYC, cards, eSIM, airline, insurance, discovery, logistics) depends on a third party, and those third parties differ by country, cost, reliability, and regulatory fit. The system that wins isn't the one with the most integrations; it's the one that can add, swap, or run providers side-by-side with minimal engineering effort.

That's the single design principle behind this rewrite: Dynamism — Getly's ability to plug in new third parties quickly, and to choose which provider serves which customer, without touching the rest of the system.

We're rewriting the backend in Go specifically because it gives us a clean, low-ceremony way to enforce this: every provider a module works with has to answer to one internal contract, and providers become interchangeable parts rather than hard-wired dependencies.


2. Why Go
Beyond dynamism, Go gives us:

Performance — it's compiled, so it runs faster and handles more concurrent traffic per server than our current Node.js setup.
Concurrency built in — Go's goroutines make it natural to run independent operations (like sending a push notification, an email, and an in-app alert) at the same time instead of one after another.
Fast builds, simple deploys — a Go service compiles to a single binary. Fewer moving parts in CI/CD, faster releases.
Lower long-term maintenance cost — Go's type system and interface model catch integration mistakes at compile time rather than in production.


3. The interface pattern, in plain terms
Think of each module — Card, eSIM, Payment, Airline, KYC, Insurance, AI Discovery, Logistics — as defining its own standard socket. Any third party we integrate with for that module has to build a plug that fits that socket.

Concretely: for the Card module, we define what "create a card," "fund a card," and "freeze a card" mean internally, once. Sudo (physical cards) and Bitnob (virtual cards) each implement that same internal contract in their own way. The rest of Getly — the app, the ledger, support tooling — only ever talks to "the Card interface." It doesn't know or care whether a request is quietly routed to Sudo or Bitnob underneath.

This is what makes provider choice dynamic: an admin can decide, per country or per customer segment, which provider handles a given request — without a code change, without redeploying, without touching any other module.

The same pattern applies across every module. We won't map out every provider today — some (like Insurance) haven't been finalized — but the mechanism is identical everywhere:

Module
Providers (initial)
KYC
SumSub
Card
Sudo (physical), Bitnob (virtual)
eSIM
eSIM Access
Payment
Flutterwave, Sudo (NGN payments)
Airline
Juyonna
Insurance
TBD
AI Site Discovery
Deepseek
Logistics
Chowdeck


More providers — and more countries — get added the same way: build one adapter that satisfies the existing interface. Nothing else in the system needs to change.
Handling the exceptions
Not every provider fits the standard contract perfectly. Some require an extra verification step, a document upload, or a status that doesn't map cleanly to our interface. For those cases, we don't force-fit them or bend the core interface — we give that provider its own dedicated schema and endpoint to track the extra data. It's a clearly labeled "custom case," fully isolated from the standard path, so one provider's quirks never complicate the interface everyone else relies on.


4. Notifications: event-driven, not request-driven
When something happens in the system — a card is funded, a KYC check completes, a logistics order ships — that event triggers notifications across three channels: push, email, and in-app (in-app is API-based, not a live socket connection).

Each channel implements the same "send" contract, the same way providers implement module interfaces. When an event fires, all three channels are triggered in parallel (each on its own goroutine) rather than one after another — so a customer isn't waiting on an email to send before their push notification goes out. If one channel is slow or fails, it doesn't hold up the others.


5. Platform reliability & operations
A few non-negotiables across every module, regardless of provider:

Rate limiting on every public endpoint, to protect the platform from abuse and from any single provider's traffic spikes.
Webhook handling for every provider that offers it, so we get real-time status updates (card funded, KYC approved, shipment delivered) instead of polling.
Separate dev, preview, and production environments, so new provider integrations and features are validated before they touch real customer traffic.


6. Why this matters for the business
Faster market expansion. Entering a new country often means a new KYC provider, a new card issuer, a new payment rail. With this pattern, that's an adapter, not a rebuild.
Vendor risk is contained. If a provider raises prices, has an outage, or gets regulatory trouble in a market, we can shift traffic to another provider without downtime or a rewrite.
Lower integration cost over time. The first provider in a module costs the most to build (we're defining the interface). Every provider after that is cheaper, because the contract already exists.
Resilience by design. Because providers are swappable and channels run independently, a single provider or channel failure doesn't cascade into a platform-wide outage.
Cleaner compliance story. Country-by-country provider routing and isolated custom-case schemas make it easier to show regulators and partners exactly which provider handled which customer's data.


7. Migration approach
This is a rewrite, not a greenfield build — Getly is live today on Node.js. The plan is to migrate module by module rather than as one cutover:

Stand up the Go service alongside the existing Node backend.
Migrate one module at a time, starting with the one that gives us the clearest proof point (likely Card, given both providers are already known).
Route traffic for that module to the new service once it's validated in preview; leave everything else on Node until its turn.
Repeat per module, with webhooks and rate limiting in place from day one for each newly migrated module.

This limits blast radius — a problem in one migrated module doesn't put the rest of the platform at risk — and lets us show incremental progress rather than betting everything on a single cutover date.


8. Trade-offs, honestly
Upfront design cost. Defining a clean interface for each module before the second provider exists takes more thought than just wiring up one provider directly. That cost pays off starting with the second provider per module.
Team ramp-up. Go is a smaller shift for the team than Node, but there's still a learning curve, particularly around idiomatic use of interfaces and goroutines.
Discipline required. The interface pattern only pays off if we hold the line on it — if provider-specific shortcuts leak into the core interface instead of going through the custom-case path, we lose the dynamism this whole approach is built for.


Open questions for discussion
Final provider decision for Insurance.
Which module goes first in the migration sequence — Card is the natural candidate given both providers are confirmed.
Timeline expectations per module migration.

