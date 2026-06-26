"use client";

import { useMemo, useState } from "react";
import {
  mixColors,
  mixModes,
  paletteColors,
  type MixMode,
} from "@/lib/colorMixing";

const starterSets: Record<MixMode, string[]> = {
  paint: ["red", "yellow"],
  light: ["red", "green"],
  ink: ["magenta", "yellow"],
};

export function ColorMixer() {
  const [mode, setMode] = useState<MixMode>("paint");
  const [selected, setSelected] = useState<string[]>(starterSets.paint);

  const result = useMemo(() => mixColors(mode, selected), [mode, selected]);
  const selectedColors = selected
    .map((id) => paletteColors.find((color) => color.id === id))
    .filter(Boolean);

  function chooseMode(nextMode: MixMode) {
    setMode(nextMode);
    setSelected(starterSets[nextMode]);
  }

  function toggleColor(id: string) {
    setSelected((current) => {
      if (current.includes(id)) {
        return current.filter((colorId) => colorId !== id);
      }

      if (current.length >= 3) {
        return [...current.slice(1), id];
      }

      return [...current, id];
    });
  }

  return (
    <section
      id="mixer"
      aria-labelledby="mixer-title"
      className="rounded-lg border border-slate-200 bg-white p-4 sm:p-6"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div>
          <h2
            id="mixer-title"
            className="text-2xl font-bold text-slate-950"
          >
            Interactive mixer
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Pick up to three colors and switch modes to compare the result.
          </p>

          <div className="mt-5 grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1">
            {mixModes.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={mode === item.id}
                onClick={() => chooseMode(item.id)}
                className={`min-h-11 rounded-md px-2 text-sm font-semibold transition ${
                  mode === item.id
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-700 hover:bg-white focus:bg-white"
                }`}
              >
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.shortLabel}</span>
              </button>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-2 xl:grid-cols-5">
            {paletteColors.map((color) => {
              const isActive = selected.includes(color.id);
              const isLight = color.id === "white" || color.id === "yellow";

              return (
                <button
                  key={color.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => toggleColor(color.id)}
                  className={`min-h-12 rounded-md border px-3 py-2 text-left transition focus:outline-none focus:ring-4 focus:ring-blue-200 ${
                    isActive
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-200 bg-white text-slate-900"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`mr-2 inline-block h-4 w-4 rounded-full border align-[-2px] ${
                      isLight ? "border-slate-300" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-sm font-semibold">{color.name}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setSelected([])}
            className="mt-4 min-h-11 rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            Reset bowl
          </button>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div
            className="flex min-h-10 flex-wrap gap-2"
            aria-label="Selected colors"
          >
            {selectedColors.length > 0 ? (
              selectedColors.map((color) => (
                <span
                  key={color!.id}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-800"
                >
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 rounded-full border border-slate-200"
                    style={{ backgroundColor: color!.hex }}
                  />
                  {color!.name}
                </span>
              ))
            ) : (
              <span className="inline-flex items-center rounded-full border border-dashed border-slate-300 px-3 py-2 text-sm font-semibold text-slate-500">
                Empty bowl
              </span>
            )}
          </div>

          <div
            className="mt-4 grid aspect-[4/3] w-full place-items-center rounded-lg border border-slate-200 text-center"
            style={{
              backgroundColor: result.hex,
            }}
          >
            <div className="rounded-md bg-white/90 px-4 py-3">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Result
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-950">
                {result.name}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
            <p className="font-semibold text-slate-950" aria-live="polite">
              {result.explanation}
            </p>
            <p className="mt-2 text-sm text-blue-700">
              Try this: {result.tryThis}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
