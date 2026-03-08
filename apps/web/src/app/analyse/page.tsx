"use client";

import { useState } from "react";

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

  const stepClass = (stepNumber: number) =>
    step === stepNumber
      ? "font-semibold text-slate-900"
      : step > stepNumber
      ? "text-slate-500"
      : "text-slate-400";

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-4xl px-6 py-20">
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
          <span className={stepClass(4)}>
            {step === 4 ? "●" : "○"} Analyse
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
                What is your experience with auction property?
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
                    Auction listing link
                  </label>
                  <input
                    type="url"
                    value={auctionLink}
                    onChange={(e) => setAuctionLink(e.target.value)}
                    placeholder="Paste auction listing URL"
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

              <div className="mt-6 space-y-3 text-slate-600">
                <p>✓ Identifying property details</p>
                <p>✓ Reviewing market indicators</p>
                <p>✓ Checking potential risks</p>
                <p>✓ Calculating LotWise Deal Score</p>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="rounded-md border border-slate-300 px-6 py-3"
                >
                  Back
                </button>

                <button
                  type="button"
                  className="rounded-md bg-black px-6 py-3 text-white"
                >
                  View Report
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
