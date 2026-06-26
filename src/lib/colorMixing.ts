export type MixMode = "paint" | "light" | "ink";

export type PaletteColor = {
  id: string;
  name: string;
  hex: string;
  rgb: [number, number, number];
};

export type MixResult = {
  name: string;
  hex: string;
  explanation: string;
  tryThis: string;
};

export const mixModes: { id: MixMode; label: string; shortLabel: string }[] = [
  { id: "paint", label: "Paint Lab", shortLabel: "Paint" },
  { id: "light", label: "Light Mode", shortLabel: "Light" },
  { id: "ink", label: "Printer Ink Mode", shortLabel: "Ink" },
];

export const paletteColors: PaletteColor[] = [
  { id: "red", name: "Red", hex: "#ef4444", rgb: [239, 68, 68] },
  { id: "yellow", name: "Yellow", hex: "#facc15", rgb: [250, 204, 21] },
  { id: "blue", name: "Blue", hex: "#2563eb", rgb: [37, 99, 235] },
  { id: "white", name: "White", hex: "#f8fafc", rgb: [248, 250, 252] },
  { id: "black", name: "Black", hex: "#111827", rgb: [17, 24, 39] },
  { id: "green", name: "Green", hex: "#22c55e", rgb: [34, 197, 94] },
  { id: "orange", name: "Orange", hex: "#f97316", rgb: [249, 115, 22] },
  { id: "purple", name: "Purple", hex: "#8b5cf6", rgb: [139, 92, 246] },
  { id: "cyan", name: "Cyan", hex: "#06b6d4", rgb: [6, 182, 212] },
  { id: "magenta", name: "Magenta", hex: "#d946ef", rgb: [217, 70, 239] },
];

const colorById = new Map(paletteColors.map((color) => [color.id, color]));

const paintRules: Record<string, MixResult> = {
  "blue-red": {
    name: "Purple",
    hex: "#7c3aed",
    explanation: "Red and blue make purple in paint.",
    tryThis: "Add white to make a softer lavender.",
  },
  "red-yellow": {
    name: "Orange",
    hex: "#f97316",
    explanation: "Red and yellow make orange in paint.",
    tryThis: "Use more yellow to make a sunny orange.",
  },
  "blue-yellow": {
    name: "Green",
    hex: "#22c55e",
    explanation: "Yellow and blue make green in paint.",
    tryThis: "Add more blue to make the green cooler.",
  },
  "red-white": {
    name: "Pink",
    hex: "#fb7185",
    explanation: "Red and white make pink in paint.",
    tryThis: "Add more white for a lighter pink.",
  },
  "black-red": {
    name: "Dark red",
    hex: "#7f1d1d",
    explanation: "Black makes red paint darker.",
    tryThis: "Try red and white next to compare a tint and a shade.",
  },
  "blue-white": {
    name: "Light blue",
    hex: "#93c5fd",
    explanation: "White makes blue paint lighter.",
    tryThis: "Try blue and black to see a darker shade.",
  },
  "white-yellow": {
    name: "Pale yellow",
    hex: "#fef3c7",
    explanation: "White makes yellow paint lighter.",
    tryThis: "Add red to yellow instead to make orange.",
  },
  "black-yellow": {
    name: "Olive",
    hex: "#71717a",
    explanation: "Black dulls yellow into a darker olive color.",
    tryThis: "Try yellow and blue for a cleaner green.",
  },
  "black-blue": {
    name: "Navy",
    hex: "#172554",
    explanation: "Black makes blue paint darker.",
    tryThis: "Add white to blue for a lighter tint.",
  },
  "green-red": {
    name: "Muddy brown",
    hex: "#795548",
    explanation: "Red and green are opposites in many paint lessons, so they often mix into a muddy brown.",
    tryThis: "Try red and yellow for a brighter result.",
  },
  "blue-orange": {
    name: "Brown",
    hex: "#7c4a21",
    explanation: "Orange and blue can make brown because they balance each other out.",
    tryThis: "Add a little white to see a tan color.",
  },
  "purple-yellow": {
    name: "Muted brown",
    hex: "#6b5b2a",
    explanation: "Purple and yellow often make a muted brown in paint.",
    tryThis: "Try purple with white to make lavender.",
  },
  "blue-red-yellow": {
    name: "Brown",
    hex: "#8b5a2b",
    explanation: "Red, yellow, and blue together often make brown or a muddy color in paint.",
    tryThis: "Change the amount of yellow to warm up the brown.",
  },
};

const inkRules: Record<string, MixResult> = {
  "cyan-magenta": {
    name: "Blue",
    hex: "#2563eb",
    explanation: "Cyan and magenta ink can make blue.",
    tryThis: "Add yellow to see why printer mixtures get dark.",
  },
  "magenta-yellow": {
    name: "Red",
    hex: "#ef4444",
    explanation: "Magenta and yellow ink can make red.",
    tryThis: "Try cyan and yellow to make green.",
  },
  "cyan-yellow": {
    name: "Green",
    hex: "#22c55e",
    explanation: "Yellow and cyan ink make green.",
    tryThis: "Try cyan and magenta to make blue.",
  },
  "cyan-magenta-yellow": {
    name: "Dark blackish color",
    hex: "#1f2937",
    explanation:
      "Cyan, magenta, and yellow ink create a dark blackish color. Real printers add black ink, which is why CMYK exists.",
    tryThis: "Reset and mix only two printer inks for a brighter color.",
  },
  "black-cyan": {
    name: "Dark cyan",
    hex: "#164e63",
    explanation: "Black ink makes cyan darker.",
    tryThis: "Try cyan and yellow for green.",
  },
  "black-magenta": {
    name: "Dark magenta",
    hex: "#701a75",
    explanation: "Black ink makes magenta darker.",
    tryThis: "Try magenta and yellow for red.",
  },
  "black-yellow": {
    name: "Dark yellow",
    hex: "#713f12",
    explanation: "Black ink makes yellow darker and less bright.",
    tryThis: "Try yellow and cyan for green.",
  },
};

export function mixColors(mode: MixMode, selectedIds: string[]): MixResult {
  const uniqueIds = [...new Set(selectedIds)].filter((id) => colorById.has(id));

  if (uniqueIds.length === 0) {
    return {
      name: "Ready to mix",
      hex: "#fff7ed",
      explanation: "Choose two or three colors to start the experiment.",
      tryThis: "Try red and yellow in Paint Lab.",
    };
  }

  if (uniqueIds.length === 1) {
    const color = colorById.get(uniqueIds[0])!;

    return {
      name: color.name,
      hex: color.hex,
      explanation: `${color.name} is in the bowl. Add another color to make a recipe.`,
      tryThis: mode === "light" ? "Try adding green or blue light." : "Try adding one more color.",
    };
  }

  if (mode === "light") {
    return mixLight(uniqueIds);
  }

  if (mode === "ink") {
    return mixInk(uniqueIds);
  }

  return mixPaint(uniqueIds);
}

function mixPaint(ids: string[]): MixResult {
  const key = keyFor(ids);

  if (paintRules[key]) {
    return paintRules[key];
  }

  if (ids.includes("black") && ids.length > 1) {
    const base = ids.find((id) => id !== "black");
    const baseName = base ? colorById.get(base)?.name.toLowerCase() : "the color";

    return {
      name: "Darker shade",
      hex: darken(averageHex(ids), 0.35),
      explanation: `Black makes ${baseName} darker in paint.`,
      tryThis: "Use just a tiny bit of black because it can overpower other paint.",
    };
  }

  if (ids.includes("white") && ids.length > 1) {
    const base = ids.find((id) => id !== "white");
    const baseName = base ? colorById.get(base)?.name.toLowerCase() : "the color";

    return {
      name: "Lighter tint",
      hex: lighten(averageHex(ids), 0.32),
      explanation: `White makes ${baseName} lighter in paint.`,
      tryThis: "Add a small amount of white at a time and compare the tint.",
    };
  }

  if (ids.length >= 3) {
    return {
      name: "Muddy brown",
      hex: "#7a5a3a",
      explanation:
        "Mixing many paint colors often creates a brown, gray, or muddy color.",
      tryThis: "Reset and mix only two colors for a cleaner recipe.",
    };
  }

  return {
    name: "Muted mix",
    hex: averageHex(ids),
    explanation:
      "This paint combination may become a muted or muddy color because real pigments do not mix like light.",
    tryThis: "Try a classic pair: red and yellow, yellow and blue, or blue and red.",
  };
}

function mixLight(ids: string[]): MixResult {
  const primaryIds = ids.flatMap((id) => {
    if (id === "yellow") return ["red", "green"];
    if (id === "cyan") return ["green", "blue"];
    if (id === "magenta" || id === "purple") return ["red", "blue"];
    if (id === "orange") return ["red", "green"];
    if (id === "white") return ["red", "green", "blue"];
    if (id === "black") return [];

    return [id];
  });

  const channels = new Set(primaryIds);
  const hasRed = channels.has("red");
  const hasGreen = channels.has("green");
  const hasBlue = channels.has("blue");

  if (hasRed && hasGreen && hasBlue) {
    return {
      name: "White light",
      hex: "#ffffff",
      explanation: "Red, green, and blue light make white light.",
      tryThis: "Try only red and green light to make yellow light.",
    };
  }

  if (hasRed && hasGreen) {
    return {
      name: "Yellow light",
      hex: "#fde047",
      explanation: "Red light and green light make yellow light.",
      tryThis: "Add blue light to make white light.",
    };
  }

  if (hasGreen && hasBlue) {
    return {
      name: "Cyan light",
      hex: "#22d3ee",
      explanation: "Green light and blue light make cyan light.",
      tryThis: "Add red light to make white light.",
    };
  }

  if (hasBlue && hasRed) {
    return {
      name: "Magenta light",
      hex: "#d946ef",
      explanation: "Blue light and red light make magenta light.",
      tryThis: "Add green light to make white light.",
    };
  }

  const first = colorById.get(ids[0])!;

  return {
    name: `${first.name} light`,
    hex: first.hex,
    explanation:
      "Light Mode uses additive mixing: adding more colored light makes the result brighter.",
    tryThis: "Try red, green, and blue together.",
  };
}

function mixInk(ids: string[]): MixResult {
  const cmyIds = ids.flatMap((id) => {
    if (id === "blue") return ["cyan", "magenta"];
    if (id === "red") return ["magenta", "yellow"];
    if (id === "green") return ["cyan", "yellow"];
    if (id === "black") return ["black"];
    if (id === "cyan" || id === "magenta" || id === "yellow") return [id];

    return [id];
  });
  const key = keyFor([...new Set(cmyIds)]);

  if (inkRules[key]) {
    return inkRules[key];
  }

  if (cmyIds.includes("black")) {
    return {
      name: "Dark ink mix",
      hex: darken(averageHex(ids), 0.45),
      explanation: "Black ink darkens printer colors.",
      tryThis: "Try cyan, magenta, and yellow without black.",
    };
  }

  return {
    name: "Layered ink color",
    hex: averageHex(ids),
    explanation:
      "Printer Ink Mode uses cyan, magenta, and yellow. Other palette colors are shortcuts for kid-friendly experiments.",
    tryThis: "Try cyan plus magenta, magenta plus yellow, or yellow plus cyan.",
  };
}

function keyFor(ids: string[]) {
  return [...new Set(ids)]
    .sort((a, b) => a.localeCompare(b))
    .join("-");
}

function averageHex(ids: string[]) {
  const colors = ids.map((id) => colorById.get(id)!).filter(Boolean);
  const [r, g, b] = colors.reduce<[number, number, number]>(
    (total, color) => [
      total[0] + color.rgb[0],
      total[1] + color.rgb[1],
      total[2] + color.rgb[2],
    ],
    [0, 0, 0],
  );

  return rgbToHex(
    Math.round(r / colors.length),
    Math.round(g / colors.length),
    Math.round(b / colors.length),
  );
}

function lighten(hex: string, amount: number) {
  const [r, g, b] = hexToRgb(hex);

  return rgbToHex(
    Math.round(r + (255 - r) * amount),
    Math.round(g + (255 - g) * amount),
    Math.round(b + (255 - b) * amount),
  );
}

function darken(hex: string, amount: number) {
  const [r, g, b] = hexToRgb(hex);

  return rgbToHex(
    Math.round(r * (1 - amount)),
    Math.round(g * (1 - amount)),
    Math.round(b * (1 - amount)),
  );
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
