"use client";

import { useEffect, useState } from "react";

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

export default function SavedDealsPage() {
  const [savedDeals, setSavedDeals] = useState<SavedDeal[]>([]);

  useEffect(() => {
    const deals = JSON.parse(
      localStorage.getItem("lotwise_saved_deals") || "[]"
    );
    setSavedDeals(deals);
  }, []);

  const formatPrice = (value: number) => {
    if (!value) return "N/A";
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const deleteDeal = (id: string) => {
    const updated = savedDeals.filter((deal) => deal.id !== id);
    setSavedDeals(updated);
    localStorage.setItem("lotwise_saved_deals", JSON.stringify(updated));
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Saved Deals</h1>
            <p className="mt-3 text-lg text-slate-600">
              Review and compare properties you’ve saved in LotWise.
            </p>
          </div>

          <a href="/analyse" className="rounded-md bg-black px-5 py-3 text-white">
            Analyse Another Property
          </a>
        </div>

        {savedDeals.length === 0 ? (
          <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-8">
            <p className="text-lg font-medium text-slate-900">
              No saved deals yet.
            </p>
            <p className="mt-2 text-slate-600">
              Analyse a property and click “Save Deal” to store it here.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6">
            {savedDeals.map((deal) => (
              <div
                key={deal.id}
                className="rounded-xl border border-slate-200 bg-white p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">
                      {deal.address}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Saved on {new Date(deal.savedAt).toLocaleString("en-GB")}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteDeal(deal.id)}
                    className="rounded-md border border-slate-300 px-4 py-2 text-sm"
                  >
                    Delete
                  </button>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-4">
                  <Card label="Strategy" value={deal.strategy} />
                  <Card label="Score" value={`${deal.score} / 100`} />
                  <Card label="Guide Price" value={formatPrice(deal.price)} />
                  <Card label="Verdict" value={deal.verdict} />
                </div>

                {deal.property && (
                  <div className="mt-4">
                    <p className="text-sm text-slate-500">Source</p>
                    <p className="mt-1 break-all text-sm text-slate-700">
                      {deal.property}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-900">{value}</p>
    </div>
  );
}
