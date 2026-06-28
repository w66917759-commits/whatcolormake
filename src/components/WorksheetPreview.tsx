"use client";

const worksheetRows = [
  "Red + yellow = ______",
  "Yellow + blue = ______",
  "Blue + red = ______",
  "Red + white = ______",
  "Red + green = ______",
];

export function WorksheetPreview() {
  return (
    <section
      aria-labelledby="worksheet-title"
      className="rounded-[14px] border-2 border-stone-950 bg-white p-4 shadow-[4px_4px_0_#111827] sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-rose-700">
            Printable worksheet
          </p>
          <h2
            id="worksheet-title"
            className="mt-1 text-2xl font-black text-stone-950"
          >
            Predict the color
          </h2>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="print-hidden min-h-11 rounded-full bg-stone-950 px-5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#e11d48] focus:outline-none focus:ring-4 focus:ring-amber-300"
        >
          Print worksheet
        </button>
      </div>

      <div className="worksheet-sheet mt-5 rounded-[10px] border-2 border-stone-300 bg-white p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4 border-b-2 border-stone-200 pb-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-stone-500">
              Color Recipe Lab
            </p>
            <h3 className="mt-1 text-xl font-black text-stone-950">
              Predict: What color will these make?
            </h3>
          </div>
          <div className="h-10 w-10 shrink-0 rounded-full border-2 border-stone-950 bg-[conic-gradient(from_90deg,#ef4444,#facc15,#22c55e,#2563eb,#8b5cf6,#ef4444)]" />
        </div>

        <div className="mt-4 grid gap-2">
          {worksheetRows.map((row) => (
            <div
              key={row}
              className="rounded-[8px] border-2 border-stone-200 px-3 py-2 text-base font-bold text-stone-900"
            >
              {row}
            </div>
          ))}
        </div>

        <p className="mt-4 rounded-[8px] bg-amber-50 p-3 text-sm font-semibold text-stone-700">
          Bonus: Circle the mixes that use paint starter colors.
        </p>
      </div>
    </section>
  );
}
