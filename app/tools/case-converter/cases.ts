function words(input: string): string[] {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/[\s_\-]+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase());
}

export const converters: Record<string, (input: string) => string> = {
  "camelCase": (input) => {
    const [first, ...rest] = words(input);
    if (!first) return "";
    return first + rest.map((w) => w[0].toUpperCase() + w.slice(1)).join("");
  },
  "PascalCase": (input) => words(input).map((w) => w[0].toUpperCase() + w.slice(1)).join(""),
  "snake_case": (input) => words(input).join("_"),
  "SCREAMING_SNAKE_CASE": (input) => words(input).join("_").toUpperCase(),
  "kebab-case": (input) => words(input).join("-"),
  "Title Case": (input) => words(input).map((w) => w[0].toUpperCase() + w.slice(1)).join(" "),
  "Sentence case": (input) => {
    const joined = words(input).join(" ");
    return joined ? joined[0].toUpperCase() + joined.slice(1) : "";
  },
  "lower case": (input) => words(input).join(" "),
  "UPPER CASE": (input) => words(input).join(" ").toUpperCase(),
};
