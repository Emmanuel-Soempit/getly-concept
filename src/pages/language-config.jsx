import { useState } from "react";
import { Languages, Globe, MapPin, Home, Smartphone, Wallet, CreditCard } from "lucide-react";

const COUNTRIES = [
  { id: "NG", label: "Nigeria", originLang: "English", destLang: "English" },
  { id: "UK", label: "United Kingdom", originLang: "English", destLang: "English" },
  { id: "QA", label: "Qatar", originLang: "English / Arabic", destLang: "Arabic / English" },
];

const MOCK_COPY = {
  fundWallet: {
    origin: { NG: "Fund wallet", UK: "Fund wallet", QA: "Fund wallet" },
    destination: { NG: "Fund wallet", UK: "Fund wallet", QA: "Add money" },
  },
  payButton: {
    origin: { NG: "Pay now", UK: "Pay now", QA: "Pay now" },
    destination: { NG: "Pay now", UK: "Pay now", QA: "Pay now" },
  },
};

export default function LanguageConfig() {
  const [country, setCountry] = useState("NG");
  const [mode, setMode] = useState("destination");

  const current = COUNTRIES.find((c) => c.id === country);
  const activeLang = mode === "origin" ? current.originLang : current.destLang;
  const fundLabel = MOCK_COPY.fundWallet[mode][country];

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
            {["i18n", "React Native", "Localization", "Multi-language"].map((t) => (
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
            Language configuration
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-500">
            Getly is language-sensitive. No UI text is hardcoded into buttons,
            labels, or screens. Everything is rendered from i18n keys, and the
            active language context is driven by the user's country selection.
          </p>
        </div>

        {/* Concept cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-2 flex items-center gap-2">
              <Home size={16} className="text-blue-600" />
              <div className="text-sm font-semibold text-slate-800">
                Origin Country
              </div>
            </div>
            <p className="text-xs text-slate-500">
              The country the user is from. The app can display text in the
              language associated with this country — the familiar, home
              context.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-2 flex items-center gap-2">
              <MapPin size={16} className="text-teal-600" />
              <div className="text-sm font-semibold text-slate-800">
                Destination Country
              </div>
            </div>
            <p className="text-xs text-slate-500">
              The country the user is travelling to. The app can display text in
              the language associated with this country — the local, in-market
              context.
            </p>
          </div>
        </div>

        {/* Simulator */}
        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Preview language context
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

          <div className="mb-4 flex gap-1 rounded-lg bg-slate-100 p-1">
            <button
              onClick={() => setMode("origin")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                mode === "origin"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              <Home size={13} />
              Origin Country
            </button>
            <button
              onClick={() => setMode("destination")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                mode === "destination"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              <MapPin size={13} />
              Destination Country
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Mock UI preview
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <Wallet size={16} className="text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">
                    {fundLabel}
                  </span>
                </div>
                <span className="text-xs text-slate-400">i18n key: fundWallet</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <CreditCard size={16} className="text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">
                    {MOCK_COPY.payButton[mode][country]}
                  </span>
                </div>
                <span className="text-xs text-slate-400">i18n key: payNow</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-500">
              Active language context: <span className="font-medium text-slate-700">{activeLang}</span>
            </div>
          </div>
        </div>

        {/* Implementation notes */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-2">
            <Languages size={16} className="mt-0.5 text-blue-600" />
            <div>
              <div className="text-sm font-semibold text-blue-800">
                Implementation with React Native i18n
              </div>
              <p className="mt-1 text-xs text-blue-700">
                All user-facing strings live in translation files keyed by i18n
                identifiers. The active locale is set from the user's chosen
                country context (origin or destination). Switching between
                origin and destination does not reload the app — it simply
                rebinds the i18n locale, so buttons, labels, and help text
                update immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
