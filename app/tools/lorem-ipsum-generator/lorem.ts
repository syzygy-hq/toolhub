const WORDS = (
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod " +
  "tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam " +
  "quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo " +
  "consequat duis aute irure in reprehenderit voluptate velit esse cillum " +
  "eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident " +
  "sunt culpa qui officia deserunt mollit anim id est laborum"
).split(" ");

function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

function words(count: number): string[] {
  return Array.from({ length: count }, () => WORDS[randomInt(WORDS.length)]);
}

function sentence(): string {
  const length = 6 + randomInt(10);
  const parts = words(length);
  const text = parts.join(" ");
  return text.charAt(0).toUpperCase() + text.slice(1) + ".";
}

export function generateLorem(
  unit: "words" | "sentences" | "paragraphs",
  count: number,
  startClassic: boolean
): string {
  if (unit === "words") {
    const list = words(count);
    if (startClassic) list.splice(0, 2, "Lorem", "ipsum");
    return list.join(" ");
  }

  if (unit === "sentences") {
    const list = Array.from({ length: count }, sentence);
    if (startClassic) {
      list[0] =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    }
    return list.join(" ");
  }

  const paragraphs = Array.from({ length: count }, () => {
    const sentenceCount = 3 + randomInt(4);
    return Array.from({ length: sentenceCount }, sentence).join(" ");
  });
  if (startClassic) {
    paragraphs[0] =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
      paragraphs[0].split(" ").slice(8).join(" ");
  }
  return paragraphs.join("\n\n");
}
