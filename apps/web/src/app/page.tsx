export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-20">

        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
            LotWise
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Analyse any property deal
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Use LotWise to analyse property deals before you buy. Review risks,
            estimate refurb costs and understand the opportunity in seconds.
          </p>
        </div>

        <div className="mt-12 w-full max-w-xl">
          <form action="/analyse" method="GET" className="flex flex-col gap-4">

            <input
              type="text"
              name="property"
              placeholder="Paste Rightmove / Zoopla link or enter property address"
              className="w-full rounded-md border border-slate-300 px-5 py-4 text-lg outline-none focus:border-slate-500"
            />

            <button
              type="submit"
              className="rounded-md bg-black px-6 py-4 text-white font-medium hover:bg-slate-800"
            >
              Analyse Deal
            </button>

          </form>

          <p className="mt-4 text-sm text-slate-500">
            Works with Rightmove, Zoopla, auction listings or any property address.
          </p>
        </div>

      </section>
    </main>
  );
}
