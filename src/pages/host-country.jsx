import { useState } from "react";
import {
  ChevronDown,
  ArrowDown,
  Globe,
  ShieldCheck,
  Wallet,
  Landmark,
  Building2,
  CreditCard,
  Smartphone,
  UserPlus,
  Info,
} from "lucide-react";

const COUNTRIES = [
  { id: "NG", label: "Nigeria", currency: "NGN" },
  { id: "UK", label: "United Kingdom", currency: "GBP" },
  { id: "UAE", label: "UAE", currency: "AED" },
];

const NODE_STYLES = {
  slate: "border-slate-300 bg-slate-50 text-slate-700",
  blue: "border-blue-300 bg-blue-50 text-blue-800",
  teal: "border-teal-300 bg-teal-50 text-teal-800",
  amber: "border-amber-300 bg-amber-50 text-amber-800",
  rose: "border-rose-300 bg-rose-50 text-rose-800",
};

const NODE_STYLES_ACTIVE = {
  slate: "border-slate-500 bg-slate-100 ring-2 ring-slate-400",
  blue: "border-blue-500 bg-blue-100 ring-2 ring-blue-400",
  teal: "border-teal-500 bg-teal-100 ring-2 ring-teal-400",
  amber: "border-amber-500 bg-amber-100 ring-2 ring-amber-400",
  rose: "border-rose-500 bg-rose-100 ring-2 ring-rose-400",
};

function Node({ id, icon: Icon, title, subtitle, tone, active, onClick, width = "w-56" }) {
  const isActive = active === id;
  return (
    <button
      onClick={() => onClick(id)}
      className={`${width} rounded-xl border px-3 py-2.5 text-left transition-all ${
        isActive ? NODE_STYLES_ACTIVE[tone] : NODE_STYLES[tone]
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon size={15} />
        <div className="text-xs font-semibold leading-tight">{title}</div>
      </div>
      {subtitle && <div className="mt-1 text-xs opacity-80">{subtitle}</div>}
    </button>
  );
}

function Arrow({ label }) {
  return (
    <div className="flex flex-col items-center py-1">
      <ArrowDown size={16} className="text-slate-300" />
      {label && (
        <span className="mt-0.5 text-xs font-medium text-slate-400">
          {label}
        </span>
      )}
    </div>
  );
}

const STEPS = [
  {
    id: "onboarding",
    name: "Onboarding",
    icon: UserPlus,
    desc: "Account creation via OAuth or email/password. The user declares their host country — the country they're travelling to. This is the key decision that cascades through the entire system.",
    providers: [{ name: "Internal", tag: "OAuth / email" }],
    note: "Host country selection happens here, before anything else.",
  },
  {
    id: "kyc",
    name: "KYC",
    icon: ShieldCheck,
    desc: "Identity verification handled by SumSub. Only after KYC clears does wallet provisioning happen. The host country declared during onboarding is passed through to inform downstream routing.",
    providers: [{ name: "SumSub" }],
    note: "Every traveller passes through here first.",
  },
  {
    id: "wallet",
    name: "Wallet Provisioning",
    icon: Wallet,
    desc: "A USDC wallet is provisioned via Cycle. This is the user's primary and only wallet. It's hidden — the user never sees 'USDC'. Balances are displayed as their host country currency and local (nationality) country currency equivalents. The stablecoin layer is an implementation detail, not a product surface.",
    providers: [{ name: "Cycle", tag: "USDC wallet API" }],
    note: "Display currency is driven by host country selection.",
  },
  {
    id: "payins",
    name: "Payins",
    icon: Landmark,
    desc: "Funding the USDC wallet. Nothing else — no feature ever pulls a payin directly from a local provider or bank. The wallet is the only door in. Providers route based on host country.",
    providers: [
      { name: "Local providers", tag: "Local / USD" },
      { name: "Virtual card", tag: "USD" },
    ],
    note: "Routed by host country.",
  },
  {
    id: "payouts",
    name: "Payouts",
    icon: Building2,
    desc: "Money leaving the system in two forms: virtual card spend (USD, facilitated by the card provider — Getly's job is reconciliation only) and local bank transfers (host country currency, local currency, or USD).",
    providers: [
      { name: "Virtual card", tag: "USD" },
      { name: "Local bank transfer", tag: "USD / Local" },
      { name: "Service providers", tag: "Implementation" },
    ],
    note: "Payout rails determined by host country.",
  },
];

export default function HostCountry() {
  const [country, setCountry] = useState("NG");
  const [expanded, setExpanded] = useState("wallet");
  const [active, setActive] = useState(null);

  const toggle = (id) => setActive((cur) => (cur === id ? null : id));
  const currentCountry = COUNTRIES.find((c) => c.id === country);

  return (
    <div
      className="min-h-screen bg-slate-50 px-6 py-10"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
      `}</style>

      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex flex-wrap gap-2">
            {["USDC", "Host Country", "Wallet", "Routing"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-500"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {t}
              </span>
            ))}
          </div>
          <h1
            className="text-3xl font-bold text-slate-900"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Host country mechanism
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-500">
            How a traveller's host country shapes everything — from wallet
            display currency to provider routing to payout rails.
          </p>
        </div>

        {/* Country selector */}
        <div className="mb-8 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Simulate: select host country
            </div>
            <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
              {COUNTRIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCountry(c.id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    country === c.id
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div className="text-xs text-slate-400">
            Host country drives wallet display currency ({currentCountry.currency}) and provider routing.
          </div>
        </div>

        {/* Section 1: Collapsible Representation */}
        <div className="mb-3 flex items-baseline gap-2">
          <h2
            className="text-sm font-semibold uppercase tracking-wide text-slate-500"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Collapsible representation
          </h2>
          <span className="text-xs text-slate-400">step-by-step breakdown</span>
        </div>

        <div className="mb-10 space-y-3">
          {STEPS.map((step) => {
            const isOpen = expanded === step.id;
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white"
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : step.id)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">
                        {step.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        Click to {isOpen ? "collapse" : "expand"}
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 bg-slate-50 px-4 py-4">
                    <p className="mb-3 text-sm text-slate-600">{step.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {step.providers.map((p) => (
                        <div
                          key={p.name}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700"
                        >
                          <div className="font-semibold">{p.name}</div>
                          {p.tag && (
                            <div className="text-xs opacity-80">{p.tag}</div>
                          )}
                        </div>
                      ))}
                    </div>
                    {step.note && (
                      <div className="mt-2 text-xs text-slate-400">
                        {step.note}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Section 2: Interactive Representation */}
        <div className="mb-3 flex items-baseline gap-2">
          <h2
            className="text-sm font-semibold uppercase tracking-wide text-slate-500"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Interactive representation
          </h2>
          <span className="text-xs text-slate-400">click any node to highlight</span>
        </div>

        <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex flex-col items-center">
            <Node
              id="onboarding"
              icon={UserPlus}
              title="Onboarding"
              subtitle="OAuth / email · account creation"
              tone="slate"
              active={active}
              onClick={toggle}
            />
            <Arrow label="user declares host country" />
            <Node
              id="hostCountry"
              icon={Globe}
              title={`Host Country: ${currentCountry.label}`}
              subtitle={`Display currency: ${currentCountry.currency}`}
              tone="amber"
              active={active}
              onClick={toggle}
              width="w-64"
            />
            <Arrow />
            <Node
              id="kyc"
              icon={ShieldCheck}
              title="KYC — SumSub"
              subtitle="Identity verification"
              tone="slate"
              active={active}
              onClick={toggle}
            />
            <Arrow label="only after KYC clears" />
            <Node
              id="walletProvision"
              icon={Wallet}
              title="Wallet Provisioning — Cycle"
              subtitle="USDC wallet · hidden from user"
              tone="blue"
              active={active}
              onClick={toggle}
              width="w-64"
            />
            <Arrow label={`displayed as ${currentCountry.currency} / local currency`} />

            {/* Split: Payins / Payouts */}
            <div className="mt-2 grid w-full grid-cols-2 gap-8">
              {/* Payins column */}
              <div className="flex flex-col items-center">
                <span className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Payins
                </span>
                <Arrow />
                <Node
                  id="payinLocal"
                  icon={Landmark}
                  title="Local / USD methods"
                  subtitle={`Fund wallet via ${currentCountry.currency} / USD`}
                  tone="teal"
                  active={active}
                  onClick={toggle}
                />
                <Arrow label="wallet is the only door in" />
                <Node
                  id="payinVirtual"
                  icon={CreditCard}
                  title="Virtual card"
                  subtitle="USD funding"
                  tone="teal"
                  active={active}
                  onClick={toggle}
                  width="w-32"
                />
              </div>

              {/* Payouts column */}
              <div className="flex flex-col items-center">
                <span className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Payouts
                </span>
                <Arrow />
                <Node
                  id="payoutVirtual"
                  icon={Smartphone}
                  title="Virtual card spend"
                  subtitle="USD · reconciled only"
                  tone="rose"
                  active={active}
                  onClick={toggle}
                  width="w-32"
                />
                <Arrow />
                <Node
                  id="payoutBank"
                  icon={Building2}
                  title="Local bank transfer"
                  subtitle={`${currentCountry.currency} / local / USD`}
                  tone="rose"
                  active={active}
                  onClick={toggle}
                />
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" /> Onboarding / KYC
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" /> Host country
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-300" /> Wallet
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-teal-300" /> Payins
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-300" /> Payouts
            </span>
          </div>
        </div>

        {/* Info note */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-2">
            <Info size={16} className="mt-0.5 text-blue-600" />
            <div>
              <div className="text-sm font-semibold text-blue-800">
                Why host country matters
              </div>
              <p className="mt-1 text-xs text-blue-700">
                Keeping the ledger internal to USDC gives Getly one settlement
                asset to reconcile against. Host country is the single variable
                that determines display currency, which payment providers are
                active, and which payout rails are available — all without
                redeploying.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
