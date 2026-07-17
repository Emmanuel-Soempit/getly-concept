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
} from "lucide-react";

const COUNTRIES = [
  { id: "NG", label: "Nigeria" },
  { id: "UK", label: "United Kingdom" },
  { id: "UAE", label: "UAE" },
];

const MODULES = [
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
      { name: "Sudo", tag: "Physical card" },
      { name: "Bitnob", tag: "Virtual card" },
    ],
    note: "Routed by card type, not country.",
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
    icon: Wallet,
    methods: ["Charge", "Payout", "Refund"],
    providers: [
      { name: "Flutterwave", countries: ["UK", "UAE"] },
      { name: "Sudo", countries: ["NG"], tag: "NGN rails" },
    ],
    note: "Routed live by country.",
    routed: true,
  },
  {
    id: "airline",
    group: "main",
    name: "Airline",
    icon: Plane,
    methods: ["Search fares", "Book"],
    providers: [{ name: "Juyonna" }],
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
                      {mod.providers.length || 0} provider
                      {mod.providers.length === 1 ? "" : "s"} behind this
                      interface
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
                  {mod.providers.length === 0 ? (
                    <div className="rounded-md border border-dashed border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                      {mod.note}
                    </div>
                  ) : (
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
                            {mod.routed && isActive && (
                              <div className="mt-1 text-xs uppercase tracking-wide text-teal-600">
                                Active for {country}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {mod.note && mod.providers.length > 0 && (
                    <div className="mt-2 text-xs text-slate-400">
                      {mod.note}
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
            {["Go", "Fiber", "ent", "PostgreSQL"].map((t) => (
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
            One interface per module. Providers plug in behind it. An admin
            decides who serves who — by country, live, with no redeploy.
          </p>
        </div>

        <div className="mb-8 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Simulate: route by country
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

        {renderGroup("gate", "Onboarding gate", "before anything else")}
        {renderGroup("main", "Main service", "card · eSIM · payment · airline")}
        {renderGroup(
          "addendum",
          "Addendum",
          "insurance · discovery · logistics"
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