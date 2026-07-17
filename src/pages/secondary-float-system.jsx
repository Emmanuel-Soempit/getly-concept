import { useState } from "react";
import {
  ArrowDown,
  Landmark,
  Wallet,
  CreditCard,
  Smartphone,
  Plane,
  Building2,
  ShieldCheck,
  Info,
} from "lucide-react";

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

const LEDGER = [
  {
    action: "USDC Wallet Payins (USD/Local Methods)",
    debit: "USDC Disburse account",
    credit: "USD/Local Settlement Account",
    desc: "User wallet is credited from the USDC settlement, after payin is received in local/USD settlement.",
    tags: ["disburse", "localSettlement", "wallet"],
  },
  {
    action: "USDC Wallet Payouts (USD/Local)",
    debit: "USD/Local Settlement Account",
    credit: "USDC Disburse account",
    desc: "User USDC funds are swept to the USDC settlement, then payout in USD/local is done from the settlement account.",
    tags: ["disburse", "localSettlement", "wallet", "localBank", "treasury"],
  },
  {
    action: "Card Purchase",
    debit: "Card provider account",
    credit: "USDC Disburse (provider price) + USDC Settlement (fee)",
    desc: "Card is issued by provider and charge happens on the provider account. USDC equivalent + fee is collected from the user first.",
    tags: ["serviceFloat", "disburse", "settlement"],
  },
  {
    action: "Card Funding",
    debit: "Card provider account",
    credit: "USDC Disburse (provider price) + USDC Settlement (fee)",
    desc: "Card is funded by provider and charge happens on the provider account. USDC equivalent + fee is collected first.",
    tags: ["serviceFloat", "disburse", "settlement"],
  },
  {
    action: "eSIM Purchase",
    debit: "eSIM provider account",
    credit: "USDC Disburse (provider price) + USDC Settlement (fee)",
    desc: "eSIM is issued by provider and charge happens on the provider account. USDC equivalent + fee is collected first.",
    tags: ["serviceFloat", "disburse", "settlement"],
  },
  {
    action: "eSIM Top-up",
    debit: "eSIM provider account",
    credit: "USDC Disburse (provider price) + USDC Settlement (fee)",
    desc: "eSIM is topped up by provider and charge happens on the provider account. USDC equivalent + fee is collected first.",
    tags: ["serviceFloat", "disburse", "settlement"],
  },
];

export default function GetlyFloatSystem() {
  const [active, setActive] = useState(null);

  const toggle = (id) => setActive((cur) => (cur === id ? null : id));

  return (
    <div
      className="min-h-screen bg-slate-50 px-6 py-10"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
      `}</style>

      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-slate-900"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Float &amp; settlement system
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-500">
            One USDC wallet per traveller. Two floats keep it funded. Two
            ledger accounts keep customer money and Getly's profit from ever
            touching each other.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
            <Info size={13} />
            <span>Click any account below to see which ledger rows touch it.</span>
          </div>
        </div>

        {/* Diagram */}
        <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex flex-col items-center">
            <Node
              id="payin"
              icon={Landmark}
              title="Payin sources"
              subtitle="Local & USD payment methods"
              tone="slate"
              active={active}
              onClick={toggle}
            />
            <Arrow label="funds only" />
            <Node
              id="localSettlement"
              icon={Landmark}
              title="USD / Local Settlement Account"
              tone="blue"
              active={active}
              onClick={toggle}
            />
            <Arrow />
            <Node
              id="disburse"
              icon={Wallet}
              title="USDC Disburse Account"
              subtitle="Working float"
              tone="blue"
              active={active}
              onClick={toggle}
            />
            <Arrow />
            <Node
              id="wallet"
              icon={Wallet}
              title="User USDC Wallet"
              subtitle="Hidden — shown as host/local currency"
              tone="teal"
              active={active}
              onClick={toggle}
              width="w-64"
            />

            {/* Split into Service Pays / Payouts */}
            <div className="mt-2 grid w-full grid-cols-2 gap-8">
              {/* Service Pays column */}
              <div className="flex flex-col items-center">
                <span className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Service pays
                </span>
                <Arrow />
                <Node
                  id="serviceFloat"
                  icon={CreditCard}
                  title="Service Float"
                  subtitle="Card · eSIM · Airline providers"
                  tone="amber"
                  active={active}
                  onClick={toggle}
                />
                <Arrow label="fee slice" />
                <Node
                  id="settlement"
                  icon={ShieldCheck}
                  title="USDC Settlement Account"
                  subtitle="Fees & profit — inflow only"
                  tone="blue"
                  active={active}
                  onClick={toggle}
                />
              </div>

              {/* Payouts column */}
              <div className="flex flex-col items-center">
                <span className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Payouts
                </span>
                <Arrow />
                <div className="flex gap-3">
                  <Node
                    id="virtualCard"
                    icon={Smartphone}
                    title="Virtual card spend"
                    subtitle="Reconciled only"
                    tone="rose"
                    active={active}
                    onClick={toggle}
                    width="w-32"
                  />
                  <Node
                    id="localBank"
                    icon={Building2}
                    title="Local bank transfer"
                    tone="rose"
                    active={active}
                    onClick={toggle}
                    width="w-32"
                  />
                </div>
                <Arrow />
                <Node
                  id="treasury"
                  icon={Landmark}
                  title="Local Providers Float"
                  subtitle="Treasury — host country + USD"
                  tone="amber"
                  active={active}
                  onClick={toggle}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" /> External
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-300" /> Ledger accounts
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-teal-300" /> User wallet
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" /> Floats
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-300" /> Payout endpoints
            </span>
          </div>
        </div>

        {/* Ledger table */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2
            className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Double-entry ledger
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-4 font-semibold">Action</th>
                  <th className="py-2 pr-4 font-semibold">Debit</th>
                  <th className="py-2 pr-4 font-semibold">Credit</th>
                  <th className="py-2 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                {LEDGER.map((row) => {
                  const isHighlighted = active && row.tags.includes(active);
                  return (
                    <tr
                      key={row.action}
                      className={`border-b border-slate-100 align-top transition-colors ${
                        isHighlighted ? "bg-amber-50" : ""
                      }`}
                    >
                      <td className="py-2.5 pr-4 font-semibold text-slate-800">
                        {row.action}
                      </td>
                      <td
                        className="py-2.5 pr-4 text-slate-600"
                        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                      >
                        {row.debit}
                      </td>
                      <td
                        className="py-2.5 pr-4 text-slate-600"
                        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                      >
                        {row.credit}
                      </td>
                      <td className="py-2.5 text-slate-500">{row.desc}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}