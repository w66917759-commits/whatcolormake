import {
  colorGameRule,
  colorChallenges,
  type ColorGameRule,
} from "@/data/colorChallenges";
import { paletteColors } from "@/lib/colorMixing";

export type PlayMode = "quest" | "target" | "free";
export type CatchState = "idle" | "success" | "close" | "miss";
export type StarRating = 0 | 1 | 2 | 3;
export type TuneWeights = Record<string, number>;

export type ScoreInput = {
  match: number;
  passed: boolean;
  exact: boolean;
  streak: number;
  rule: ColorGameRule;
  attemptsForRound: number;
};

const colorById = new Map(paletteColors.map((color) => [color.id, color]));

export function getCatchState(
  match: number,
  passed: boolean,
): Exclude<CatchState, "idle"> {
  if (passed) {
    return "success";
  }

  return match >= 61 ? "close" : "miss";
}

export function getAttemptScore({
  match,
  passed,
  exact,
  streak,
  rule,
  attemptsForRound,
}: ScoreInput) {
  const matchScore = passed ? 100 : Math.max(5, Math.round(match / 10));
  const exactBonus = exact ? 18 : 0;
  const streakBonus = passed ? Math.min(streak * 8, 40) : 0;
  const firstTryBonus = passed && attemptsForRound === 1 ? 20 : 0;
  const rawScore =
    (matchScore + exactBonus + streakBonus + firstTryBonus) *
    rule.scoreMultiplier;

  return Math.round(rawScore);
}

export function getStarRating({
  match,
  passed,
  exact,
  rule,
  attemptsForRound,
}: {
  match: number;
  passed: boolean;
  exact: boolean;
  rule: ColorGameRule;
  attemptsForRound: number;
}): StarRating {
  if (!passed) {
    return 0;
  }

  if (exact || (match >= rule.perfectThreshold && attemptsForRound <= 1)) {
    return 3;
  }

  if (match >= rule.passThreshold && attemptsForRound <= 3) {
    return 2;
  }

  return 1;
}

export function getDailyKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function getDailyChallengeIndex(date = new Date()) {
  const key = getDailyKey(date);
  const seed = key
    .split("")
    .reduce((total, character) => total + character.charCodeAt(0), 0);

  return seed % colorChallenges.length;
}

export function getTargetChallengeIndex(currentIndex: number) {
  return (currentIndex * 3 + 2) % colorChallenges.length;
}

export function isSameSet(first: string[], second: string[]) {
  if (first.length !== second.length) {
    return false;
  }

  const sortedFirst = [...first].sort();
  const sortedSecond = [...second].sort();

  return sortedFirst.every((id, index) => id === sortedSecond[index]);
}

export function getColorMatch(firstHex: string, secondHex: string) {
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

export function reconcileTuneWeights(
  current: TuneWeights,
  selectedIds: string[],
) {
  return selectedIds.reduce<TuneWeights>((next, id) => {
    next[id] = current[id] ?? 50;
    return next;
  }, {});
}

export function getTunedMixHex(selectedIds: string[], tuneWeights: TuneWeights) {
  const selectedColors = selectedIds
    .map((id) => colorById.get(id))
    .filter(Boolean);

  if (selectedColors.length === 0) {
    return "#fff7ed";
  }

  const totalWeight = selectedIds.reduce(
    (total, id) => total + Math.max(tuneWeights[id] ?? 50, 1),
    0,
  );
  const [red, green, blue] = selectedIds.reduce<[number, number, number]>(
    (total, id) => {
      const color = colorById.get(id);
      const weight = Math.max(tuneWeights[id] ?? 50, 1) / totalWeight;

      if (!color) {
        return total;
      }

      return [
        total[0] + color.rgb[0] * weight,
        total[1] + color.rgb[1] * weight,
        total[2] + color.rgb[2] * weight,
      ];
    },
    [0, 0, 0],
  );

  return rgbToHex(Math.round(red), Math.round(green), Math.round(blue));
}

export function getTargetHelperLine({
  selected,
  match,
}: {
  selected: string[];
  match: number;
}) {
  if (selected.length === 0) {
    return "Pick colors, then tune each amount to chase the target.";
  }

  if (match >= colorGameRule.passThreshold - 2) {
    return "Very close. Make tiny slider moves before catching.";
  }

  if (match >= 82) {
    return "Close, but the target needs a cleaner balance.";
  }

  if (selected.length < 2) {
    return "The target needs more range. Add a second drop and watch the meter.";
  }

  return "Use hue and brightness. Swap one color or change an amount.";
}

export function formatStarText(stars: StarRating) {
  if (stars === 3) return "3 stars";
  if (stars === 2) return "2 stars";
  if (stars === 1) return "1 star";
  return "No stars";
}

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);

  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}
