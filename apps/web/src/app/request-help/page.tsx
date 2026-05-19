export default function RequestHelpPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-4xl font-bold tracking-tight">
          Get Help With This Property
        </h1>

        <p className="mt-4 text-lg text-slate-600">
          Tell us what help you need and LotWise will connect you with relevant professionals.
        </p>

        <form
          action="https://formspree.io/f/YOUR_FORMSPREE_ID"
          method="POST"
          className="mt-10 space-y-5 rounded-xl border border-slate-200 p-6"
        >
          <input
            name="name"
            placeholder="Your name"
            className="w-full rounded-md border border-slate-300 px-4 py-3"
          />

          <input
            name="email"
            type="email"
            placeholder="Your email"
            className="w-full rounded-md border border-slate-300 px-4 py-3"
          />

          <input
            name="property"
            placeholder="Property link or address"
            className="w-full rounded-md border border-slate-300 px-4 py-3"
          />

          <select
            name="helpNeeded"
            className="w-full rounded-md border border-slate-300 px-4 py-3"
          >
            <option value="">What help do you need?</option>
            <option>Mortgage broker</option>
            <option>Solicitor</option>
            <option>Surveyor</option>
            <option>Builder / renovation quote</option>
            <option>Architect / planning advice</option>
            <option>General buying advice</option>
          </select>

          <textarea
            name="message"
            placeholder="Tell us more..."
            className="min-h-[140px] w-full rounded-md border border-slate-300 px-4 py-3"
          />

          <button className="rounded-md bg-black px-6 py-3 text-white">
            Submit Request
          </button>
        </form>
      </section>
    </main>
  );
}
