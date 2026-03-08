export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-20">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
            LotWise
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Stop making expensive mistakes at property auctions
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            LotWise helps buyers understand auction properties, review legal packs,
            and choose the right strategy before placing a bid.
          </p>

          <div className="mt-10 flex gap-4">
            <button className="rounded-md bg-black px-6 py-3 text-white">
              Join Early Access
            </button>

            <button className="rounded-md border border-gray-300 px-6 py-3">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
