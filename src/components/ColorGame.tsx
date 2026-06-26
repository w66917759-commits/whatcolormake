"use client";

import { useMemo, useState } from "react";
import {
  mixColors,
  mixModes,
  paletteColors,
  type MixMode,
  type PaletteColor,
} from "@/lib/colorMixing";

type Challenge = {
  id: string;
  title: string;
  targetName: string;
  targetHex: string;
  mode: MixMode;
  answerIds: string[];
  clue: string;
  lesson: string;
};

type Feedback = {
  title: string;
  body: string;
  match: number;
  points: number;
  passed: boolean;
  nextStreak: number;
};

const challenges: Challenge[] = [
  {
    id: "paint-orange",
    title: "Catch the orange flash",
    targetName: "Orange",
    targetHex: "#f97316",
    mode: "paint",
    answerIds: ["red", "yellow"],
    clue: "Warm it up with two starter paints.",
    lesson: "Red and yellow make orange in paint.",
  },
  {
    id: "paint-green",
    title: "Grow a clean green",
    targetName: "Green",
    targetHex: "#22c55e",
    mode: "paint",
    answerIds: ["yellow", "blue"],
    clue: "One bright paint meets one cool paint.",
    lesson: "Yellow and blue make green in paint.",
  },
  {
    id: "paint-purple",
    title: "Unlock the purple gate",
    targetName: "Purple",
    targetHex: "#7c3aed",
    mode: "paint",
    answerIds: ["red", "blue"],
    clue: "Try the warm primary with the deepest cool primary.",
    lesson: "Red and blue make purple in paint.",
  },
  {
    id: "paint-pink",
    title: "Soften red into pink",
    targetName: "Pink",
    targetHex: "#fb7185",
    mode: "paint",
    answerIds: ["red", "white"],
    clue: "A tint needs one color plus white.",
    lesson: "White turns red paint into pink.",
  },
  {
    id: "light-cyan",
    title: "Fire up cyan light",
    targetName: "Cyan light",
    targetHex: "#22d3ee",
    mode: "light",
    answerIds: ["green", "blue"],
    clue: "Additive color gets brighter when lights stack.",
    lesson: "Green and blue light make cyan light.",
  },
  {
    id: "light-white",
    title: "Build the white beam",
    targetName: "White light",
    targetHex: "#ffffff",
    mode: "light",
    answerIds: ["red", "green", "blue"],
    clue: "White light needs the full RGB trio.",
    lesson: "Red, green, and blue light make white light.",
  },
  {
    id: "ink-blue",
    title: "Print a blue badge",
    targetName: "Blue",
    targetHex: "#2563eb",
    mode: "ink",
    answerIds: ["cyan", "magenta"],
    clue: "Printer ink starts from CMY, not red-yellow-blue.",
    lesson: "Cyan and magenta ink can make blue.",
  },
];

const colorNames = new Map(paletteColors.map((color) => [color.id, color.name]));
const colorById = new Map(paletteColors.map((color) => [color.id, color]));

export function ColorGame() {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [splashKey, setSplashKey] = useState(0);
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => new Set());

  const challenge = challenges[challengeIndex];
  const modeLabel = getModeLabel(challenge.mode);

  const result = useMemo(
    () => mixColors(challenge.mode, selected),
    [challenge.mode, selected],
  );

  const previewMatch = useMemo(() => {
    if (selected.length === 0) {
      return 0;
    }

    const exact = isSameSet(selected, challenge.answerIds);
    return exact ? 100 : getColorMatch(result.hex, challenge.targetHex);
  }, [challenge.answerIds, challenge.targetHex, result.hex, selected]);

  const selectedColors = selected
    .map((id) => colorById.get(id))
    .filter((color): color is PaletteColor => Boolean(color));
  const matchMessage = getMatchMessage(previewMatch);
  const helperLine = getHelperLine(challenge, selected, result.name, previewMatch);
  const isClose = selected.length > 0 && previewMatch >= 61;
  const shouldShake = Boolean(
    feedback && !feedback.passed && feedback.match > 0 && feedback.match <= 60,
  );

  function chooseChallenge(index: number) {
    setChallengeIndex(index);
    setSelected([]);
    setFeedback(null);
    setShowHint(false);
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
    setSplashKey((current) => current + 1);
    setFeedback(null);
  }

  function checkMix() {
    if (selected.length === 0) {
      setFeedback({
        title: "Drop paint first",
        body: "Drop paint into the pot, then try to catch the flash.",
        match: 0,
        points: 0,
        passed: false,
        nextStreak: streak,
      });
      return;
    }

    const exact = isSameSet(selected, challenge.answerIds);
    const match = exact ? 100 : previewMatch;
    const passed = match >= 88;
    const nextStreak = passed ? streak + 1 : 0;
    const points = passed ? 100 : Math.max(5, Math.round(match / 10));

    setScore((current) => current + points);
    setAttempts((current) => current + 1);
    setStreak(nextStreak);

    if (passed) {
      setCompletedIds((current) => new Set(current).add(challenge.id));
    }

    setFeedback({
      title: passed ? "Caught!" : match >= 61 ? "So close!" : "Good start",
      body: passed ? challenge.lesson : getHelperLine(challenge, selected, result.name, match),
      match,
      points,
      passed,
      nextStreak,
    });
  }

  function nextChallenge() {
    setChallengeIndex((current) => (current + 1) % challenges.length);
    setSelected([]);
    setFeedback(null);
    setShowHint(false);
  }

  function resetRound() {
    setSelected([]);
    setFeedback(null);
    setShowHint(false);
    setSplashKey((current) => current + 1);
  }

  return (
    <section
      id="game"
      aria-labelledby="game-title"
      className="color-game-shell relative overflow-hidden px-4 py-5 sm:px-6 lg:px-8 lg:py-8"
    >
      <div aria-hidden="true" className="color-game-ribbon" />

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="game-frame rounded-[22px] border-2 border-stone-950 bg-white/92 p-3 shadow-[8px_8px_0_#111827] sm:p-4 lg:p-5">
          <GameHud
            modeLabel={modeLabel}
            score={score}
            streak={streak}
            round={challengeIndex + 1}
            totalRounds={challenges.length}
            onNext={nextChallenge}
          />

          <div className="catch-game-grid mt-4">
            <ColorFlashCard
              name={challenge.targetName}
              hex={challenge.targetHex}
              title={challenge.title}
            />

            <PaintPot
              resultName={result.name}
              resultHex={result.hex}
              selectedColors={selectedColors}
              splashKey={splashKey}
              shouldShake={shouldShake}
            />

            <CatchMeter
              match={previewMatch}
              message={matchMessage}
              helperLine={helperLine}
              isClose={isClose}
            />

            <PaintDropPicker selected={selected} onToggle={toggleColor} />

            <div className="game-actions grid gap-2 sm:grid-cols-[1fr_auto_auto]">
              <button
                type="button"
                onClick={checkMix}
                className="min-h-14 rounded-full bg-stone-950 px-6 text-base font-black text-white transition hover:-translate-y-0.5 hover:bg-stone-800 hover:shadow-[0_6px_0_#facc15] focus:outline-none focus:ring-4 focus:ring-amber-300"
              >
                Catch It!
              </button>
              <button
                type="button"
                onClick={() => setShowHint((current) => !current)}
                className="min-h-12 rounded-full border border-amber-300 bg-amber-100 px-5 text-sm font-black text-stone-950 transition hover:-translate-y-0.5 hover:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-200"
              >
                Hint
              </button>
              <button
                type="button"
                onClick={resetRound}
                className="min-h-12 rounded-full border border-sky-200 bg-sky-50 px-5 text-sm font-black text-sky-950 transition hover:-translate-y-0.5 hover:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-200"
              >
                Spill Bowl
              </button>
            </div>

            <div className="game-message-panel">
              {feedback?.passed ? (
                <SuccessCard
                  challenge={challenge}
                  points={feedback.points}
                  streak={feedback.nextStreak}
                  onNext={nextChallenge}
                />
              ) : (
                <HintPanel
                  showHint={showHint}
                  clue={challenge.clue}
                  feedback={feedback}
                  attempts={attempts}
                />
              )}
            </div>

            <ColorTrail
              challenges={challenges}
              activeIndex={challengeIndex}
              completedIds={completedIds}
              onChoose={chooseChallenge}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function GameHud({
  modeLabel,
  score,
  streak,
  round,
  totalRounds,
  onNext,
}: {
  modeLabel: string;
  score: number;
  streak: number;
  round: number;
  totalRounds: number;
  onNext: () => void;
}) {
  return (
    <div className="game-hud rounded-[18px] bg-[#fff7dd] p-3 sm:p-4">
      <div className="min-w-0">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-rose-700">
          {modeLabel}
        </p>
        <h1
          id="game-title"
          className="mt-1 text-2xl font-black leading-none text-stone-950 sm:text-3xl"
        >
          Catch the Color Flash
        </h1>
      </div>
      <div className="hud-pills">
        <HudPill label="Score" value={score.toString()} />
        <HudPill label="Streak" value={`${streak}x`} />
        <HudPill label="Round" value={`${round}/${totalRounds}`} />
        <button
          type="button"
          onClick={onNext}
          className="hud-next min-h-11 rounded-full bg-white px-4 text-sm font-black text-stone-950 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-amber-300"
        >
          Next Flash
        </button>
      </div>
    </div>
  );
}

function HudPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="hud-pill min-w-0 rounded-full bg-white px-3 py-2 shadow-sm">
      <p className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-stone-500">
        {label}
      </p>
      <p className="text-lg font-black leading-none text-stone-950">{value}</p>
    </div>
  );
}

function ColorFlashCard({
  name,
  hex,
  title,
}: {
  name: string;
  hex: string;
  title: string;
}) {
  return (
    <div className="color-flash-card game-card">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-rose-700">
          Color Flash
        </p>
        <p className="min-w-0 truncate font-mono text-xs font-bold text-stone-500">
          {hex}
        </p>
      </div>

      <div className="flash-creature-stage mt-4">
        <div className="flash-speech">Catch me!</div>
        <div
          className="color-flash-blob"
          role="img"
          aria-label={`${formatFlashName(name)} Color Flash`}
          style={{ backgroundColor: hex }}
        >
          <span aria-hidden="true" className="flash-eye flash-eye-left" />
          <span aria-hidden="true" className="flash-eye flash-eye-right" />
          <span aria-hidden="true" className="flash-smile" />
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-2xl font-black leading-tight text-stone-950">
          {formatFlashName(name)} Flash
        </h2>
        <p className="mt-1 text-sm font-bold leading-6 text-stone-600">
          {title}
        </p>
      </div>
    </div>
  );
}

function PaintPot({
  resultName,
  resultHex,
  selectedColors,
  splashKey,
  shouldShake,
}: {
  resultName: string;
  resultHex: string;
  selectedColors: PaletteColor[];
  splashKey: number;
  shouldShake: boolean;
}) {
  const isEmpty = selectedColors.length === 0;

  return (
    <div className={`paint-pot-card game-card ${shouldShake ? "is-shaking" : ""}`}>
      <div className="flex min-w-0 items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-sky-700">
          Paint Pot
        </p>
        <p className="min-w-0 truncate font-mono text-xs font-bold text-stone-500">
          {resultHex}
        </p>
      </div>

      <div className="paint-pot-scene mt-4" aria-live="polite">
        <div className="mixing-bowl">
          <div aria-hidden="true" className="bowl-rim" />
          <div className="bowl-body">
            <div className="bowl-liquid" style={{ backgroundColor: resultHex }}>
              {!isEmpty && <span key={splashKey} aria-hidden="true" className="paint-splash" />}
              <div className="selected-paint-drops" aria-label="Selected paint drops">
                {selectedColors.map((color, index) => (
                  <span
                    key={`${color.id}-${index}`}
                    className="selected-paint-drop"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
              <span className="paint-pot-label">
                {isEmpty ? "Drop paint into the pot!" : resultName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CatchMeter({
  match,
  message,
  helperLine,
  isClose,
}: {
  match: number;
  message: string;
  helperLine: string;
  isClose: boolean;
}) {
  return (
    <div className={`catch-meter game-card ${isClose ? "is-close" : ""}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">
          Catch Meter
        </p>
        <p className="text-2xl font-black text-stone-950" aria-live="polite">
          {match}%
        </p>
      </div>
      <div className="mt-3 h-5 overflow-hidden rounded-full bg-stone-100">
        <div
          className="catch-meter-fill h-full rounded-full transition-[width] duration-500"
          style={{ width: `${match}%` }}
        />
      </div>
      <p className="mt-3 text-base font-black text-stone-950" aria-live="polite">
        {message}
      </p>
      <p className="mt-1 text-sm font-semibold leading-6 text-stone-600">
        {helperLine}
      </p>
    </div>
  );
}

function PaintDropPicker({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="paint-drop-panel game-card">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-700">
        Paint Drops
      </p>
      <div className="paint-drops-grid mt-3">
        {paletteColors.map((color) => {
          const isActive = selected.includes(color.id);
          const isLight = color.id === "white" || color.id === "yellow";

          return (
            <button
              key={color.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onToggle(color.id)}
              className={`paint-drop-button min-h-24 rounded-[18px] px-2 py-3 text-center transition focus:outline-none focus:ring-4 focus:ring-amber-300 ${
                isActive
                  ? "is-selected bg-[#fff4bf] text-stone-950 shadow-[0_7px_0_#111827]"
                  : "bg-white text-stone-800 shadow-sm hover:-translate-y-0.5 hover:shadow-md"
              }`}
            >
              <span
                aria-hidden="true"
                className={`paint-drop-swatch ${isLight ? "is-light" : ""}`}
                style={{ backgroundColor: color.hex }}
              />
              <span className="mt-2 block text-sm font-black">{color.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function HintPanel({
  showHint,
  clue,
  feedback,
  attempts,
}: {
  showHint: boolean;
  clue: string;
  feedback: Feedback | null;
  attempts: number;
}) {
  if (!showHint && !feedback) {
    return (
      <div className="hint-card rounded-[18px] bg-white/80 p-4">
        <p className="text-sm font-bold text-stone-600">
          Tap paint drops, watch the Paint Pot change, then press Catch It!
        </p>
      </div>
    );
  }

  return (
    <div className="hint-card rounded-[18px] bg-white p-4 shadow-sm" aria-live="polite">
      {feedback ? (
        <>
          <div className="flex items-center justify-between gap-3">
            <p className="text-base font-black text-stone-950">{feedback.title}</p>
            <p className="text-sm font-black text-stone-600">
              +{feedback.points} pts
            </p>
          </div>
          <p className="mt-2 text-sm font-semibold leading-6 text-stone-700">
            {feedback.body}
          </p>
        </>
      ) : (
        <>
          <p className="text-base font-black text-stone-950">Hint</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-stone-700">
            {clue}
          </p>
        </>
      )}
      <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-stone-400">
        Tries: {attempts}
      </p>
    </div>
  );
}

function SuccessCard({
  challenge,
  points,
  streak,
  onNext,
}: {
  challenge: Challenge;
  points: number;
  streak: number;
  onNext: () => void;
}) {
  return (
    <div className="success-card relative overflow-hidden rounded-[20px] bg-emerald-50 p-4 shadow-sm">
      <div aria-hidden="true" className="confetti-pop">
        {["#ef4444", "#f97316", "#facc15", "#22c55e", "#06b6d4", "#8b5cf6"].map(
          (color, index) => (
            <span
              key={`${color}-${index}`}
              style={{
                backgroundColor: color,
                transform: `rotate(${index * 28}deg)`,
              }}
            />
          ),
        )}
      </div>
      <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">
        Caught!
      </p>
      <h3 className="mt-1 text-xl font-black leading-tight text-stone-950">
        You caught the {formatFlashName(challenge.targetName)} Flash!
      </h3>
      <p className="mt-2 text-sm font-bold text-stone-700">
        {formatRecipe(challenge.answerIds, challenge.targetName)}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-stone-950">
          +{points} points
        </span>
        <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-stone-950">
          Streak x{streak}
        </span>
      </div>
      <button
        type="button"
        onClick={onNext}
        className="mt-4 min-h-12 rounded-full bg-stone-950 px-5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-stone-800 focus:outline-none focus:ring-4 focus:ring-emerald-300"
      >
        Next Flash
      </button>
    </div>
  );
}

function ColorTrail({
  challenges,
  activeIndex,
  completedIds,
  onChoose,
}: {
  challenges: Challenge[];
  activeIndex: number;
  completedIds: Set<string>;
  onChoose: (index: number) => void;
}) {
  return (
    <div className="color-trail game-card">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-stone-500">
          Color Trail
        </p>
        <p className="text-xs font-bold text-stone-500">7 flashes</p>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-2" aria-label="Color Trail for 7 rounds">
        {challenges.map((item, index) => {
          const isActive = index === activeIndex;
          const isComplete = completedIds.has(item.id);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChoose(index)}
              aria-pressed={isActive}
              className={`trail-dot min-h-11 rounded-full text-xs font-black transition focus:outline-none focus:ring-4 focus:ring-amber-300 ${
                isActive ? "is-active" : ""
              } ${isComplete ? "is-complete" : ""}`}
              style={{ backgroundColor: item.targetHex }}
            >
              <span className="sr-only">
                Round {index + 1}: {item.targetName}
              </span>
              <span aria-hidden="true">{isComplete ? "✓" : index + 1}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function getModeLabel(mode: MixMode) {
  if (mode === "paint") {
    return "Paint Lab";
  }

  return mixModes.find((item) => item.id === mode)?.label ?? "Paint Lab";
}

function getMatchMessage(match: number) {
  if (match <= 30) {
    return "Not close yet.";
  }

  if (match <= 60) {
    return "Getting warmer!";
  }

  if (match <= 85) {
    return "So close!";
  }

  if (match <= 99) {
    return "Almost caught!";
  }

  return "Caught!";
}

function getHelperLine(
  challenge: Challenge,
  selected: string[],
  resultName: string,
  match: number,
) {
  if (selected.length === 0) {
    return challenge.clue;
  }

  const missing = challenge.answerIds.filter((id) => !selected.includes(id));
  const extra = selected.find((id) => !challenge.answerIds.includes(id));
  const hasUnwantedBlack =
    selected.includes("black") && !challenge.answerIds.includes("black");

  if (hasUnwantedBlack) {
    return "Too dark. Try fewer dark colors.";
  }

  if (
    resultName.toLowerCase().includes("muddy") ||
    (selected.length >= 3 && missing.length > 0)
  ) {
    return "Too muddy. Try starting with fewer paints.";
  }

  if (missing.length > 0) {
    return `Good start. Try adding ${formatColorName(missing[0])}.`;
  }

  if (extra) {
    return `Nice color. Try spilling ${formatColorName(extra)} out of the bowl.`;
  }

  if (match >= 86) {
    return "The flash is right there. Press Catch It!";
  }

  return challenge.clue;
}

function formatRecipe(answerIds: string[], targetName: string) {
  return `${answerIds.map((id) => formatColorName(id, true)).join(" + ")} = ${formatFlashName(targetName)}`;
}

function formatColorName(id: string, titleCase = false) {
  const name = colorNames.get(id) ?? id;
  return titleCase ? name : name.toLowerCase();
}

function formatFlashName(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function isSameSet(first: string[], second: string[]) {
  if (first.length !== second.length) {
    return false;
  }

  const sortedFirst = [...first].sort();
  const sortedSecond = [...second].sort();

  return sortedFirst.every((id, index) => id === sortedSecond[index]);
}

function getColorMatch(firstHex: string, secondHex: string) {
  const first = hexToRgb(firstHex);
  const second = hexToRgb(secondHex);
  const distance = Math.sqrt(
    (first[0] - second[0]) ** 2 +
      (first[1] - second[1]) ** 2 +
      (first[2] - second[2]) ** 2,
  );
  const maxDistance = Math.sqrt(255 ** 2 * 3);

  return Math.max(0, Math.round((1 - distance / maxDistance) * 100));
}

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);

  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}
