"use client";

import { useEffect, useState } from "react";

type Strategy =
  | "Buy to Let"
  | "Refurb & Sell"
  | "Development / Conversion"
  | "Undecided";

type Experience =
  | "First-time auction buyer"
  | "Some property experience"
  | "Experienced investor";

export default function AnalysePage() {
  const [step, setStep] = useState(1);
  const [strategy, setStrategy] = useState<Strategy | "">("");
  const [experience, setExperience] = useState<Experience | "">("");
  const [auctionLink, setAuctionLink] = useState("");
  const [address, setAddress] = useState("");
  const [legalPackName, setLegalPackName] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (step === 4) {
      const timer = setTimeout(() => {
        setStep(5);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [step]);

  const stepClass = (stepNumber: number) =>
    step === stepNumber
      ? "font-semibold text-slate-900"
      : step > stepNumber
      ? "text-slate-500"
      : "text-slate-400";

  const score = 68;
  const strategyFit = 78;
  const investmentQuality = 72;
  const riskLevel = 55;

  const scoreLabel =
    score >= 80
      ? "Strong Opportunity"
      : score >= 60
      ? "Promising"
      : score >= 40
      ? "Medium Risk"
      : "High Risk";

  const scoreColor =
    score >= 80
      ? "text-green-600"
      : score >= 60
      ? "text-amber-500"
      : score >= 40
      ? "text-orange-500"
      : "text-red-600";

  const propertyDisplay =
    address || auctionLink || "Auction Property Analysis";

  const requestHelpHref = `/request-help?property=${encodeURIComponent(
    propertyDisplay
  )}`;

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="text-4xl font-bold tracking-tight">
          Analyse an Auction Property
        </h1>

        <p className="mt-4 text-lg text-slate-600">
          Use LotWise to analyse an auction property before you bid.
        </p>

        <div className="mt-10 flex flex-wrap gap-4 text-sm">
          <span className={stepClass(1)}>
            {step > 1 ? "✓" : "●"} Strategy
          </span>
          <span className={stepClass(2)}>
            {step > 2 ? "✓" : step === 2 ? "●" : "○"} Experience
          </span>
          <span className={stepClass(3)}>
            {step > 3 ? "✓" : step === 3 ? "●" : "○"} Property
          </span>
          <span
            className={
              step >= 4 ? "font-semibold text-slate-900" : "text-slate-400"
            }
          >
            {step === 5 ? "✓" : "●"} Analyse
          </span>
        </div>

        <div className="mt-12 rounded-xl border border-slate-200 p-8">
          {step === 1 && (
            <>
              <h2 className="text-2xl font-semibold">
                What is your strategy?
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  "Buy to Let",
                  "Refurb & Sell",
                  "Development / Conversion",
                  "Undecided",
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setStrategy(option as Strategy)}
                    className={`rounded-md border px-4 py-3 text-left ${
                      strategy === option
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!strategy}
                  className="rounded-md bg-black px-6 py-3 text-white disabled:opacity-40"
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-semibold">
                What is your experience with property?
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4">
                {[
                  "First-time auction buyer",
                  "Some property experience",
                  "Experienced investor",
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setExperience(option as Experience)}
                    className={`rounded-md border px-4 py-3 text-left ${
                      experience === option
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-md border border-slate-300 px-6 py-3"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!experience}
                  className="rounded-md bg-black px-6 py-3 text-white disabled:opacity-40"
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-2xl font-semibold">Property details</h2>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Property link
                  </label>
                  <input
                    type="url"
                    value={auctionLink}
                    onChange={(e) => setAuctionLink(e.target.value)}
                    placeholder="Paste property listing URL"
                    className="w-full rounded-md border border-slate-300 px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Property address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter property address"
                    className="w-full rounded-md border border-slate-300 px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Legal pack upload
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) =>
                      setLegalPackName(e.target.files?.[0]?.name || "")
                    }
                    className="w-full rounded-md border border-slate-300 px-4 py-3"
                  />
                  {legalPackName && (
                    <p className="mt-2 text-sm text-slate-500">
                      Selected: {legalPackName}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-md border border-slate-300 px-6 py-3"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={() => setStep(4)}
                  disabled={!auctionLink && !address && !legalPackName}
                  className="rounded-md bg-black px-6 py-3 text-white disabled:opacity-40"
                >
                  Analyse Property
                </button>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="text-2xl font-semibold">Analysing property...</h2>

              <div className="mt-6 space-y-4 text-slate-600">
                <p>✓ Identifying property details</p>
                <p>✓ Reviewing market indicators</p>
                <p>✓ Checking potential risks</p>
                <p>✓ Calculating LotWise Deal Score</p>
              </div>
            </>
          )}

          {step === 5 && (
            <div className="space-y-10">
              <div className="border-b border-slate-200 pb-8">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                  Analysis Report
                </p>

                <h2 className="mt-3 text-3xl font-bold">{propertyDisplay}</h2>

                <div className="mt-8 rounded-2xl bg-slate-50 p-8">
                  <p className="text-sm font-medium uppercase tracking-[0.15em] text-slate-500">
                    LotWise Deal Score
                  </p>

                  <div className="mt-4 flex items-end gap-4">
                    <span className={`text-6xl font-bold ${scoreColor}`}>
                      {score}
                    </span>
                    <span className="pb-2 text-2xl text-slate-400">/ 100</span>
                  </div>

                  <div className="mt-4 h-3 w-full rounded-full bg-slate-200">
                    <div
                      className="h-3 rounded-full bg-slate-900"
                      style={{ width: `${score}%` }}
                    />
                  </div>

                  <p className={`mt-4 text-lg font-semibold ${scoreColor}`}>
                    {scoreLabel}
                  </p>

                  <div className="mt-8 grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <p className="text-sm text-slate-500">Strategy Fit</p>
                      <p className="mt-2 text-2xl font-semibold">
                        {strategyFit} / 100
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        {strategy || "Undecided"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <p className="text-sm text-slate-500">
                        Investment Quality
                      </p>
                      <p className="mt-2 text-2xl font-semibold">
                        {investmentQuality} / 100
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        Guide price appears competitive.
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <p className="text-sm text-slate-500">Risk Level</p>
                      <p className="mt-2 text-2xl font-semibold">
                        {riskLevel} / 100
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        Medium legal and execution risk.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="text-xl font-semibold">Key Risks</h3>
                  <ul className="mt-4 space-y-3 text-sm text-slate-600">
                    <li>• Short lease may affect mortgage options</li>
                    <li>• Legal review recommended</li>
                    <li>• Budget carefully for works and timelines</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="text-xl font-semibold">Opportunities</h3>
                  <ul className="mt-4 space-y-3 text-sm text-slate-600">
                    <li>• Potential upside based on local demand</li>
                    <li>• Strong strategy fit for your selected route</li>
                    <li>• Good candidate for improvement works</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="text-xl font-semibold">Similar Deals Nearby</h3>
                  <div className="mt-4 space-y-4 text-sm text-slate-600">
                    <div className="rounded-lg bg-slate-50 p-4">
                      <p className="font-medium text-slate-900">
                        7 High Street
                      </p>
                      <p>Deal Score: 62</p>
                      <p>Strategy: Buy to Let</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-4">
                      <p className="font-medium text-slate-900">
                        22 Park Lane
                      </p>
                      <p>Deal Score: 71</p>
                      <p>Strategy: Refurb &amp; Sell</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="text-xl font-semibold">
                    Recommended Professionals
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm text-slate-600">
                    <li>• Solicitor experienced with property purchases</li>
                    <li>• Surveyor for condition review</li>
                    <li>• Builder for refurbishment pricing</li>
                    <li>• Mortgage broker for finance options</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-6">
                <h3 className="text-xl font-semibold">My Notes</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your notes about this deal..."
                  className="mt-4 min-h-[140px] w-full rounded-md border border-slate-300 px-4 py-3"
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href={requestHelpHref}
                  className="inline-block rounded-md bg-black px-6 py-3 text-white"
                >
                  Get Help With This Property
                </a>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="rounded-md border border-slate-300 px-6 py-3"
                >
                  Back
                </button>

                <button
                  type="button"
                  className="rounded-md bg-slate-800 px-6 py-3 text-white"
                >
                  Save Deal
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
