import { chunk } from "https://deno.land/std@0.121.0/collections/chunk.ts";

const data = Deno.readTextFileSync("data/input3.txt");

const testData = `
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
`;

const getItemScore = (item: string): number => {
  if (item === item.toUpperCase()) {
    return item.charCodeAt(0) - 38;
  } else {
    return item.charCodeAt(0) - 96;
  }
}

const calculateScore1 = (input: string): number => {
  const lines = input.split("\n").filter((e) => e !== "");
  let score = 0;
  for (const line of lines) {
    if (!(line.length % 2 == 0)) {
      throw new Error("Not an even number of characters")
    }
    const midpoint = line.length / 2;
    const first = new Set(line.slice(0, midpoint));
    const last = new Set(line.slice(midpoint, line.length));
    for (const item of first) {
      if (last.has(item)) {
        score += getItemScore(item);
        break;
      }
    }
  }
  return score;
}

// For each group of three lines, find the only item that appears in all three lines.
const calculateScore2 = (input: string): number => {
  const lines = input.split("\n").filter((e) => e !== "");
  let score = 0;
  for (const group of chunk(lines, 3)) {
    const [firstSet, secondSet, thirdSet] = group.map((g) => new Set(g));
    for (const item of firstSet) {
      if (secondSet.has(item) && thirdSet.has(item)) {
        score += getItemScore(item);
        break;
      }
    }
  }
  return score;
}

console.log(`Test score is: ${calculateScore1(testData)}`); // prints 15
console.log(`Part 1: ${calculateScore1(data)}`);
console.log(`Test part 2 score is: ${calculateScore2(testData)}`);
console.log(`Part 2: ${calculateScore2(data)}`);