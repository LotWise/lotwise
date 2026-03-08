export default function AnalysePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-4xl px-6 py-20">
        <h1 className="text-4xl font-bold tracking-tight">
          Analyse an Auction Property
        </h1>

        <p className="mt-4 text-lg text-slate-600">
          Use LotWise to analyse an auction property before you bid.
        </p>

        <div className="mt-12 rounded-xl border border-slate-200 p-8">
          <div className="mb-6 text-sm text-slate-500">
            ● Strategy ○ Experience ○ Property ○ Analyse
          </div>

          <h2 className="text-2xl font-semibold">
            What is your strategy?
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="rounded-md border px-4 py-3">
              Buy to Let
            </button>

            <button className="rounded-md border px-4 py-3">
              Refurb &amp; Sell
            </button>

            <button className="rounded-md border px-4 py-3">
              Development / Conversion
            </button>

            <button className="rounded-md border px-4 py-3">
              Undecided
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
