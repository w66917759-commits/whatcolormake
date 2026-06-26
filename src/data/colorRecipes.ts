export type RecipeSlug =
  | "what-colors-make-red"
  | "what-colors-make-yellow"
  | "what-colors-make-blue"
  | "what-colors-make-green"
  | "what-colors-make-orange"
  | "what-colors-make-purple"
  | "what-colors-make-pink"
  | "what-colors-make-brown"
  | "what-colors-make-black"
  | "what-colors-make-white";

export type ColorRecipe = {
  slug: RecipeSlug;
  colorName: string;
  title: string;
  description: string;
  quickAnswer: string;
  kidExplanation: string;
  parentTeacherExplanation: string;
  paintAnswer: string;
  lightAnswer: string;
  inkAnswer: string;
  relatedQuestions: RecipeSlug[];
  activityPrompt: string;
  swatch: string;
};

export const colorRecipes: ColorRecipe[] = [
  {
    slug: "what-colors-make-red",
    colorName: "red",
    title: "What Colors Make Red?",
    description:
      "Learn what makes red in paint, light, and printer ink with a kid-friendly color recipe.",
    quickAnswer:
      "In paint, red is usually a starter color. You normally cannot make bright red by mixing other paints.",
    kidExplanation:
      "Red is one of the first paint colors artists start with. If you want a bright red painting color, use red paint.",
    parentTeacherExplanation:
      "In traditional kids' art, red is treated as a primary color. In printer ink, magenta and yellow can make red. In light, red is itself a primary color.",
    paintAnswer:
      "Paint Mode: red is treated as a primary color, so it is not made from other bright paints.",
    lightAnswer:
      "Light Mode: red is a primary light color. It is one of the lights used to make other colors.",
    inkAnswer:
      "Printer Ink Mode: magenta plus yellow ink can make red.",
    relatedQuestions: [
      "what-colors-make-orange",
      "what-colors-make-pink",
      "what-colors-make-yellow",
    ],
    activityPrompt:
      "Paint one red circle, then mix red with white and write what changes.",
    swatch: "#ef4444",
  },
  {
    slug: "what-colors-make-yellow",
    colorName: "yellow",
    title: "What Colors Make Yellow?",
    description:
      "Learn how yellow works in paint and why red and green light make yellow light.",
    quickAnswer:
      "In paint, yellow is usually a starter color. You normally need yellow paint to make yellow.",
    kidExplanation:
      "Yellow paint is a starter color in many classroom paint sets. It helps make orange and green.",
    parentTeacherExplanation:
      "In light, red and green make yellow light. In paint, mixing red and green usually does not make a clean yellow.",
    paintAnswer:
      "Paint Mode: yellow is treated as a primary color, so bright yellow usually starts with yellow paint.",
    lightAnswer: "Light Mode: red light plus green light makes yellow light.",
    inkAnswer:
      "Printer Ink Mode: yellow is one of the basic printer ink colors.",
    relatedQuestions: [
      "what-colors-make-orange",
      "what-colors-make-green",
      "what-colors-make-white",
    ],
    activityPrompt:
      "Mix yellow with red, then yellow with blue. Draw both results.",
    swatch: "#facc15",
  },
  {
    slug: "what-colors-make-blue",
    colorName: "blue",
    title: "What Colors Make Blue?",
    description:
      "Learn when blue is a starter color and how printer ink can make blue.",
    quickAnswer:
      "In paint, blue is usually a starter color. You normally cannot make bright blue without blue paint.",
    kidExplanation:
      "Blue is a starter paint color. You use it to make purple with red and green with yellow.",
    parentTeacherExplanation:
      "In printer ink, cyan and magenta can make blue. In traditional kids' painting, blue is treated as a primary color.",
    paintAnswer:
      "Paint Mode: blue is treated as a primary color, so bright blue usually starts with blue paint.",
    lightAnswer:
      "Light Mode: blue is a primary light color. Blue light helps make cyan, magenta, and white.",
    inkAnswer: "Printer Ink Mode: cyan plus magenta ink can make blue.",
    relatedQuestions: [
      "what-colors-make-purple",
      "what-colors-make-green",
      "what-colors-make-white",
    ],
    activityPrompt:
      "Use blue paint twice: mix it with yellow, then mix it with red.",
    swatch: "#2563eb",
  },
  {
    slug: "what-colors-make-green",
    colorName: "green",
    title: "What Colors Make Green?",
    description:
      "Learn the green color recipe for paint, light, and printer ink.",
    quickAnswer: "Yellow and blue make green in paint.",
    kidExplanation:
      "Try one drop of yellow and one drop of blue. Stir them together to make green.",
    parentTeacherExplanation:
      "Green is a secondary paint color in the traditional red-yellow-blue model. In light, green is a primary color. In printer ink, yellow and cyan make green.",
    paintAnswer: "Paint Mode: yellow plus blue makes green.",
    lightAnswer:
      "Light Mode: green is a primary light color, so it is not made by mixing other basic lights.",
    inkAnswer: "Printer Ink Mode: yellow plus cyan ink makes green.",
    relatedQuestions: [
      "what-colors-make-yellow",
      "what-colors-make-blue",
      "what-colors-make-brown",
    ],
    activityPrompt:
      "Mix yellow and blue. Add a little more yellow and compare the new green.",
    swatch: "#22c55e",
  },
  {
    slug: "what-colors-make-orange",
    colorName: "orange",
    title: "What Colors Make Orange?",
    description:
      "Learn why red and yellow make orange in paint and how orange differs across color systems.",
    quickAnswer: "Red and yellow make orange in paint.",
    kidExplanation:
      "Start with yellow, add a little red, and mix. More red makes a deeper orange.",
    parentTeacherExplanation:
      "Orange is a secondary color in traditional paint mixing. In light, orange is usually made by using more red than green rather than a simple two-primary classroom rule.",
    paintAnswer: "Paint Mode: red plus yellow makes orange.",
    lightAnswer:
      "Light Mode: orange can be approximated with strong red light and some green light.",
    inkAnswer:
      "Printer Ink Mode: orange is usually made with yellow ink plus some magenta.",
    relatedQuestions: [
      "what-colors-make-red",
      "what-colors-make-yellow",
      "what-colors-make-brown",
    ],
    activityPrompt:
      "Make two oranges: one with more yellow and one with more red.",
    swatch: "#f97316",
  },
  {
    slug: "what-colors-make-purple",
    colorName: "purple",
    title: "What Colors Make Purple?",
    description:
      "Learn how red and blue make purple in paint and how magenta works in light.",
    quickAnswer: "Red and blue make purple in paint.",
    kidExplanation:
      "Mix red and blue together. A little white can make a lighter purple.",
    parentTeacherExplanation:
      "Purple is a secondary paint color in the traditional red-yellow-blue model. In light, red and blue make magenta, which is close to a bright purple-pink.",
    paintAnswer: "Paint Mode: red plus blue makes purple.",
    lightAnswer:
      "Light Mode: red light plus blue light makes magenta light.",
    inkAnswer:
      "Printer Ink Mode: purple can be made with magenta plus some cyan or blue-leaning ink.",
    relatedQuestions: [
      "what-colors-make-red",
      "what-colors-make-blue",
      "what-colors-make-pink",
    ],
    activityPrompt:
      "Mix red and blue. Add white to part of the mixture and label the lighter color.",
    swatch: "#8b5cf6",
  },
  {
    slug: "what-colors-make-pink",
    colorName: "pink",
    title: "What Colors Make Pink?",
    description:
      "Learn the simple paint recipe for pink and how it relates to red.",
    quickAnswer: "Red and white make pink in paint.",
    kidExplanation:
      "Pink is a lighter red. Add white paint to red paint and mix gently.",
    parentTeacherExplanation:
      "In subtractive paint mixing, tinting red with white makes pink. In light, pink is usually a pale red or magenta-like light with high brightness.",
    paintAnswer: "Paint Mode: red plus white makes pink.",
    lightAnswer:
      "Light Mode: pink can be approximated with red light, some blue light, and high brightness.",
    inkAnswer:
      "Printer Ink Mode: light magenta or diluted magenta creates many pinks.",
    relatedQuestions: [
      "what-colors-make-red",
      "what-colors-make-purple",
      "what-colors-make-white",
    ],
    activityPrompt:
      "Make three pinks by adding a little, medium, and lots of white to red.",
    swatch: "#fb7185",
  },
  {
    slug: "what-colors-make-brown",
    colorName: "brown",
    title: "What Colors Make Brown?",
    description:
      "Learn simple ways to make brown with paint and why many mixed colors become muddy.",
    quickAnswer:
      "Brown often comes from mixing red, yellow, and blue, or from mixing opposite colors.",
    kidExplanation:
      "If you mix many paint colors together, they often turn brown or muddy.",
    parentTeacherExplanation:
      "Brown is usually a dark, muted orange or neutral mixture. It can be made with all three traditional paint primaries or complementary color pairs, then adjusted with white or black.",
    paintAnswer:
      "Paint Mode: red plus yellow plus blue often makes brown. Orange plus blue can also make brown.",
    lightAnswer:
      "Light Mode: brown is not a basic light mixture. It is usually perceived as a dark orange next to brighter colors.",
    inkAnswer:
      "Printer Ink Mode: combinations of cyan, magenta, yellow, and black can print brown tones.",
    relatedQuestions: [
      "what-colors-make-orange",
      "what-colors-make-black",
      "what-colors-make-green",
    ],
    activityPrompt:
      "Mix red, yellow, and blue. Try changing the amounts and name each brown.",
    swatch: "#92400e",
  },
  {
    slug: "what-colors-make-black",
    colorName: "black",
    title: "What Colors Make Black?",
    description:
      "Learn why dark paint mixtures are not always true black and why printers add black ink.",
    quickAnswer:
      "Many dark paints together may create a dark muddy color, but pure black usually needs black paint.",
    kidExplanation:
      "When you mix lots of dark paint colors, the result may look almost black, but black paint is the clearest way to get black.",
    parentTeacherExplanation:
      "In pigment mixing, combining many absorptive colors can create a dark neutral, but classroom paints rarely make a clean black. In printing, cyan, magenta, and yellow make a dark color, and black ink is added for stronger text and shadows.",
    paintAnswer:
      "Paint Mode: red, yellow, and blue can become dark and muddy, but pure black usually starts with black paint.",
    lightAnswer:
      "Light Mode: black is the absence of light, not a color made by mixing lights.",
    inkAnswer:
      "Printer Ink Mode: cyan plus magenta plus yellow creates a dark blackish color. Real printers usually add black ink, which is why CMYK exists.",
    relatedQuestions: [
      "what-colors-make-brown",
      "what-colors-make-white",
      "what-colors-make-blue",
    ],
    activityPrompt:
      "Make the darkest paint mix you can, then compare it with black paint.",
    swatch: "#111827",
  },
  {
    slug: "what-colors-make-white",
    colorName: "white",
    title: "What Colors Make White?",
    description:
      "Learn why white works differently in paint and light.",
    quickAnswer:
      "You cannot normally make white by mixing paint. In light, red, green, and blue make white light.",
    kidExplanation:
      "White paint is a starter color for making other paint colors lighter.",
    parentTeacherExplanation:
      "White behaves very differently across systems. Paint mixing is subtractive, so mixing colored paints does not create white. Additive light mixing can create white from red, green, and blue light.",
    paintAnswer:
      "Paint Mode: white cannot normally be made by mixing paint; use white paint to lighten colors.",
    lightAnswer:
      "Light Mode: red light plus green light plus blue light makes white light.",
    inkAnswer:
      "Printer Ink Mode: printers usually leave the paper unprinted to show white.",
    relatedQuestions: [
      "what-colors-make-pink",
      "what-colors-make-black",
      "what-colors-make-yellow",
    ],
    activityPrompt:
      "Add white to red, blue, and green paint. Write how each color changes.",
    swatch: "#f8fafc",
  },
];

export const recipesBySlug = new Map(
  colorRecipes.map((recipe) => [recipe.slug, recipe]),
);

export function getRecipe(slug: string) {
  return recipesBySlug.get(slug as RecipeSlug);
}
