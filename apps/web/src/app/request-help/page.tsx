export default function RequestHelp() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-3xl px-6 py-20">

        <h1 className="text-4xl font-bold">
          Get Help With This Property
        </h1>

        <p className="mt-4 text-lg text-slate-600">
          Request quotes from trusted professionals to help with your property purchase.
        </p>

        <form
          action="https://formspree.io/f/xdawkvre"
          method="POST"
          className="mt-10 flex flex-col gap-6"
        >

          <div>
            <label className="block text-sm font-medium mb-2">
              Property Address
            </label>
            <input
              type="text"
              name="property"
              placeholder="Enter property address"
              className="w-full rounded-md border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              What help do you need?
            </label>

            <div className="flex flex-col gap-2">

              <label>
                <input type="checkbox" name="service" value="Solicitor" /> Solicitor
              </label>

              <label>
                <input type="checkbox" name="service" value="Mortgage Broker" /> Mortgage Broker
              </label>

              <label>
                <input type="checkbox" name="service" value="Surveyor" /> Surveyor
              </label>

              <label>
                <input type="checkbox" name="service" value="Builder Quote" /> Builder Quote
              </label>

              <label>
                <input type="checkbox" name="service" value="Structural Engineer" /> Structural Engineer
              </label>

              <label>
                <input type="checkbox" name="service" value="Architect" /> Architect
              </label>

              <label>
                <input type="checkbox" name="service" value="Planning Consultant" /> Planning Consultant
              </label>

            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Your Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              className="w-full rounded-md border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Additional Details
            </label>
            <textarea
              name="message"
              placeholder="Tell us about the property or work needed"
              className="w-full rounded-md border border-slate-300 px-4 py-3"
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-black px-6 py-3 text-white"
          >
            Request Quotes
          </button>

        </form>

      </section>
    </main>
  );
}
