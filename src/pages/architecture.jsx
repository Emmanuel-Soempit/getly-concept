import { useState } from "react";
import {
  ChevronDown,
  CreditCard,
  Wifi,
  Wallet,
  Plane,
  ShieldCheck,
  ShieldPlus,
  Compass,
  Truck,
  Bell,
  Mail,
  Smartphone,
  DollarSign,
  Landmark,
  Building2,
} from "lucide-react";

const COUNTRIES = [
  { id: "NG", label: "Nigeria" },
  { id: "UK", label: "United Kingdom" },
  { id: "QA", label: "Qatar" },
];

const MODULES = [
  {
    id: "wallet",
    group: "core",
    name: "USDC Wallet",
    icon: Wallet,
    methods: ["Provision", "Fund", "Display balance"],
    providers: [{ name: "Cycle" }],
    note: "User's primary and only wallet. Hidden — displayed as host/local currency, not USDC.",
  },
  {
    id: "kyc",
    group: "gate",
    name: "KYC",
    icon: ShieldCheck,
    methods: ["Verify identity", "Check document"],
    providers: [{ name: "SumSub" }],
    note: "Every traveller passes through here first.",
  },
  {
    id: "card",
    group: "main",
    name: "Card",
    icon: CreditCard,
    methods: ["Create", "Fund", "Freeze"],
    providers: [
      {
        name: "Bridge",
        tag: "Recommended",
        note: "Stripe company. Stablecoin-native card issuance — spend directly from USDC. Multi-country coverage.",
      },
      {
        name: "Lithic",
        tag: "US-only",
        note: "Issues cards to US citizens/residents only. Expanding internationally but no current path for Getly's traveller base.",
      },
    ],
    note: "Bridge is the stronger structural fit — USDC-native card issuance. Lithic is US-only for now.",
  },
  {
    id: "esim",
    group: "main",
    name: "eSIM",
    icon: Wifi,
    methods: ["Provision", "Activate"],
    providers: [{ name: "eSIM Access" }],
    note: "Single provider today — interface ready for more.",
  },
  {
    id: "payment",
    group: "main",
    name: "Payment",
    icon: DollarSign,
    channels: [
      {
        name: "Payins",
        icon: Landmark,
        purpose: "Fund the USDC wallet. Nothing else — no feature ever pulls a payin directly.",
        providers: [
          { name: "Local providers", countries: ["NG"], tag: "Local / USD" },
          { name: "Virtual card", tag: "USD" },
        ],
      },
      {
        name: "Service Pays",
        icon: CreditCard,
        purpose: "Pay for anything inside the app — cards, eSIMs — always from the USDC wallet.",
        providers: [
          { name: "Card providers", tag: "Bridge / Lithic" },
          { name: "eSIM providers", tag: "eSIM Access" },
        ],
      },
      {
        name: "Payouts",
        icon: Building2,
        purpose: "Money leaving the system — virtual card spend (reconciliation only) and local bank transfers.",
        providers: [
          { name: "Virtual card", tag: "USD" },
          { name: "Local bank transfer", tag: "USD / Local" },
          { name: "Service providers", tag: "Implementation" },
        ],
      },
    ],
  },
  {
    id: "airline",
    group: "main",
    name: "Airline",
    icon: Plane,
    methods: ["Search fares", "Book"],
    providers: [{ name: "Travel Base" }],
  },
  {
    id: "insurance",
    group: "addendum",
    name: "Insurance",
    icon: ShieldPlus,
    methods: ["Quote", "Issue policy"],
    providers: [],
    note: "Provider not yet selected — contract is ready.",
  },
  {
    id: "discovery",
    group: "addendum",
    name: "AI site discovery",
    icon: Compass,
    methods: ["Recommend sites"],
    providers: [{ name: "Deepseek" }],
  },
  {
    id: "logistics",
    group: "addendum",
    name: "Logistics",
    icon: Truck,
    methods: ["Create shipment", "Track"],
    providers: [{ name: "Chowdeck" }],
  },
  {
    id: "gov-services",
    group: "addendum",
    name: "Government Services",
    icon: Landmark,
    methods: ["Submit application", "Verify status"],
    providers: [],
    note: "Provider not yet selected — contract is ready.",
  },
];

export default function GetlyArchitecture() {
  const [country, setCountry] = useState("NG");
  const [expanded, setExpanded] = useState("payment");
  const [pulse, setPulse] = useState(false);

  const fireEvent = () => {
    setPulse(true);
    setTimeout(() => setPulse(false), 1400);
  };

  const renderGroup = (groupId, label, desc) => (
    <div className="mb-8">
      <div className="mb-3 flex items-baseline gap-2">
        <h3
          className="text-sm font-semibold uppercase tracking-wide text-slate-500"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {label}
        </h3>
        <span className="text-xs text-slate-400">{desc}</span>
      </div>
      <div className="space-y-3">
        {MODULES.filter((m) => m.group === groupId).map((mod) => {
          const isOpen = expanded === mod.id;
          const Icon = mod.icon;
          return (
            <div
              key={mod.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <button
                onClick={() => setExpanded(isOpen ? null : mod.id)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">
                      {mod.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {mod.channels
                        ? `${mod.channels.length} channel${mod.channels.length === 1 ? "" : "s"}`
                        : `${(mod.providers || []).length || 0} provider${(mod.providers || []).length === 1 ? "" : "s"} behind this interface`}
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
                  {mod.methods && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {mod.methods.map((m) => (
                        <span
                          key={m}
                          className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs text-blue-800"
                          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                        >
                          {m}()
                        </span>
                      ))}
                    </div>
                  )}
                  {mod.providers && mod.providers.length === 0 ? (
                    <div className="rounded-md border border-dashed border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                      {mod.note}
                    </div>
                  ) : mod.providers ? (
                    <div className="flex flex-wrap gap-2">
                      {mod.providers.map((p) => {
                        const isActive = mod.routed
                          ? (p.countries || []).includes(country)
                          : true;
                        return (
                          <div
                            key={p.name}
                            className={`rounded-lg border px-3 py-2 text-xs transition-all ${
                              isActive
                                ? "border-teal-300 bg-teal-50 text-teal-800"
                                : "border-slate-200 bg-white text-slate-400"
                            }`}
                          >
                            <div className="font-semibold">{p.name}</div>
                            {p.tag && (
                              <div className="text-xs opacity-80">{p.tag}</div>
                            )}
                            {p.note && (
                              <div className="mt-1 max-w-xs text-xs opacity-70">
                                {p.note}
                              </div>
                            )}
                            {mod.routed && isActive && (
                              <div className="mt-1 text-xs uppercase tracking-wide text-teal-600">
                                Active for {country}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                  {mod.note && mod.providers && mod.providers.length > 0 && (
                    <div className="mt-2 text-xs text-slate-400">
                      {mod.note}
                    </div>
                  )}
                  {mod.channels && (
                    <div className="mt-4 space-y-3">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Payment channels
                      </div>
                      {mod.channels.map((ch) => {
                        const ChIcon = ch.icon;
                        return (
                          <div
                            key={ch.name}
                            className="rounded-lg border border-slate-200 bg-white p-3"
                          >
                            <div className="mb-1.5 flex items-center gap-2">
                              <ChIcon size={14} className="text-slate-500" />
                              <span className="text-xs font-semibold text-slate-800">
                                {ch.name}
                              </span>
                            </div>
                            <p className="mb-2 text-xs text-slate-500">
                              {ch.purpose}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {ch.providers.map((p) => {
                                const isActive = (p.countries || []).includes(country);
                                return (
                                  <div
                                    key={p.name}
                                    className={`rounded-md border px-2.5 py-1.5 text-xs transition-all ${
                                      p.countries
                                        ? isActive
                                          ? "border-teal-300 bg-teal-50 text-teal-800"
                                          : "border-slate-200 bg-white text-slate-400"
                                        : "border-slate-200 bg-slate-50 text-slate-700"
                                    }`}
                                  >
                                    <div className="font-semibold">{p.name}</div>
                                    {p.tag && (
                                      <div className="text-xs opacity-80">{p.tag}</div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-slate-50 px-6 py-10"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
        @keyframes pulseFire {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(67,56,202,0.35); }
          50% { transform: scale(1.04); box-shadow: 0 0 0 8px rgba(67,56,202,0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(67,56,202,0); }
        }
        .pulse-fire { animation: pulseFire 0.7s ease-out 2; }
      `}</style>

      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <div className="mb-2 flex flex-wrap gap-2">
            {["Go", "Fiber", "ent", "PostgreSQL", "USDC"].map((t) => (
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
            Getly backend architecture
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-500">
            One interface per module. Providers plug in behind it. Every
            traveller gets a hidden USDC wallet — destination country drives provider
            routing and display currency, live, with no redeploy.
          </p>
        </div>

        <div className="mb-8 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Simulate: route by destination country
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
            Destination country drives provider routing and wallet display currency.
          </div>
        </div>

        {renderGroup("core", "Core", "the foundation everything flows through")}
        {renderGroup("gate", "Onboarding gate", "before anything else")}
        {renderGroup("main", "Main service", "wallet · card · eSIM · payment · airline")}
        {renderGroup(
          "addendum",
          "Addendum",
          "insurance · discovery · logistics · gov services"
        )}

        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-800">
                Notifications fire in parallel
              </div>
              <div className="text-xs text-slate-400">
                Same "send" contract, three channels, one goroutine each.
              </div>
            </div>
            <button
              onClick={fireEvent}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white"
            >
              Simulate event
            </button>
          </div>
          <div className="flex gap-3">
            {[
              { Icon: Bell, label: "Push" },
              { Icon: Mail, label: "Email" },
              { Icon: Smartphone, label: "In-app" },
            ].map(({ Icon, label }) => (
              <div
                key={label}
                className={`flex flex-1 items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 ${
                  pulse ? "pulse-fire" : ""
                }`}
              >
                <Icon size={16} className="text-indigo-700" />
                <span className="text-xs font-medium text-indigo-800">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-rose-300 bg-rose-50 p-4">
          <div className="text-sm font-semibold text-rose-800">
            When a provider needs an extra step
          </div>
          <p className="mt-1 text-xs text-rose-700">
            It gets its own schema and endpoint — isolated, tracked, never
            bent into the core interface. One provider's quirks never
            complicate the contract everyone else relies on.
          </p>
        </div>
      </div>
    </div>
  );
}