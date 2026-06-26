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
      id="worksheet"
      aria-labelledby="worksheet-title"
      className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-rose-700">
            Printable worksheet
          </p>
          <h2
            id="worksheet-title"
            className="mt-1 text-2xl font-bold text-slate-950"
          >
            Predict the color
          </h2>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="print-hidden min-h-11 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
        >
          Print worksheet
        </button>
      </div>

      <div className="worksheet-sheet mt-5 rounded-lg border border-slate-300 bg-white p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">
              Color Recipe Lab
            </p>
            <h3 className="mt-1 text-xl font-bold text-slate-950">
              Predict: What color will these make?
            </h3>
          </div>
          <div className="h-10 w-10 shrink-0 rounded-full bg-[conic-gradient(from_90deg,#ef4444,#facc15,#22c55e,#2563eb,#8b5cf6,#ef4444)]" />
        </div>

        <div className="mt-4 grid gap-2">
          {worksheetRows.map((row) => (
            <div
              key={row}
              className="rounded-md border border-slate-200 px-3 py-2 text-base font-semibold text-slate-900"
            >
              {row}
            </div>
          ))}
        </div>

        <p className="mt-4 rounded-md bg-yellow-50 p-3 text-sm text-slate-700">
          Bonus: Circle the mixes that use paint starter colors.
        </p>
      </div>
    </section>
  );
}
