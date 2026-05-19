"use client";

import { useEffect, useMemo, useState } from "react";

type Strategy =
  | "First-Time Buyer / New Home"
  | "Buy to Let"
  | "Refurb & Sell"
  | "Development / Conversion"
  | "Undecided";

type Experience =
  | "First-time buyer"
  | "Some property experience"
  | "Experienced buyer / investor";

type ConditionLevel =
  | "Good condition"
  | "Needs updating"
  | "Full refurbishment";

type ExtractedProperty = {
  address: string;
  price: number | string;
  bedrooms: number | string;
  bathrooms: number | string;
  propertyType: string;
  description: string;
  images: string[];
  coordinates: { latitude: number; longitude: number } | null;
  title: string;
  url: string;
};

type SavedDeal = {
  id: string;
  address: string;
  property: string;
  strategy: string;
  score: number;
  price: number;
  verdict: string;
  savedAt: string;
};

export default function AnalysePage() {
  const [step, setStep] = useState(1);
  const [strategy, setStrategy] = useState<Strategy | "">("");
  const [experience, setExperience] = useState<Experience | "">("");
  const [property, setProperty] = useState("");
  const [address, setAddress] = useState("");
  const [legalPackName, setLegalPackName] = useState("");
  const [notes, setNotes] = useState("");

  const [loadingProperty, setLoadingProperty] = useState(false);
  const [propertyError, setPropertyError] = useState("");
  const [extractedProperty, setExtractedProperty] =
    useState<ExtractedProperty | null>(null);

  const [manualRent, setManualRent] = useState("");
  const [depositPercent, setDepositPercent] = useState(10);
  const [mortgageRate, setMortgageRate] = useState(4.9);
  const [mortgageTerm, setMortgageTerm] = useState(30);
  const [conditionLevel, setConditionLevel] =
    useState<ConditionLevel>("Needs updating");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const propertyFromUrl = params.get("property");

    if (!propertyFromUrl || property || address) return;

    setProperty(propertyFromUrl);

    const isLink = /^https?:\/\//i.test(propertyFromUrl);

    if (!isLink) {
      setAddress(propertyFromUrl);
      return;
    }

    const fetchProperty = async () => {
      try {
        setLoadingProperty(true);
        setPropertyError("");

        const response = await fetch("/api/analyse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: propertyFromUrl }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Failed to fetch property data");
        }

        setExtractedProperty(data);
        if (data.address) setAddress(data.address);
      } catch {
        setPropertyError("We couldn't auto-load this listing yet.");
      } finally {
        setLoadingProperty(false);
      }
    };

    fetchProperty();
  }, [property, address]);

  useEffect(() => {
    if (step === 4) {
      const timer = setTimeout(() => setStep(5), 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const stepClass = (stepNumber: number) =>
    step === stepNumber
      ? "font-semibold text-slate-900"
      : step > stepNumber
      ? "text-slate-500"
      : "text-slate-400";

  const formatPrice = (value: number | string | undefined) => {
    if (value === undefined || value === null || value === "") return "N/A";
    const numeric =
      typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));
    if (Number.isNaN(numeric)) return String(value);
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(numeric);
  };

  const bedroomCount = useMemo(() => {
    const parsed = Number(extractedProperty?.bedrooms);
    return Number.isNaN(parsed) ? 0 : parsed;
  }, [extractedProperty]);

  const numericPrice = useMemo(() => {
    const raw = extractedProperty?.price;
    const parsed =
      typeof raw === "number" ? raw : Number(String(raw ?? "").replace(/,/g, ""));
    return Number.isNaN(parsed) ? 0 : parsed;
  }, [extractedProperty]);

  const suggestedMonthlyRent = useMemo(() => {
    if (!bedroomCount) return 0;
    if (bedroomCount === 1) return 1100;
    if (bedroomCount === 2) return 1400;
    if (bedroomCount === 3) return 1700;
    return 2100;
  }, [bedroomCount]);

  const monthlyRent = useMemo(() => {
    const manual = Number(manualRent);
    if (!Number.isNaN(manual) && manual > 0) return manual;
    return suggestedMonthlyRent;
  }, [manualRent, suggestedMonthlyRent]);

  const annualRent = monthlyRent * 12;

  const grossYield = useMemo(() => {
    if (!numericPrice || !annualRent) return 0;
    return (annualRent / numericPrice) * 100;
  }, [annualRent, numericPrice]);

  const yieldLabel =
    grossYield >= 7 ? "Strong" : grossYield >= 5 ? "Moderate" : grossYield > 0 ? "Low" : "Unavailable";

  const baseRefurbRange = useMemo(() => {
    if (conditionLevel === "Good condition") return { low: 8000, high: 15000 };
    if (conditionLevel === "Needs updating") return { low: 20000, high: 40000 };
    return { low: 60000, high: 100000 };
  }, [conditionLevel]);

  const bedroomMultiplier =
    bedroomCount >= 4 ? 1.3 : bedroomCount === 3 ? 1.15 : 1;

  const refurbLow = Math.round(baseRefurbRange.low * bedroomMultiplier);
  const refurbHigh = Math.round(baseRefurbRange.high * bedroomMultiplier);

  const depositAmount = useMemo(() => {
    if (!numericPrice) return 0;
    return numericPrice * (depositPercent / 100);
  }, [numericPrice, depositPercent]);

  const mortgageNeeded = useMemo(() => {
    if (!numericPrice) return 0;
    return numericPrice - depositAmount;
  }, [numericPrice, depositAmount]);

  const estimatedMonthlyMortgage = useMemo(() => {
    if (!mortgageNeeded || !mortgageRate || !mortgageTerm) return 0;
    const monthlyRate = mortgageRate / 100 / 12;
    const months = mortgageTerm * 12;
    const payment =
      (mortgageNeeded * monthlyRate) /
      (1 - Math.pow(1 + monthlyRate, -months));
    return Number.isFinite(payment) ? payment : 0;
  }, [mortgageNeeded, mortgageRate, mortgageTerm]);

  const stampDutyEstimate = useMemo(() => {
    if (!numericPrice) return 0;

    if (strategy === "First-Time Buyer / New Home") {
      if (numericPrice <= 425000) return 0;
      return Math.max(0, (numericPrice - 425000) * 0.05);
    }

    if (numericPrice <= 250000) return 0;
    return (numericPrice - 250000) * 0.05;
  }, [numericPrice, strategy]);

  const showBuyToLetPanel = strategy === "Buy to Let";
  const showHomeBuyerPanel = strategy === "First-Time Buyer / New Home";

  const score = useMemo(() => {
    let base = 60;

    if (showBuyToLetPanel) {
      if (grossYield >= 7) base += 20;
      else if (grossYield >= 5) base += 10;
      else if (grossYield > 0) base -= 5;
    }

    if (conditionLevel === "Good condition") base += 8;
    if (conditionLevel === "Full refurbishment") base -= 8;

    if (showHomeBuyerPanel) {
      if (estimatedMonthlyMortgage && estimatedMonthlyMortgage < 1500) base += 12;
      else if (estimatedMonthlyMortgage > 2500) base -= 8;
    }

    return Math.max(25, Math.min(92, Math.round(base)));
  }, [showBuyToLetPanel, showHomeBuyerPanel, grossYield, conditionLevel, estimatedMonthlyMortgage]);

  const strategyFit = Math.min(95, Math.max(50, score + 4));
  const investmentQuality = Math.min(95, Math.max(45, score - 2));
  const riskLevel =
    conditionLevel === "Full refurbishment"
      ? 72
      : conditionLevel === "Needs updating"
      ? 55
      : 38;

  const scoreLabel =
    score >= 80
      ? "Excellent Opportunity"
      : score >= 70
      ? "Strong Deal"
      : score >= 55
      ? "Potential but Needs Work"
      : score >= 40
      ? "Risky"
      : "Avoid";

  const scoreColor =
    score >= 80
      ? "text-green-600"
      : score >= 70
      ? "text-green-500"
      : score >= 55
      ? "text-amber-500"
      : score >= 40
      ? "text-orange-500"
      : "text-red-600";

  const propertyDisplay =
    address || extractedProperty?.title || property || "Property Analysis";

  const requestHelpHref = `/request-help?property=${encodeURIComponent(propertyDisplay)}`;

  const buyToLetVerdict =
    grossYield >= 7
      ? "Strong Buy to Let Opportunity"
      : grossYield >= 5
      ? "Moderate Investment Opportunity"
      : grossYield > 0
      ? "Low Yield Investment"
      : "Yield unavailable";

  const homeBuyerVerdict =
    estimatedMonthlyMortgage < 1500
      ? "Comfortable Mortgage Range"
      : estimatedMonthlyMortgage < 2500
      ? "Manageable Mortgage Commitment"
      : estimatedMonthlyMortgage > 0
      ? "Higher Monthly Commitment"
      : "Mortgage estimate unavailable";

  const currentVerdict = showBuyToLetPanel
    ? buyToLetVerdict
    : showHomeBuyerPanel
    ? homeBuyerVerdict
    : scoreLabel;

  const handleSaveDeal = () => {
    if (typeof window === "undefined") return;

    const newDeal: SavedDeal = {
      id: crypto.randomUUID(),
      address: propertyDisplay,
      property,
      strategy: strategy || "Undecided",
      score,
      price: numericPrice,
      verdict: currentVerdict,
      savedAt: new Date().toISOString(),
    };

    const existingDeals: SavedDeal[] = JSON.parse(
      localStorage.getItem("lotwise_saved_deals") || "[]"
    );

    const updatedDeals = [newDeal, ...existingDeals];
    localStorage.setItem("lotwise_saved_deals", JSON.stringify(updatedDeals));

    window.location.href = "/saved-deals";
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="text-4xl font-bold tracking-tight">
          Should I Buy This Property?
        </h1>

        <p className="mt-4 text-lg text-slate-600">
          LotWise analyses any property and gives you a clear buying verdict.
        </p>

        {(property || loadingProperty || propertyError || extractedProperty) && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-slate-500">
              Property Input
            </p>

            <p className="mt-2 break-all text-sm text-slate-700">{property}</p>

            {loadingProperty && (
              <p className="mt-3 text-sm text-slate-500">
                Loading property details from listing...
              </p>
            )}

            {propertyError && (
              <p className="mt-3 text-sm text-red-600">{propertyError}</p>
            )}

            {extractedProperty && (
              <>
                {extractedProperty.images && extractedProperty.images.length > 0 && (
                  <div className="mt-5 space-y-3">
                    <img
                      src={extractedProperty.images[0]}
                      alt="Property"
                      className="h-[420px] w-full rounded-2xl object-cover"
                    />

                    <div className="grid grid-cols-4 gap-2">
                      {extractedProperty.images.slice(1, 5).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Property image ${index + 2}`}
                          className="h-24 w-full rounded-xl object-cover"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <InfoCard label="Detected Address" value={extractedProperty.address || "N/A"} />
                  <InfoCard label="Guide Price" value={formatPrice(extractedProperty.price)} />
                  <InfoCard label="Property Type" value={extractedProperty.propertyType || "N/A"} />
                  <InfoCard
                    label="Beds / Baths"
                    value={`${extractedProperty.bedrooms || "?"} bed • ${extractedProperty.bathrooms || "?"} bath`}
                  />
                </div>
              </>
            )}
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-4 text-sm">
          <span className={stepClass(1)}>{step > 1 ? "✓" : "●"} Strategy</span>
          <span className={stepClass(2)}>{step > 2 ? "✓" : step === 2 ? "●" : "○"} Experience</span>
          <span className={stepClass(3)}>{step > 3 ? "✓" : step === 3 ? "●" : "○"} Property</span>
          <span className={step >= 4 ? "font-semibold text-slate-900" : "text-slate-400"}>
            {step === 5 ? "✓" : "●"} Analyse
          </span>
        </div>

        <div className="mt-12 rounded-xl border border-slate-200 p-8">
          {step === 1 && (
            <>
              <h2 className="text-2xl font-semibold">What is your strategy?</h2>
              <p className="mt-3 text-slate-600">
                We’ll tailor the analysis and support based on what you’re trying to do with this property.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  "First-Time Buyer / New Home",
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

              <RenovationEstimator
                conditionLevel={conditionLevel}
                setConditionLevel={setConditionLevel}
                formatPrice={formatPrice}
                refurbLow={refurbLow}
                refurbHigh={refurbHigh}
              />

              {showHomeBuyerPanel && (
                <HomeBuyerPanel
                  mortgageRate={mortgageRate}
                  setMortgageRate={setMortgageRate}
                  depositPercent={depositPercent}
                  setDepositPercent={setDepositPercent}
                  mortgageTerm={mortgageTerm}
                  setMortgageTerm={setMortgageTerm}
                  estimatedMonthlyMortgage={estimatedMonthlyMortgage}
                  depositAmount={depositAmount}
                  stampDutyEstimate={stampDutyEstimate}
                  homeBuyerVerdict={homeBuyerVerdict}
                  formatPrice={formatPrice}
                  editable
                />
              )}

              {showBuyToLetPanel && (
                <BuyToLetPanel
                  manualRent={manualRent}
                  setManualRent={setManualRent}
                  suggestedMonthlyRent={suggestedMonthlyRent}
                  annualRent={annualRent}
                  grossYield={grossYield}
                  yieldLabel={yieldLabel}
                  buyToLetVerdict={buyToLetVerdict}
                  formatPrice={formatPrice}
                  editable
                />
              )}

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
              <h2 className="text-2xl font-semibold">What is your experience with property?</h2>

              <div className="mt-6 grid grid-cols-1 gap-4">
                {["First-time buyer", "Some property experience", "Experienced buyer / investor"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setExperience(option as Experience)}
                    className={`rounded-md border px-4 py-3 text-left ${
                      experience === option ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-between">
                <button type="button" onClick={() => setStep(1)} className="rounded-md border border-slate-300 px-6 py-3">
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
                <Input label="Property link" type="url" value={property} onChange={setProperty} placeholder="Paste property listing URL" />
                <Input label="Property address" type="text" value={address} onChange={setAddress} placeholder="Enter property address" />

                <div>
                  <label className="mb-2 block text-sm font-medium">Legal pack upload</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setLegalPackName(e.target.files?.[0]?.name || "")}
                    className="w-full rounded-md border border-slate-300 px-4 py-3"
                  />
                  {legalPackName && <p className="mt-2 text-sm text-slate-500">Selected: {legalPackName}</p>}
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button type="button" onClick={() => setStep(2)} className="rounded-md border border-slate-300 px-6 py-3">
                  Back
                </button>

                <button
                  type="button"
                  onClick={() => setStep(4)}
                  disabled={!property && !address && !legalPackName}
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
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Analysis Report</p>
                <h2 className="mt-3 text-3xl font-bold">{propertyDisplay}</h2>

                <div className="mt-8 rounded-2xl bg-slate-50 p-8">
                  <div className="mt-6 flex flex-col items-center text-center">
                    <p className="text-sm font-medium uppercase tracking-[0.15em] text-slate-500">
                      LotWise Deal Score
                    </p>

                    <div className="mt-6 relative flex h-48 w-48 items-center justify-center">
                      <svg className="h-48 w-48 -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                        <circle
                          cx="60"
                          cy="60"
                          r="52"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="10"
                          strokeLinecap="round"
                          className={scoreColor}
                          strokeDasharray={`${2 * Math.PI * 52}`}
                          strokeDashoffset={`${2 * Math.PI * 52 * (1 - score / 100)}`}
                        />
                      </svg>

                      <div className="absolute flex flex-col items-center">
                        <span className={`text-5xl font-bold ${scoreColor}`}>{score}</span>
                        <span className="text-sm text-slate-400">/ 100</span>
                      </div>
                    </div>

                    <p className={`mt-4 text-xl font-semibold ${scoreColor}`}>{scoreLabel}</p>
                  </div>

                  <div className="mt-8 grid gap-4 md:grid-cols-3">
                    <MetricCard label="Strategy Fit" value={`${strategyFit} / 100`} helper={strategy || "Undecided"} />
                    <MetricCard label="Investment Quality" value={`${investmentQuality} / 100`} helper="Guide price appears competitive." />
                    <MetricCard label="Risk Level" value={`${riskLevel} / 100`} helper="Based on condition and execution risk." />
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
                  <h3 className="text-xl font-semibold">Renovation Cost Estimate</h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <MetricCard label="Condition" value={conditionLevel} />
                    <MetricCard label="Low Estimate" value={formatPrice(refurbLow)} />
                    <MetricCard label="High Estimate" value={formatPrice(refurbHigh)} />
                  </div>
                </div>

                {showBuyToLetPanel && (
                  <BuyToLetPanel
                    annualRent={annualRent}
                    grossYield={grossYield}
                    yieldLabel={yieldLabel}
                    buyToLetVerdict={buyToLetVerdict}
                    formatPrice={formatPrice}
                    monthlyRent={monthlyRent}
                    refurbLow={refurbLow}
                    refurbHigh={refurbHigh}
                  />
                )}

                {showHomeBuyerPanel && (
                  <HomeBuyerPanel
                    mortgageRate={mortgageRate}
                    depositAmount={depositAmount}
                    stampDutyEstimate={stampDutyEstimate}
                    estimatedMonthlyMortgage={estimatedMonthlyMortgage}
                    homeBuyerVerdict={homeBuyerVerdict}
                    formatPrice={formatPrice}
                  />
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <ReportList title="Key Risks" items={["Short lease may affect mortgage options", "Legal review recommended", "Budget carefully for works and timelines"]} />
                <ReportList title="Opportunities" items={["Potential upside based on local demand", "Strong strategy fit for your selected route", "Good candidate for improvement works"]} />

                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="text-xl font-semibold">Comparable Sales</h3>
                  <div className="mt-4 space-y-4 text-sm text-slate-600">
                    {[
                      ["12 Oak Road", "£420,000"],
                      ["7 High Street", "£405,000"],
                      ["14 Park Lane", "£438,000"],
                    ].map(([addr, price]) => (
                      <div key={addr} className="rounded-lg bg-slate-50 p-4">
                        <p className="font-medium text-slate-900">{addr}</p>
                        <p>Recent sale: {price}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <ReportList title="Recommended Professionals" items={["Solicitor experienced with property purchases", "Surveyor for condition review", "Builder for refurbishment pricing", "Mortgage broker for finance options"]} />
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
                <a href={requestHelpHref} className="inline-block rounded-md bg-black px-6 py-3 text-white">
                  Get Help With This Property
                </a>

                <button type="button" onClick={() => setStep(3)} className="rounded-md border border-slate-300 px-6 py-3">
                  Back
                </button>

                <button type="button" onClick={handleSaveDeal} className="rounded-md bg-slate-800 px-6 py-3 text-white">
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

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-slate-900">{value}</p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
      {helper && <p className="mt-2 text-sm text-slate-600">{helper}</p>}
    </div>
  );
}

function Input({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-slate-300 px-4 py-3"
      />
    </div>
  );
}

function RenovationEstimator({
  conditionLevel,
  setConditionLevel,
  formatPrice,
  refurbLow,
  refurbHigh,
}: {
  conditionLevel: ConditionLevel;
  setConditionLevel: (value: ConditionLevel) => void;
  formatPrice: (value: number | string | undefined) => string;
  refurbLow: number;
  refurbHigh: number;
}) {
  return (
    <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm font-medium uppercase tracking-[0.15em] text-slate-500">
        Renovation Cost Estimator
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {["Good condition", "Needs updating", "Full refurbishment"].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setConditionLevel(option as ConditionLevel)}
            className={`rounded-md border px-4 py-3 text-left ${
              conditionLevel === option
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 bg-white"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <MetricCard label="Estimated Range" value={`${formatPrice(refurbLow)} – ${formatPrice(refurbHigh)}`} />
        <MetricCard label="Condition Assumption" value={conditionLevel} />
      </div>
    </div>
  );
}

function BuyToLetPanel({
  editable = false,
  manualRent = "",
  setManualRent,
  suggestedMonthlyRent = 0,
  monthlyRent,
  annualRent,
  grossYield,
  yieldLabel,
  buyToLetVerdict,
  formatPrice,
  refurbLow,
  refurbHigh,
}: {
  editable?: boolean;
  manualRent?: string;
  setManualRent?: (value: string) => void;
  suggestedMonthlyRent?: number;
  monthlyRent?: number;
  annualRent: number;
  grossYield: number;
  yieldLabel: string;
  buyToLetVerdict: string;
  formatPrice: (value: number | string | undefined) => string;
  refurbLow?: number;
  refurbHigh?: number;
}) {
  return (
    <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm font-medium uppercase tracking-[0.15em] text-slate-500">
        Quick Deal Analysis
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {editable ? (
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Monthly Rent</p>
            <input
              type="number"
              step="50"
              value={manualRent}
              onChange={(e) => setManualRent?.(e.target.value)}
              placeholder={String(suggestedMonthlyRent || "")}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </div>
        ) : (
          <MetricCard label="Monthly Rent" value={monthlyRent ? `${formatPrice(monthlyRent)}/mo` : "N/A"} />
        )}

        <MetricCard label="Annual Rent" value={annualRent ? formatPrice(annualRent) : "N/A"} />
        <MetricCard label="Gross Yield" value={grossYield ? `${grossYield.toFixed(1)}%` : "N/A"} />
        <MetricCard label="Yield Rating" value={yieldLabel} />
      </div>

      {refurbLow && refurbHigh && (
        <div className="mt-4">
          <MetricCard label="Refurb Cost" value={`${formatPrice(refurbLow)} – ${formatPrice(refurbHigh)}`} />
        </div>
      )}

      <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">LotWise Verdict</p>
        <p className="mt-1 text-xl font-semibold text-slate-900">{buyToLetVerdict}</p>
      </div>
    </div>
  );
}

function HomeBuyerPanel({
  editable = false,
  mortgageRate,
  setMortgageRate,
  depositPercent,
  setDepositPercent,
  mortgageTerm,
  setMortgageTerm,
  depositAmount,
  stampDutyEstimate,
  estimatedMonthlyMortgage,
  homeBuyerVerdict,
  formatPrice,
}: {
  editable?: boolean;
  mortgageRate: number;
  setMortgageRate?: (value: number) => void;
  depositPercent?: number;
  setDepositPercent?: (value: number) => void;
  mortgageTerm?: number;
  setMortgageTerm?: (value: number) => void;
  depositAmount?: number;
  stampDutyEstimate: number;
  estimatedMonthlyMortgage: number;
  homeBuyerVerdict: string;
  formatPrice: (value: number | string | undefined) => string;
}) {
  return (
    <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm font-medium uppercase tracking-[0.15em] text-slate-500">
        Home Buyer Snapshot
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {editable ? (
          <>
            <EditNumber label="Mortgage Rate" value={mortgageRate} step="0.1" onChange={(v) => setMortgageRate?.(v)} />
            <EditNumber label="Deposit %" value={depositPercent ?? 10} step="1" onChange={(v) => setDepositPercent?.(v)} />
            <EditNumber label="Mortgage Term" value={mortgageTerm ?? 30} step="1" onChange={(v) => setMortgageTerm?.(v)} />
          </>
        ) : (
          <>
            <MetricCard label="Mortgage Rate" value={`${mortgageRate.toFixed(1)}%`} />
            <MetricCard label="Deposit" value={formatPrice(depositAmount || 0)} />
            <MetricCard label="Stamp Duty" value={formatPrice(stampDutyEstimate)} />
          </>
        )}

        <MetricCard
          label="Est. Monthly Mortgage"
          value={estimatedMonthlyMortgage ? `${formatPrice(estimatedMonthlyMortgage)}/mo` : "N/A"}
        />
      </div>

      {editable && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <MetricCard label="Deposit Amount" value={formatPrice(depositAmount || 0)} />
          <MetricCard label="Stamp Duty Estimate" value={formatPrice(stampDutyEstimate)} />
        </div>
      )}

      <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">LotWise Verdict</p>
        <p className="mt-1 text-xl font-semibold text-slate-900">{homeBuyerVerdict}</p>
      </div>
    </div>
  );
}

function EditNumber({
  label,
  value,
  step,
  onChange,
}: {
  label: string;
  value: number;
  step: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
      />
    </div>
  );
}

function ReportList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-slate-200 p-6">
      <h3 className="text-xl font-semibold">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm text-slate-600">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
