// A = rock; B = paper; C = scissors
// X = rock; Y = paper; Z = scissors
// rock = 1; paper = 2; scissors = 3
// lose = 0; draw = 3; win = 6
// First column: opponent; second column: you

const games = Deno.readTextFileSync("data/input2.txt");

const testData = `
A Y
B X
C Z
`;

const ELF = new Set(["A", "B", "C"]);
const OPTIONS = ["X", "Y", "Z"];
const ME = new Set(OPTIONS);
const VALUES = {
  "X": {"A": 3, "B": 0, "C": 6},
  "Y": {"A": 6, "B": 3, "C": 0},
  "Z": {"A": 0, "B": 6, "C": 3},
}
const OUTCOMES = {"X": 0, "Y": 3, "Z": 6};
const VALUES2 = {
  "A": {"X": "Z", "Y": "X", "Z": "Y"},
  "B": {"X": "X", "Y": "Y", "Z": "Z"},
  "C": {"X": "Y", "Y": "Z", "Z": "X"},
}

const parse = (line: string): [string, string] => {
    const [elf, me] = line.split(" ");
    if (!ELF.has(elf)) {
      throw new Error(`Invalid elf value: ${elf}`);
    }
    if (!ME.has(me)) {
      throw new Error(`Invalid me value: ${me}`);
    }
    return [elf, me];
};

// For part 2, X = lose, Y = draw, Z = win, and you have to choose the
// shape that gets this result.
const calculateScore1 = (input: string): number => {
  const lines = input.split("\n").filter((e) => e !== "");
  let score = 0;
  for (const line of lines) {
    const [elf, me] = parse(line);
    score += OPTIONS.indexOf(me) + 1;
    // @ts-ignore I don't understand typescript and don't care to try.
    score += VALUES[me][elf]
  }
  return score;
}

const calculateScore2 = (input: string): number => {
  const lines = input.split("\n").filter((e) => e !== "");
  let score = 0;
  for (const line of lines) {
    const [elf, outcome] = parse(line);
    // @ts-ignore I don't understand typescript and don't care to try.
    score += OUTCOMES[outcome];
    // @ts-ignore I don't understand typescript and don't care to try.
    const me = VALUES2[elf][outcome];
    score += OPTIONS.indexOf(me) + 1;
  }
  return score;
}

console.log(`Test score is: ${calculateScore1(testData)}`);
console.log(`Part 1: ${calculateScore1(games)}`);
console.log(`Test part 2 score is: ${calculateScore2(testData)}`);
console.log(`Part 2: ${calculateScore2(games)}`);