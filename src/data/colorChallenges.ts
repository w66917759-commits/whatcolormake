import type { MixMode } from "@/lib/colorMixing";

export type ColorGameRule = {
  label: string;
  shortLabel: string;
  personality: string;
  passThreshold: number;
  perfectThreshold: number;
  scoreMultiplier: number;
  helperText: string;
  cueText: string;
  catchLineLabel: string;
  rewardText: string;
};

export type ColorChallenge = {
  id: string;
  title: string;
  targetName: string;
  targetHex: string;
  mode: MixMode;
  answerIds: string[];
  clue: string;
  lesson: string;
  targetTip: string;
};

export const colorGameRule: ColorGameRule = {
  label: "Hard",
  shortLabel: "Hard",
  personality: "Precision",
  passThreshold: 96,
  perfectThreshold: 100,
  scoreMultiplier: 1.35,
  helperText: "No recipe callouts. Read the meter and land a precise mix.",
  cueText: "No color names",
  catchLineLabel: "96% catch line",
  rewardText: "1.35x score",
};

export const colorChallenges: ColorChallenge[] = [
  {
    id: "paint-orange",
    title: "Catch the orange flash",
    targetName: "Orange",
    targetHex: "#f97316",
    mode: "paint",
    answerIds: ["red", "yellow"],
    clue: "Warm it up with two starter paints.",
    lesson: "Red and yellow make orange in paint.",
    targetTip: "Orange leans warm. Keep red and yellow close together.",
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
    targetTip: "A cleaner green usually needs yellow with a cooler blue.",
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
    targetTip: "Purple needs a strong blue side without losing red warmth.",
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
    targetTip: "Pink is a red tint. White should do most of the softening.",
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
    targetTip: "Cyan light needs green and blue without red taking over.",
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
    targetTip: "White light is about balancing red, green, and blue.",
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
    targetTip: "Blue ink mixtures lean on cyan with magenta for depth.",
  },
  {
    id: "ink-red",
    title: "Print a red signal",
    targetName: "Red",
    targetHex: "#ef4444",
    mode: "ink",
    answerIds: ["magenta", "yellow"],
    clue: "Printer red does not start with red ink.",
    lesson: "Magenta and yellow ink can make red.",
    targetTip: "Red in printer ink needs magenta warmed by yellow.",
  },
  {
    id: "light-yellow",
    title: "Light the yellow lamp",
    targetName: "Yellow light",
    targetHex: "#fde047",
    mode: "light",
    answerIds: ["red", "green"],
    clue: "Light gets brighter when colors are added together.",
    lesson: "Red light and green light make yellow light.",
    targetTip: "Yellow light is bright, so avoid adding blue unless you want white.",
  },
  {
    id: "paint-brown",
    title: "Mix the brown finish",
    targetName: "Brown",
    targetHex: "#8b5a2b",
    mode: "paint",
    answerIds: ["red", "yellow", "blue"],
    clue: "A muddy finish often needs all three paint primaries.",
    lesson: "Red, yellow, and blue together often make brown in paint.",
    targetTip: "Brown is muted and warm. Too much blue cools it down quickly.",
  },
];
