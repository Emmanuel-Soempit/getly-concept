import {
  ShieldCheck,
  Wallet,
  DollarSign,
  Landmark,
  CreditCard,
  Smartphone,
} from "lucide-react";

function ItemBox({ label, icon: Icon }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1.5 rounded-lg border border-white bg-white/70 px-3 py-3 shadow-sm">
      <Icon size={16} className="text-slate-700" />
      <span className="text-xs font-medium text-slate-700">{label}</span>
    </div>
  );
}

const LEDGER = [
  {
    action: "USDC Wallet Payins (USD/Local Methods)",
    debit: "USDC Accounts — Disburse",
    credit: "Fiat Floats — USD/Local",
    desc: "User wallet is credited from USDC Accounts (Disburse), after the payin lands in Fiat Floats (USD/Local).",
  },
  {
    action: "USDC Wallet Payouts (USD/Local)",
    debit: "Fiat Floats — USD/Local",
    credit: "USDC Accounts — Disburse",
    desc: "User's USDC funds are swept into USDC Accounts (Disburse), then the USD/Local payout is made from Fiat Floats.",
  },
  {
    action: "Card Purchase",
    debit: "Service Float — Card",
    credit: "USDC Accounts — Disburse (card price) + USDC Accounts — Settlement (fee)",
    desc: "Card is issued by the provider and charged against Service Float (Card). We collect the USDC equivalent from USDC Accounts (Disburse) plus our fee from USDC Accounts (Settlement) first.",
  },
  {
    action: "Card Funding",
    debit: "Service Float — Card",
    credit: "USDC Accounts — Disburse (card price) + USDC Accounts — Settlement (fee)",
    desc: "Card is funded by the provider and charged against Service Float (Card). We collect the USDC equivalent from USDC Accounts (Disburse) plus our fee from USDC Accounts (Settlement) first.",
  },
  {
    action: "eSIM Purchase",
    debit: "Service Float — eSIM",
    credit: "USDC Accounts — Disburse (price) + USDC Accounts — Settlement (fee)",
    desc: "eSIM is issued by the provider and charged against Service Float (eSIM). We collect the USDC equivalent from USDC Accounts (Disburse) plus our fee from USDC Accounts (Settlement) first.",
  },
  {
    action: "eSIM Top-up",
    debit: "Service Float — eSIM",
    credit: "USDC Accounts — Disburse (price) + USDC Accounts — Settlement (fee)",
    desc: "eSIM is topped up by the provider and charged against Service Float (eSIM). We collect the USDC equivalent from USDC Accounts (Disburse) plus our fee from USDC Accounts (Settlement) first.",
  },
];

export default function GetlyFloatCategories() {
  return (
    <div
      className="min-h-screen bg-slate-50 px-6 py-10"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
      `}</style>

      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1
            className="text-2xl font-bold text-slate-900"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Figure 1 — Account categories
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-500">
            Every ledger entry below moves money between these three
            categories.
          </p>
        </div>

        {/* Figure */}
        <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Left: USDC Accounts */}
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-blue-300 bg-blue-50 p-6">
              <div
                className="text-sm font-bold uppercase tracking-wide text-blue-800"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                USDC Accounts
              </div>
              <div className="flex w-full flex-col gap-3">
                <ItemBox label="Settlement" icon={ShieldCheck} />
                <ItemBox label="Disburse" icon={Wallet} />
              </div>
            </div>

            {/* Right: stacked Fiat Floats + Service Float */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-amber-300 bg-amber-50 p-5">
                <div
                  className="text-sm font-bold uppercase tracking-wide text-amber-800"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Fiat Floats
                </div>
                <div className="flex w-full gap-3">
                  <ItemBox label="USD" icon={DollarSign} />
                  <ItemBox label="Local Country" icon={Landmark} />
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-teal-300 bg-teal-50 p-5">
                <div
                  className="text-sm font-bold uppercase tracking-wide text-teal-800"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Service Float
                </div>
                <div className="flex w-full gap-3">
                  <ItemBox label="Card" icon={CreditCard} />
                  <ItemBox label="eSIM" icon={Smartphone} />
                </div>
              </div>
            </div>
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
                {LEDGER.map((row) => (
                  <tr
                    key={row.action}
                    className="border-b border-slate-100 align-top"
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
