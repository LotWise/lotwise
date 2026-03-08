export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-20">
        
        <h1 className="text-5xl font-bold">
          Stop making expensive mistakes at property auctions
        </h1>

        <p className="mt-6 text-lg text-slate-600 max-w-xl">
          LotWise helps buyers understand auction properties, review legal packs,
          and choose the right strategy before placing a bid.
        </p>

        <div className="mt-12 p-6 border rounded-xl bg-slate-50 max-w-md">

          <h2 className="text-2xl font-semibold">
            Join the LotWise waitlist
          </h2>

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
              className="border px-4 py-3 rounded-md"
            />

            <button
              type="submit"
              className="bg-black text-white px-6 py-3 rounded-md"
            >
              Join Waitlist
            </button>

          </form>

        </div>

      </section>
    </main>
  );
}
