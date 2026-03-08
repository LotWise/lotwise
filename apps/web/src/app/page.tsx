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

          <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 max-w-md">
            <h2 className="text-2xl font-semibold">Join the LotWise waitlist</h2>
            <p className="mt-2 text-sm text-slate-600">
              Get early access when LotWise launches.
            </p>

            <form
              action="https://formspree.io/f/xdawkvre"
              method="POST"
              className="mt-6 flex flex-col gap-3"
            >
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
              />

              <button
                type="submit"
                className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white hover:bg-slate-800"
              >
                Join waitlist
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
