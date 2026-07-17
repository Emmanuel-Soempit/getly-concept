import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import {
  ChevronDown,
  Building2,
  Layers,
  Wallet,
  Globe,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import Architecture from "./pages/architecture";
import FloatSystem from "./pages/float-system";
import SecondaryFloatSystem from "./pages/secondary-float-system";
import HostCountry from "./pages/host-country";

const CONCEPTS = [
  {
    id: "architecture",
    name: "Backend Architecture",
    icon: Building2,
    desc: "One interface per module. Providers plug in behind it. An admin decides who serves who — by country, live, with no redeploy.",
    tags: ["Go", "Fiber", "ent", "PostgreSQL"],
    route: "/architecture",
    doc: "https://docs.google.com/document/d/1QHJlvhniPNYBDmIv4ce_qEtyv4xmy_gHqqoWThnGaCw/edit?usp=sharing",
  },
  {
    id: "float-system",
    name: "Float & Settlement System",
    icon: Layers,
    desc: "How USDC and fiat floats move money between user wallets, service providers, and settlement accounts.",
    tags: ["USDC", "Fiat", "Ledger", "Settlement"],
    route: "/float-system",
    doc: "https://docs.google.com/document/d/1yYD_61e_GMbNp2UKJtTb9Dt2GCar81SNlHSIB6D_0yo/edit?usp=sharing",
  },
  {
    id: "secondary-float-system",
    name: "Secondary Float System",
    icon: Wallet,
    desc: "The extended float model — service floats, provider accounts, and payout endpoints reconciled against the core ledger.",
    tags: ["Service Float", "Payouts", "Treasury"],
    route: "/secondary-float-system",
    doc: "https://docs.google.com/document/d/1yYD_61e_GMbNp2UKJtTb9Dt2GCar81SNlHSIB6D_0yo/edit?usp=sharing",
  },
  {
    id: "host-country",
    name: "Host Country Mechanism",
    icon: Globe,
    desc: "How a traveller's host country shapes everything — from wallet display currency to provider routing to payout rails.",
    tags: ["USDC", "Host Country", "Wallet", "Routing"],
    route: "/host-country",
    doc: "https://docs.google.com/document/d/1yYD_61e_GMbNp2UKJtTb9Dt2GCar81SNlHSIB6D_0yo/edit?usp=sharing",
  },
];

function Landing() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div
      className="min-h-screen bg-slate-50 px-6 py-10"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
      `}</style>

      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-slate-900"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Getly Concepts
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-500">
            Interactive walkthroughs of the systems behind Getly. Expand any
            concept to explore, or jump straight to the full page.
          </p>
        </div>

        <div className="space-y-3">
          {CONCEPTS.map((concept) => {
            const isOpen = expanded === concept.id;
            const Icon = concept.icon;
            return (
              <div
                key={concept.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white"
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : concept.id)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">
                        {concept.name}
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
                    <div className="mb-3 flex flex-wrap gap-2">
                      {concept.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-500"
                          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <p className="mb-4 text-sm text-slate-600">
                      {concept.desc}
                    </p>
                    <div className="flex gap-3">
                      <Link
                        to={concept.route}
                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-700"
                      >
                        Go to page
                        <ArrowRight size={14} />
                      </Link>
                      <a
                        href={concept.doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
                      >
                        Go to doc
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                )}

                {!isOpen && (
                  <div className="flex gap-3 border-t border-slate-100 px-4 py-2.5">
                    <Link
                      to={concept.route}
                      className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      Go to page
                      <ArrowRight size={12} />
                    </Link>
                    <a
                      href={concept.doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
                    >
                      Go to doc
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/architecture" element={<Architecture />} />
      <Route path="/float-system" element={<FloatSystem />} />
      <Route path="/secondary-float-system" element={<SecondaryFloatSystem />} />
      <Route path="/host-country" element={<HostCountry />} />
      <Route path="/" element={<Landing />} />
    </Routes>
  );
}

export default App;
