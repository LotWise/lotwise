"use client";

import { useEffect, useState } from "react";

type SavedDeal = {
  id: string;
  title?: string;
  address: string;
  property: string;
  strategy: string;
  score: number;
  price: number;
  verdict: string;
  savedAt: string;
  image?: string;
  bedrooms?: number | string;
  bathrooms?: number | string;
  propertyType?: string;
  notes?: string;
  status?: string;
};

const statuses = [
  "Researching",
  "Viewing Booked",
  "Offer Submitted",
  "Under Offer",
  "Rejected",
  "Purchased",
];

function getDisplayTitle(deal: SavedDeal) {
  if (deal.title && !deal.title.startsWith("http")) return deal.title;
  if (deal.address && !deal.address.startsWith("http")) return deal.address;

  try {
    const url = new URL(deal.property || deal.address);
    const propertyId = url.pathname.split("/").filter(Boolean).pop();
    return propertyId ? `Rightmove Property ${propertyId}` : "Saved Property";
  } catch {
    return "Saved Property";
  }
}

export default function SavedDealsPage() {
  const [savedDeals, setSavedDeals] = useState<SavedDeal[]>([]);

  useEffect(() => {
    const deals = JSON.parse(
      localStorage.getItem("lotwise_saved_deals") || "[]"
    );
    setSavedDeals(deals);
  }, []);

  const saveDeals = (deals: SavedDeal[]) => {
    setSavedDeals(deals);
    localStorage.setItem("lotwise_saved_deals", JSON.stringify(deals));
  };

  const formatPrice = (value: number) => {
    if (!value) return "N/A";
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const deleteDeal = (id: string) => {
    saveDeals(savedDeals.filter((deal) => deal.id !== id));
  };

  const updateDeal = (id: string, updates: Partial<SavedDeal>) => {
    saveDeals(
      savedDeals.map((deal) =>
        deal.id === id ? { ...deal, ...updates } : deal
      )
    );
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Saved Deals</h1>
            <p className="mt-3 text-lg text-slate-600">
              Review, compare and track properties you’ve saved in LotWise.
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
            {savedDeals.map((deal) => {
              const title = getDisplayTitle(deal);

              return (
                <div
                  key={deal.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <div className="grid gap-0 md:grid-cols-[280px_1fr]">
                    <div className="bg-slate-100">
                      {deal.image ? (
                        <img
                          src={deal.image}
                          alt={title}
                          className="h-full min-h-[220px] w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full min-h-[220px] items-center justify-center p-6 text-center text-sm text-slate-500">
                          No image saved yet
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
                              {deal.strategy}
                            </span>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                              {deal.status || "Researching"}
                            </span>
                          </div>

                          <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                            {title}
                          </h2>

                          <p className="mt-2 text-sm text-slate-500">
                            Saved on {new Date(deal.savedAt).toLocaleString("en-GB")}
                          </p>

                          {(deal.bedrooms || deal.propertyType) && (
                            <p className="mt-2 text-sm text-slate-600">
                              {deal.propertyType || "Property"}{" "}
                              {deal.bedrooms ? `• ${deal.bedrooms} bed` : ""}
                              {deal.bathrooms ? ` • ${deal.bathrooms} bath` : ""}
                            </p>
                          )}
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
                        <Card label="Score" value={`${deal.score} / 100`} />
                        <Card label="Guide Price" value={formatPrice(deal.price)} />
                        <Card label="Verdict" value={deal.verdict} />

                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                          <p className="text-sm text-slate-500">Status</p>
                          <select
                            value={deal.status || "Researching"}
                            onChange={(e) =>
                              updateDeal(deal.id, { status: e.target.value })
                            }
                            className="mt-2 w-full rounded-md border border-slate-300 bg-white px-2 py-2 text-sm"
                          >
                            {statuses.map((status) => (
                              <option key={status}>{status}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mt-5">
                        <p className="text-sm font-medium text-slate-700">Deal Notes</p>
                        <textarea
                          value={deal.notes || ""}
                          onChange={(e) =>
                            updateDeal(deal.id, { notes: e.target.value })
                          }
                          placeholder="Add notes about viewing, risks, offer price, refurb works..."
                          className="mt-2 min-h-[90px] w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                        />
                      </div>

                      {deal.property && (
                        <div className="mt-4">
                          <p className="text-sm text-slate-500">Source</p>
                          <a
                            href={deal.property}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 block break-all text-sm text-slate-700 underline"
                          >
                            Open original listing
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
