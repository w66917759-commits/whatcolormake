"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  colorGameRule,
  colorChallenges,
  type ColorChallenge,
  type ColorGameRule,
} from "@/data/colorChallenges";
import {
  mixColors,
  mixModes,
  paletteColors,
  type MixMode,
  type MixResult,
  type PaletteColor,
} from "@/lib/colorMixing";
import {
  formatStarText,
  getAttemptScore,
  getCatchState,
  getColorMatch,
  getStarRating,
  getTargetChallengeIndex,
  getTargetHelperLine,
  getTunedMixHex,
  isSameSet,
  reconcileTuneWeights,
  type CatchState,
  type PlayMode,
  type StarRating,
  type TuneWeights,
} from "@/lib/colorGame";

type Feedback = {
  title: string;
  body: string;
  match: number;
  points: number;
  passed: boolean;
  nextStreak: number;
  stars: StarRating;
};

type SavedGameStats = {
  bestScore: number;
  bestStreak: number;
  bestStarsByChallenge: Record<string, StarRating>;
};

const savedGameKey = "colourmake-color-game-v2";
const savedGameEventName = "colourmake-color-game-updated";

const initialSavedStats: SavedGameStats = {
  bestScore: 0,
  bestStreak: 0,
  bestStarsByChallenge: {},
};

let cachedSavedStatsRaw = "";
let cachedSavedStats = initialSavedStats;

const colorNames = new Map(paletteColors.map((color) => [color.id, color.name]));
const colorById = new Map(paletteColors.map((color) => [color.id, color]));
const freeMixStarterSets: Record<MixMode, string[]> = {
  paint: ["red", "yellow"],
  light: ["red", "green"],
  ink: ["magenta", "yellow"],
};

function normalizeSavedStats(stats: Partial<SavedGameStats>): SavedGameStats {
  return {
    bestScore: stats.bestScore ?? 0,
    bestStreak: stats.bestStreak ?? 0,
    bestStarsByChallenge: stats.bestStarsByChallenge ?? {},
  };
}

function readSavedGameStats() {
  if (typeof window === "undefined") {
    return initialSavedStats;
  }

  try {
    const rawStats = window.localStorage.getItem(savedGameKey) ?? "";

    if (rawStats === cachedSavedStatsRaw) {
      return cachedSavedStats;
    }

    cachedSavedStatsRaw = rawStats;
    cachedSavedStats = rawStats
      ? normalizeSavedStats(JSON.parse(rawStats) as Partial<SavedGameStats>)
      : initialSavedStats;

    return cachedSavedStats;
  } catch {
    cachedSavedStatsRaw = "";
    cachedSavedStats = initialSavedStats;
    return cachedSavedStats;
  }
}

function subscribeSavedGameStats(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(savedGameEventName, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(savedGameEventName, onStoreChange);
  };
}

function updateSavedGameStats(
  updater: (current: SavedGameStats) => SavedGameStats,
) {
  if (typeof window === "undefined") {
    return;
  }

  const nextStats = updater(readSavedGameStats());
  cachedSavedStats = nextStats;
  cachedSavedStatsRaw = JSON.stringify(nextStats);
  window.localStorage.setItem(savedGameKey, cachedSavedStatsRaw);
  window.dispatchEvent(new Event(savedGameEventName));
}

export function ColorGame() {
  const [playMode, setPlayMode] = useState<PlayMode>("quest");
  const [freeMixMode, setFreeMixMode] = useState<MixMode>("paint");
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [targetIndex, setTargetIndex] = useState(getTargetChallengeIndex(0));
  const [selected, setSelected] = useState<string[]>([]);
  const [tuneWeights, setTuneWeights] = useState<TuneWeights>({});
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [roundAttempts, setRoundAttempts] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [splashKey, setSplashKey] = useState(0);
  const [catchKey, setCatchKey] = useState(0);
  const [catchState, setCatchState] = useState<CatchState>("idle");
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => new Set());
  const savedStats = useSyncExternalStore(
    subscribeSavedGameStats,
    readSavedGameStats,
    () => initialSavedStats,
  );
  const catchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const gameRule = colorGameRule;
  const activeIndex = playMode === "target" ? targetIndex : challengeIndex;
  const challenge = colorChallenges[activeIndex];
  const activeMixMode = playMode === "free" ? freeMixMode : challenge.mode;
  const modeLabel = getModeLabel(challenge, playMode);

  const ruleResult = useMemo(
    () => mixColors(activeMixMode, selected),
    [activeMixMode, selected],
  );
  const tunedHex = useMemo(
    () => getTunedMixHex(selected, tuneWeights),
    [selected, tuneWeights],
  );
  const resultHex = playMode === "target" ? tunedHex : ruleResult.hex;
  const resultName =
    playMode === "target"
      ? selected.length > 0
        ? "Tuned mix"
        : "Ready to tune"
      : ruleResult.name;
  const exactRecipe =
    playMode === "quest" && isSameSet(selected, challenge.answerIds);

  const previewMatch = useMemo(() => {
    if (selected.length === 0) {
      return 0;
    }

    return exactRecipe ? 100 : getColorMatch(resultHex, challenge.targetHex);
  }, [challenge.targetHex, exactRecipe, resultHex, selected]);

  const selectedColors = selected
    .map((id) => colorById.get(id))
    .filter((color): color is PaletteColor => Boolean(color));
  const matchMessage = getMatchMessage(previewMatch, gameRule.passThreshold);
  const helperLine =
    playMode === "target"
      ? getTargetHelperLine({
          selected,
          match: previewMatch,
        })
      : getHelperLine(
          selected,
          ruleResult.name,
          previewMatch,
          roundAttempts,
        );
  const isClose =
    selected.length > 0 &&
    previewMatch >= Math.max(61, gameRule.passThreshold - 12);
  const shouldShake = catchState === "miss";
  const runComplete = completedIds.size >= colorChallenges.length;
  const showMessagePanel = playMode === "free" || Boolean(feedback);

  useEffect(() => {
    return () => {
      if (catchTimerRef.current) {
        clearTimeout(catchTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    function openFreeMixFromHash() {
      if (window.location.hash !== "#mixer" && window.location.hash !== "#free-mix") {
        return;
      }

      setPlayMode("free");
      setSelected((current) =>
        current.length > 0 ? current : freeMixStarterSets.paint,
      );
      setTuneWeights({});
      setFeedback(null);
      setRoundAttempts(0);
      setCatchState("idle");
    }

    openFreeMixFromHash();
    window.addEventListener("hashchange", openFreeMixFromHash);

    return () => {
      window.removeEventListener("hashchange", openFreeMixFromHash);
    };
  }, []);

  function resetRoundState(nextSelected: string[] = []) {
    setSelected(nextSelected);
    setTuneWeights(reconcileTuneWeights({}, nextSelected));
    setFeedback(null);
    setRoundAttempts(0);
    setCatchState("idle");
    setSplashKey((current) => current + 1);
  }

  function restartRun(nextMode = playMode) {
    setScore(0);
    setStreak(0);
    setTotalAttempts(0);
    setCompletedIds(new Set());
    setChallengeIndex(0);
    setTargetIndex(getTargetChallengeIndex(0));
    setPlayMode(nextMode);
    resetRoundState(nextMode === "free" ? freeMixStarterSets[freeMixMode] : []);
  }

  function choosePlayMode(nextMode: PlayMode) {
    if (nextMode === playMode) {
      return;
    }

    restartRun(nextMode);
  }

  function chooseFreeMixMode(nextMode: MixMode) {
    setFreeMixMode(nextMode);
    resetRoundState(freeMixStarterSets[nextMode]);
  }

  function chooseChallenge(index: number) {
    if (playMode === "target") {
      setTargetIndex(index);
    } else {
      setChallengeIndex(index);
    }

    resetRoundState();
  }

  function toggleColor(id: string) {
    setSelected((current) => {
      const next = current.includes(id)
        ? current.filter((colorId) => colorId !== id)
        : current.length >= 3
          ? [...current.slice(1), id]
          : [...current, id];

      setTuneWeights((weights) => reconcileTuneWeights(weights, next));
      return next;
    });
    setSplashKey((current) => current + 1);
    setFeedback(null);
  }

  function tuneColor(id: string, value: number) {
    setTuneWeights((current) => ({ ...current, [id]: value }));
    setFeedback(null);
  }

  function checkMix() {
    if (playMode === "free") {
      return;
    }

    if (selected.length === 0) {
      setFeedback({
        title: "Choose colors first",
        body:
          playMode === "target"
            ? "Pick colors, tune each amount, then try to catch the target."
            : "Drop paint into your mix, then try to catch the target.",
        match: 0,
        points: 0,
        passed: false,
        nextStreak: streak,
        stars: 0,
      });
      triggerCatchAnimation("miss");
      return;
    }

    const match = exactRecipe ? 100 : previewMatch;
    const passed = match >= gameRule.passThreshold;
    const nextRoundAttempts = roundAttempts + 1;
    const nextStreak = passed ? streak + 1 : 0;
    const stars = getStarRating({
      match,
      passed,
      exact: exactRecipe,
      rule: gameRule,
      attemptsForRound: nextRoundAttempts,
    });
    const points = getAttemptScore({
      match,
      passed,
      exact: exactRecipe,
      streak: nextStreak,
      rule: gameRule,
      attemptsForRound: nextRoundAttempts,
    });
    const nextScore = score + points;

    setScore(nextScore);
    setTotalAttempts((current) => current + 1);
    setRoundAttempts(nextRoundAttempts);
    setStreak(nextStreak);

    if (passed) {
      setCompletedIds((current) => new Set(current).add(challenge.id));
    }

    updateSavedGameStats((current) => {
      const nextStars =
        passed && stars > (current.bestStarsByChallenge[challenge.id] ?? 0)
          ? { ...current.bestStarsByChallenge, [challenge.id]: stars }
          : current.bestStarsByChallenge;

      return {
        bestScore: Math.max(current.bestScore, nextScore),
        bestStreak: Math.max(current.bestStreak, nextStreak),
        bestStarsByChallenge: nextStars,
      };
    });

    setFeedback({
      title: passed ? "Caught!" : match >= 61 ? "So close!" : "Good start",
      body: passed
        ? playMode === "target"
          ? `${challenge.targetTip} You tuned the mix to ${match}% accuracy.`
          : challenge.lesson
        : playMode === "target"
          ? getTargetHelperLine({
              selected,
              match,
            })
          : getHelperLine(
              selected,
              ruleResult.name,
              match,
              nextRoundAttempts,
            ),
      match,
      points,
      passed,
      nextStreak,
      stars,
    });
    triggerCatchAnimation(getCatchState(match, passed));
  }

  function nextChallenge() {
    if (playMode === "target") {
      setTargetIndex((current) => (current + 1) % colorChallenges.length);
    } else {
      setChallengeIndex((current) => (current + 1) % colorChallenges.length);
    }

    resetRoundState();
  }

  function resetRound() {
    resetRoundState();
  }

  function triggerCatchAnimation(nextState: Exclude<CatchState, "idle">) {
    if (catchTimerRef.current) {
      clearTimeout(catchTimerRef.current);
    }

    setCatchState(nextState);
    setCatchKey((current) => current + 1);
    catchTimerRef.current = setTimeout(
      () => setCatchState("idle"),
      nextState === "success" ? 1040 : 760,
    );
  }

  return (
    <section
      id="mixer"
      aria-labelledby="game-title"
      className="color-game-shell relative scroll-mt-32 overflow-hidden px-4 py-5 sm:px-6 lg:px-8 lg:py-8"
    >
      <span
        id="game"
        aria-hidden="true"
        className="pointer-events-none absolute -top-24"
      />

      <div className="relative mx-auto w-full max-w-[1240px]">
        <div
          className={`game-frame challenge-rule catch-state-${catchState}`}
        >
          <GameHud
            modeLabel={modeLabel}
            playMode={playMode}
            score={score}
            streak={streak}
            bestScore={savedStats.bestScore}
            bestStreak={savedStats.bestStreak}
            round={activeIndex + 1}
            totalRounds={colorChallenges.length}
            onPlayModeChange={choosePlayMode}
          />

          <div className={`catch-game-grid mode-${playMode} mt-4`}>
            {playMode === "free" ? (
              <FreeMixCard mode={freeMixMode} onModeChange={chooseFreeMixMode} />
            ) : (
              <ColorFlashCard
                name={challenge.targetName}
                hex={challenge.targetHex}
                title={challenge.clue}
                catchState={catchState}
                catchKey={catchKey}
              />
            )}

            <div className="mix-station">
              <PaintPot
                resultName={resultName}
                resultHex={resultHex}
                selectedColors={selectedColors}
                splashKey={splashKey}
                shouldShake={shouldShake}
                playMode={playMode}
                tuneWeights={tuneWeights}
                catchState={catchState}
                onTune={tuneColor}
              />
            </div>

            <PaintDropPicker selected={selected} onToggle={toggleColor} />

            <div className="game-control-panel">
              {playMode === "free" ? (
                <FreeMixResult result={ruleResult} />
              ) : (
                <CatchMeter
                  match={previewMatch}
                  message={matchMessage}
                  helperLine={helperLine}
                  isClose={isClose}
                  catchState={catchState}
                  gameRule={gameRule}
                  hasSelection={selected.length > 0}
                />
              )}

              <div className={`game-actions ${playMode === "free" ? "is-free" : ""}`}>
                {playMode !== "free" && (
                  <button
                    type="button"
                    onClick={checkMix}
                    className={`catch-button challenge-rule ${
                      catchState !== "idle" ? "is-catching" : ""
                    }`}
                  >
                    Catch It
                  </button>
                )}
                <button
                  type="button"
                  onClick={resetRound}
                  className="clear-bowl-button"
                >
                  Clear
                </button>
              </div>

              {playMode !== "free" && (
                <RoundNavigator
                  challenges={colorChallenges}
                  activeIndex={activeIndex}
                  completedIds={completedIds}
                  bestStarsByChallenge={savedStats.bestStarsByChallenge}
                  playMode={playMode}
                  onChoose={chooseChallenge}
                />
              )}
            </div>

            {showMessagePanel && (
              <div className="game-message-panel">
                {playMode === "free" ? (
                  <FreeMixGuide result={ruleResult} />
                ) : feedback?.passed ? (
                  <SuccessCard
                    challenge={challenge}
                    points={feedback.points}
                    streak={feedback.nextStreak}
                    stars={feedback.stars}
                    playMode={playMode}
                    runComplete={runComplete}
                    onNext={nextChallenge}
                  />
                ) : (
                  <HintPanel
                    feedback={feedback}
                    roundAttempts={roundAttempts}
                    totalAttempts={totalAttempts}
                  />
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}

function GameHud({
  modeLabel,
  playMode,
  score,
  streak,
  bestScore,
  bestStreak,
  round,
  totalRounds,
  onPlayModeChange,
}: {
  modeLabel: string;
  playMode: PlayMode;
  score: number;
  streak: number;
  bestScore: number;
  bestStreak: number;
  round: number;
  totalRounds: number;
  onPlayModeChange: (mode: PlayMode) => void;
}) {
  return (
    <div className="game-hud challenge-rule">
      <div className="game-hud-main">
        <p className="game-eyebrow">
          {modeLabel}
        </p>
        <h1 id="game-title" className="game-title">
          Color Mixing Lab
        </h1>
        <div className="mode-controls mt-3">
          <SegmentedControl
            label="Play mode"
            value={playMode}
            items={[
              { id: "quest", label: "Quest" },
              { id: "target", label: "Target Mix" },
              { id: "free", label: "Free Mix" },
            ]}
            onChange={(value) => onPlayModeChange(value as PlayMode)}
          />
        </div>
      </div>
      <div className="hud-pills">
        <div className="hud-stat-line">
          {playMode === "free" ? (
            <span>Free Mix</span>
          ) : (
            <>
              <span>
                Score <strong>{score}</strong>
              </span>
              <span>
                Streak <strong>{streak}x</strong>
              </span>
              <span>
                Best <strong>{bestScore}</strong>
              </span>
              <span>
                Round <strong>{round}/{totalRounds}</strong>
              </span>
              <span>
                Best streak <strong>{bestStreak}x</strong>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SegmentedControl({
  label,
  value,
  items,
  onChange,
}: {
  label: string;
  value: string;
  items: { id: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="mini-segment" aria-label={label}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-pressed={value === item.id}
          onClick={() => onChange(item.id)}
          className={value === item.id ? "is-active" : ""}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function ColorFlashCard({
  name,
  hex,
  title,
  catchState,
  catchKey,
}: {
  name: string;
  hex: string;
  title: string;
  catchState: CatchState;
  catchKey: number;
}) {
  return (
    <div className={`color-flash-card game-card flash-${catchState}`}>
      <div className="game-card-header">
        <p className="game-card-kicker">
          Target color
        </p>
        <p className="game-card-meta mono-meta">
          {hex}
        </p>
      </div>

      <div className="flash-creature-stage mt-4">
        <div className="flash-speech">
          {catchState === "success"
            ? "Caught!"
            : catchState === "close"
              ? "Almost!"
              : catchState === "miss"
                ? "Try again!"
                : "Match me"}
        </div>
        <div
          className="color-flash-blob"
          role="img"
          aria-label={`${formatFlashName(name)} target color`}
          style={{ backgroundColor: hex }}
        >
          <span aria-hidden="true" className="flash-eye flash-eye-left" />
          <span aria-hidden="true" className="flash-eye flash-eye-right" />
          <span aria-hidden="true" className="flash-smile" />
        </div>
        {catchState !== "idle" && (
          <span
            key={catchKey}
            aria-hidden="true"
            className={`catch-ring catch-ring-${catchState}`}
          />
        )}
      </div>

      <div className="target-copy">
        <h2 className="target-name">
          {formatFlashName(name)}
        </h2>
        <p className="target-clue">
          {title}
        </p>
      </div>
    </div>
  );
}

function FreeMixCard({
  mode,
  onModeChange,
}: {
  mode: MixMode;
  onModeChange: (mode: MixMode) => void;
}) {
  const activeMode = mixModes.find((item) => item.id === mode);

  return (
    <div className="free-mix-card game-card">
      <div className="game-card-header">
        <p className="game-card-kicker">
          Free Mix
        </p>
        <p className="game-card-meta">
          No score
        </p>
      </div>
      <h2 className="target-name free-mix-title">
        Mix freely
      </h2>
      <div className="mt-4">
        <SegmentedControl
          label="Color system"
          value={mode}
          items={mixModes.map((item) => ({
            id: item.id,
            label: item.shortLabel,
          }))}
          onChange={(value) => onModeChange(value as MixMode)}
        />
      </div>
      <p className="free-mix-note">
        {activeMode?.label ?? "Paint Lab"} changes the mixing rule, not just the
        label.
      </p>
    </div>
  );
}

function PaintPot({
  resultName,
  resultHex,
  selectedColors,
  splashKey,
  shouldShake,
  playMode,
  tuneWeights,
  catchState,
  onTune,
}: {
  resultName: string;
  resultHex: string;
  selectedColors: PaletteColor[];
  splashKey: number;
  shouldShake: boolean;
  playMode: PlayMode;
  tuneWeights: TuneWeights;
  catchState: CatchState;
  onTune: (id: string, value: number) => void;
}) {
  const isEmpty = selectedColors.length === 0;

  return (
    <div
      className={`paint-pot-card game-card pot-${catchState} ${
        shouldShake ? "is-shaking" : ""
      } ${isEmpty ? "is-empty" : ""}`}
    >
      <div className="game-card-header">
        <p className="game-card-kicker">
          Your mix
        </p>
        <p className="game-card-meta mono-meta">
          {resultHex}
        </p>
      </div>

      <div className="paint-pot-scene mt-4" aria-live="polite">
        <div className="mixing-bowl">
          <div aria-hidden="true" className="bowl-rim" />
          <div className="bowl-body">
            <div className="bowl-liquid" style={{ backgroundColor: resultHex }}>
              {!isEmpty && <span key={splashKey} aria-hidden="true" className="paint-splash" />}
              {catchState === "success" && (
                <span aria-hidden="true" className="success-splash" />
              )}
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
                {isEmpty ? "Choose colors to start" : resultName}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mix-chip-strip" aria-live="polite">
        {isEmpty ? (
          <>
            <span className="mix-chip-placeholder" />
            <span className="mix-chip-placeholder" />
            <span className="mix-chip-empty-label">No paint selected</span>
          </>
        ) : (
          selectedColors.map((color, index) => (
            <span key={`${color.id}-chip-${index}`} className="mix-chip">
              <span
                aria-hidden="true"
                className="mix-chip-swatch"
                style={{ backgroundColor: color.hex }}
              />
              {color.name}
            </span>
          ))
        )}
      </div>

      {playMode === "target" && (
        <MixTuningPanel
          selectedColors={selectedColors}
          tuneWeights={tuneWeights}
          onTune={onTune}
        />
      )}
    </div>
  );
}

function MixTuningPanel({
  selectedColors,
  tuneWeights,
  onTune,
}: {
  selectedColors: PaletteColor[];
  tuneWeights: TuneWeights;
  onTune: (id: string, value: number) => void;
}) {
  if (selectedColors.length === 0) {
    return (
      <div className="mix-tuning-panel mt-3 rounded-[16px] bg-rose-50 p-3 text-sm font-bold text-rose-950">
        Pick a color to unlock amount sliders.
      </div>
    );
  }

  return (
    <div className="mix-tuning-panel mt-3 rounded-[16px] bg-rose-50 p-3">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-rose-700">
        Amount
      </p>
      <div className="mt-2 grid gap-2">
        {selectedColors.map((color) => (
          <label key={color.id} className="tune-row">
            <span className="inline-flex min-w-20 items-center gap-2 text-sm font-black text-stone-800">
              <span
                aria-hidden="true"
                className="h-3 w-3 rounded-full border border-stone-300"
                style={{ backgroundColor: color.hex }}
              />
              {color.name}
            </span>
            <input
              type="range"
              min="15"
              max="100"
              value={tuneWeights[color.id] ?? 50}
              onChange={(event) =>
                onTune(color.id, Number(event.currentTarget.value))
              }
              aria-label={`${color.name} amount`}
            />
            <span className="w-10 text-right text-xs font-black text-stone-500">
              {tuneWeights[color.id] ?? 50}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

function CatchMeter({
  match,
  message,
  helperLine,
  isClose,
  catchState,
  gameRule,
  hasSelection,
}: {
  match: number;
  message: string;
  helperLine: string;
  isClose: boolean;
  catchState: CatchState;
  gameRule: ColorGameRule;
  hasSelection: boolean;
}) {
  const meterTone = !hasSelection
    ? "empty"
    : match >= gameRule.perfectThreshold
      ? "perfect"
      : match >= gameRule.passThreshold
        ? "passed"
        : match >= gameRule.passThreshold - 6
          ? "almost"
          : match >= 60
            ? "warm"
            : "cold";

  return (
    <div
      className={`catch-meter challenge-rule game-card meter-${catchState} meter-tone-${meterTone} ${
        isClose ? "is-close" : ""
      }`}
    >
      <div className="meter-header">
        <p className="game-card-kicker">
          Match meter
        </p>
        <div className="meter-score">
          <p className="meter-percent" aria-live="polite">
            {match}%
          </p>
          <p className="meter-need">
            Need {gameRule.passThreshold}%
          </p>
        </div>
      </div>
      <div
        className="catch-meter-track"
        role="meter"
        aria-label="Current match"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={match}
        aria-valuetext={`${match}% match, ${gameRule.passThreshold}% needed`}
      >
        <div
          className="catch-meter-fill"
          style={{ width: `${match}%` }}
        />
        <span
          aria-hidden="true"
          className="catch-threshold"
          style={{ left: `${gameRule.passThreshold}%` }}
        />
      </div>
      <div className="catch-meter-scale" aria-hidden="true">
        <span>0%</span>
        <span>Pass {gameRule.passThreshold}%</span>
        <span>100%</span>
      </div>
      <p className="meter-message" aria-live="polite">
        {message}
      </p>
      {hasSelection && (
        <p className="meter-helper">
          {helperLine}
        </p>
      )}
    </div>
  );
}

function FreeMixResult({ result }: { result: MixResult }) {
  return (
    <div className="free-result-card game-card">
      <p className="game-card-kicker">
        Result notes
      </p>
      <p className="result-note-title">
        {result.explanation}
      </p>
      <p className="result-note-body">
        Try this: {result.tryThis}
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
      <div className="game-card-header">
        <p className="game-card-kicker">Palette</p>
        <p className="game-card-meta">{selected.length}/3 selected</p>
      </div>
      <div className="paint-drops-grid mt-3">
        {paletteColors.map((color) => {
          const isActive = selected.includes(color.id);
          const isLight = color.id === "white" || color.id === "yellow";

          return (
            <button
              key={color.id}
              type="button"
              aria-pressed={isActive}
              aria-label={`${isActive ? "Remove" : "Add"} ${color.name}`}
              title={color.name}
              onClick={() => onToggle(color.id)}
              className={`paint-drop-button ${isActive ? "is-selected" : ""}`}
            >
              <span
                aria-hidden="true"
                className={`paint-drop-swatch ${isLight ? "is-light" : ""}`}
                style={{ backgroundColor: color.hex }}
              />
              <span className="paint-drop-name">{color.name}</span>
              <span aria-hidden="true" className="paint-drop-check">
                ✓
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function HintPanel({
  feedback,
  roundAttempts,
  totalAttempts,
}: {
  feedback: Feedback | null;
  roundAttempts: number;
  totalAttempts: number;
}) {
  if (!feedback) {
    return null;
  }

  return (
    <div
      className="hint-card challenge-rule rounded-[18px] bg-white p-4 shadow-sm"
      aria-live="polite"
    >
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
      ) : null}
      <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-stone-400">
        Round tries: {roundAttempts} / Total tries: {totalAttempts}
      </p>
    </div>
  );
}

function FreeMixGuide({ result }: { result: MixResult }) {
  return (
    <div className="hint-card challenge-rule rounded-[18px] bg-white/80 p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em]">
        Free Mix
      </p>
      <p className="mt-2 text-sm font-semibold leading-6 text-stone-600">
        Current result: {result.name}
      </p>
    </div>
  );
}

function SuccessCard({
  challenge,
  points,
  streak,
  stars,
  playMode,
  runComplete,
  onNext,
}: {
  challenge: ColorChallenge;
  points: number;
  streak: number;
  stars: StarRating;
  playMode: PlayMode;
  runComplete: boolean;
  onNext: () => void;
}) {
  return (
    <div className="success-card challenge-rule relative overflow-hidden rounded-[20px] bg-emerald-50 p-4 shadow-sm">
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
        {runComplete ? "Quest complete" : "Target caught"}
      </p>
      <h3 className="mt-1 text-xl font-black leading-tight text-stone-950">
        You matched {formatFlashName(challenge.targetName)}.
      </h3>
      <StarRow stars={stars} />
      <p className="mt-2 text-sm font-bold text-stone-700">
        {playMode === "target"
          ? challenge.targetTip
          : formatRecipe(challenge.answerIds, challenge.targetName)}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-stone-950">
          +{points} points
        </span>
        <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-stone-950">
          Streak x{streak}
        </span>
        <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-stone-950">
          {formatStarText(stars)}
        </span>
      </div>
      <button
        type="button"
        onClick={onNext}
        className="mt-4 min-h-12 rounded-full bg-stone-950 px-5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-stone-800 focus:outline-none focus:ring-4 focus:ring-amber-300"
      >
        {runComplete ? "Play again" : "Next target"}
      </button>
    </div>
  );
}

function StarRow({ stars }: { stars: StarRating }) {
  return (
    <div className="mt-2 flex gap-1" aria-label={formatStarText(stars)}>
      {[1, 2, 3].map((star) => (
        <span
          key={star}
          aria-hidden="true"
          className={`star-badge ${star <= stars ? "is-lit" : ""}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function RoundNavigator({
  challenges,
  activeIndex,
  completedIds,
  bestStarsByChallenge,
  playMode,
  onChoose,
}: {
  challenges: ColorChallenge[];
  activeIndex: number;
  completedIds: Set<string>;
  bestStarsByChallenge: Record<string, StarRating>;
  playMode: PlayMode;
  onChoose: (index: number) => void;
}) {
  const completedCount = completedIds.size;
  const activeChallenge = challenges[activeIndex];
  const activeBestStars = bestStarsByChallenge[activeChallenge.id] ?? 0;

  return (
    <div className="round-navigator game-card">
      <div className="round-navigator-summary">
        <div>
          <p className="game-card-kicker">
            {playMode === "target" ? "Choose target" : "Round selector"}
          </p>
          <p className="round-status-text">
            {completedCount}/{challenges.length} caught
          </p>
        </div>
        <p className="round-status-pill">
          Round {activeIndex + 1}
        </p>
      </div>

      <label className="round-select-label" htmlFor="round-selector">
        <span>Target</span>
        <select
          id="round-selector"
          className="round-select"
          value={String(activeIndex)}
          onChange={(event) => onChoose(Number(event.currentTarget.value))}
        >
          {challenges.map((item, index) => {
            const bestStars = bestStarsByChallenge[item.id] ?? 0;
            const completedLabel = completedIds.has(item.id) ? "caught" : "open";
            const starLabel = bestStars > 0 ? `, ${formatStarText(bestStars)}` : "";

            return (
              <option key={item.id} value={String(index)}>
                {index + 1}. {formatFlashName(item.targetName)} - {completedLabel}
                {starLabel}
              </option>
            );
          })}
        </select>
      </label>

      <div className="round-active-line">
        <span
          aria-hidden="true"
          className="round-active-swatch"
          style={{ backgroundColor: activeChallenge.targetHex }}
        />
        <span>
          {formatFlashName(activeChallenge.targetName)}
          {activeBestStars > 0 ? ` / ${formatStarText(activeBestStars)}` : ""}
        </span>
      </div>
    </div>
  );
}

function getModeLabel(challenge: ColorChallenge, playMode: PlayMode) {
  if (playMode === "free") {
    return "Free Mix";
  }

  if (playMode === "target") {
    return "Target Mix";
  }

  if (challenge.mode === "paint") {
    return "Paint Lab";
  }

  return mixModes.find((item) => item.id === challenge.mode)?.label ?? "Paint Lab";
}

function getMatchMessage(match: number, passThreshold: number) {
  if (match >= 100) {
    return "Perfect match";
  }

  if (match >= passThreshold) {
    return "Almost there";
  }

  if (match <= 30) {
    return "Not close yet";
  }

  if (match <= 60) {
    return "Getting warmer";
  }

  if (match < passThreshold) {
    return "Almost there";
  }

  return "Perfect match";
}

function getHelperLine(
  selected: string[],
  resultName: string,
  match: number,
  attemptsForRound: number,
) {
  if (selected.length === 0) {
    return "Pick 2-3 colors and watch how close your mix gets.";
  }

  if (resultName.toLowerCase().includes("muddy") || selected.length >= 3) {
    return "This mix is getting crowded. Try fewer colors for a cleaner match.";
  }

  if (match >= 96) {
    return "Ready to catch.";
  }

  if (match >= 90) {
    return "Very close. Make one small change before catching.";
  }

  if (match >= 70) {
    return "Close family, different balance. Adjust warmth or brightness.";
  }

  if (attemptsForRound === 0) {
    return "Use the target color and the meter before your first catch.";
  }

  return "Try a different hue, brightness, or number of colors.";
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
