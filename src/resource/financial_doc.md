Getly Financial Architecture: Onboarding, Wallet & Settlement
Prepared for: Directors & Stakeholders Prepared by: Emmanuel Soempit Date: July 2026

This document extends the provider interface architecture with the financial core of the system — how a traveller onboards, how money is held, and how it moves. The USDC wallet, Card, and eSIM providers described here are concrete instances of the same interface pattern: one internal contract per module, with the provider behind it swappable.


1. Overview
Getly's financial core is built around a single idea: every traveller has one internal wallet, denominated in USDC, and everything else — cards, eSIMs, transfers — is a controlled door in or out of that wallet. Keeping the ledger internal to USDC (rather than juggling NGN, GBP, USD, and every host-country currency directly against every provider) gives Getly one settlement asset to reconcile against, instead of a currency pair per provider per country.


2. Onboarding
Account creation — OAuth or email/password.
Host country selection — the user declares which country they're travelling to; this is what later drives provider routing (per the interface pattern — see the architecture doc).
KYC — handled by SumSub.

Only after KYC clears does wallet provisioning happen.


3. Wallet architecture
Once onboarding completes, a USDC account is provisioned for the customer via Cycle. Two things matter here:

This is the user's primary and only wallet. Nearly everything the user does inside the app happens through it.
It's hidden. The user never sees "USDC" — they see balances displayed as their host country and local (nationality) country currency equivalents. The stablecoin layer is an implementation detail, not a product surface.

The only time money enters from outside the app is when the user funds this wallet. Every other transaction — cards, eSIMs, transfers — is an internal movement against that same balance.


4. Payment channels
Payments split into three channels, and it's worth being precise about what each one is actually for.
Payins
Purpose: fund the USDC wallet. Nothing else. No feature ever pulls a payin directly from a local provider or bank — the wallet is the only door in. This constraint is deliberate, and it buys three things:

Fraud control — once funds are internal, every subsequent movement is a controlled internal transfer, not a fresh external touchpoint.
Better margins — fewer external rails touched per transaction means better fee and rate management.
Fewer failure points — internal transfers are easier to track and reverse than transactions that depend on an external system at every step.
Service Pays
Purpose: pay for anything inside the app — funding or buying cards, buying or topping up eSIMs — always from the user's USDC wallet. Because the ecosystem only opens through one channel (wallet funding), the only FX pair that ever matters here is USD against the currency the service requires. Since Card and eSIM providers are mostly USD-denominated, this keeps the system simple: one FX pair, not a matrix of them.

Most of these providers require Getly to maintain a float with them — the Service Float (see §5).
Payouts
Purpose: money leaving the system, in two forms:

Virtual cards. When a user spends on a virtual card, the money leaves Getly's system — but the spend itself is facilitated entirely by the card provider. Getly's only job is reconciliation: match the provider's record of the transaction against Getly's own.
Transfers to local banks. Facilitated directly from the USDC wallet, letting users pay out into the host country, their local (nationality) country, or USD.


5. Float system
Two floats need to be maintained, and they serve different purposes:

Service Float — the balance Getly maintains with Card, eSIM, and Airline providers to fund purchases on the user's behalf in real time.
Local Providers Float (Treasury) — the balance maintained with local banks in host countries, plus USD, to support local payouts and payins.


6. Settlement & Disbursement accounts
Two internal accounts keep money cleanly separated for accounting purposes:

Settlements Account (USDC) — where fees and profit land. Money only enters this account, unless a deliberate withdrawal happens. It never funds customer activity.
Disbursement Account — the working float used to fund customer wallets on payins, and the account money is swept back to on payouts and service pays.

Keeping these separate means a bug or fraud event in customer-facing flows can never silently touch settled profit, and profit reporting never has to be reconstructed from a blended account.


7. Ledger — double-entry accounting
Action
Debit
Credit
Description
USDC Wallet Payins (USD/Local Methods)
USDC Disburse account
USD/Local Settlement Account
User wallet is credited from the USDC settlement, after the payin is received in the local/USD settlement account.
USDC Wallet Payouts (USD/Local)
USD/Local Settlement Account
USDC Disburse account
User's USDC funds are swept to the USDC settlement account, then the USD/local payout is made from there.
Card Purchase
Card provider account
USDC Disburse (provider card price) + USDC Settlement (fee)
Card is issued by the provider and charged on the provider account. The USDC equivalent plus Getly's fee is collected from the user first.
Card Funding
Card provider account
USDC Disburse (provider card price) + USDC Settlement (fee)
Card is funded by the provider and charged on the provider account. The USDC equivalent plus Getly's fee is collected from the user first.
eSIM Purchase
eSIM provider account
USDC Disburse (provider price) + USDC Settlement (fee)
eSIM is issued by the provider and charged on the provider account. The USDC equivalent plus Getly's fee is collected from the user first.
eSIM Top-up
eSIM provider account
USDC Disburse (provider price) + USDC Settlement (fee)
eSIM is topped up by the provider and charged on the provider account. The USDC equivalent plus Getly's fee is collected from the user first.


Every row follows the same shape: collect from the user in USDC first, then let the provider charge its own account — Getly never fronts a provider charge before collecting the USDC equivalent and fee from the user.


8. Providers, and how they fit the interface pattern
Module
Provider
Notes
USDC wallet
Cycle
Issues the USDC wallet purely via API — no end-customer KYC required from Cycle's side; only Getly's own KYC (via SumSub) applies. Worth independently verifying this claim directly with Cycle before it's load-bearing for compliance — a "no KYC required from us" claim from a wallet provider is the kind of thing to get in writing.
Card
Lithic or Bridge (decision pending)
See comparison below.
eSIM
eSIM Access
Unchanged from the original module map.

Card provider: Lithic vs. Bridge
This decision matters more than it looks, because Getly's whole model is USDC-native — the card provider needs to sit naturally on top of that, not force a conversion layer.

Lithic issues cards, but as of now only to US citizens/residents. It's expanding internationally starting with Canada, with UK/EU groundwork underway — but there's no current path to issuing cards to Getly's actual traveller base. For Getly specifically, this is a real constraint, not a formality.
Bridge (a Stripe company) is built specifically for stablecoin-backed card issuance — cardholders spend directly from a USDC/stablecoin balance, with issuance already live across multiple countries (currently strongest in Latin America, expanding to Europe, Africa, and Asia). This is a much closer architectural match to Getly's own USDC wallet model than Lithic is.

Given Getly's wallet is USDC-first, Bridge is the stronger structural fit unless there's a specific reason (pricing, a particular market not yet covered, existing relationship) to pull Lithic in for a subset of countries. Worth confirming Bridge's current country coverage against Getly's actual launch markets before locking this in.


9. Open items for diligence
Confirm Cycle's no-KYC claim directly with Cycle before treating it as a compliance fact.
Finalize Card provider — Bridge appears the better structural fit given the USDC-native model; confirm country coverage matches Getly's launch markets.
Confirm FX handling at the host/local currency display layer — how often rates refresh, and who absorbs slippage between wallet display and actual settlement.
Reconciliation cadence for the Virtual card payout flow, since Getly doesn't control that leg directly.

