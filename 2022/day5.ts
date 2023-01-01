import { chunk } from "https://deno.land/std@0.121.0/collections/chunk.ts";

// Given the starting state, perform the moves. Crates
// are moved one at a time. At the end, read off the top
// crates for each stack.
const data = Deno.readTextFileSync("data/input5.txt");

const testData = `    [D] 
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

const parseInitialState = (lines: string[]): string[][] => {
  const labelsRaw = lines.pop();
  const labels = labelsRaw!.split(" ").filter((e) => e !== "").map((e) => parseInt(e));
  const indices = labels!.map((e) => e + (3 * (e - 1)));
  const state = labels!.map((_e) => [] as string[]);
  for (const line of lines) {
    for (const label of labels) {
      const index = indices[label - 1];
      if (line.length < index) continue
      const item = line[index];
      if (item !== ' ') {
        state[label - 1].unshift(item);
      }
    }
  }
  return state;
}

// Move `amount` from `src` to `dst`. Moves are one at a time.
// The stacks in `state` go from bottom to top.
const updateState = (state: string[][], src: number, dst: number, amount: number) => {
  while (amount > 0) {
    const item = state[src - 1].pop();
    if (item === undefined) {
      throw new Error("Trying to move an item off an empty stack");
    }
    state[dst - 1].push(item);
    amount--;
  }
}

// Move `amount` from `src` to `dst`, moving multiple at a time.
// The stacks in `state` go from bottom to top.
const updateState2 = (state: string[][], src: number, dst: number, amount: number) => {
  const srcLength = state[src - 1].length;
  const items = state[src - 1].splice(srcLength - amount, srcLength);
  state[dst - 1].push(...items);
}

const calculateScore = (input: string, updateState: (state: string[][], src: number, dst: number, amount: number) => void): string => {
  const lines = input.split("\n");
  const splitPoint = lines.indexOf("");
  const state = parseInitialState(lines.slice(0, splitPoint));
  const moveLines = lines.slice(splitPoint + 1, lines.length);
  for (const moveLine of moveLines) {
    const [move, amountStr, from, srcStr, to, dstStr] = moveLine.split(" ");
    if (move !== "move" || from !== "from" || to !== "to") {
      throw new Error(`Unexpected format for moveLine: ${moveLine}`);
    }
    const amount = parseInt(amountStr);
    const src = parseInt(srcStr);
    const dst = parseInt(dstStr);
    if (isNaN(amount) || isNaN(src) || isNaN(dst)) {
      throw new Error(`Expected a number for moveLine values: ${moveLine}`);
    }
    updateState(state, src, dst, amount);
  }
  return state.map((e) => e[e.length - 1]).join("");
}

const calculateScore1 = (input: string): string => {
  return calculateScore(input, updateState);
}

const calculateScore2 = (input: string): string => {
  return calculateScore(input, updateState2);
}

console.log(`Test score is: ${calculateScore1(testData)}`); // prints 15
console.log(`Part 1: ${calculateScore1(data)}`);
console.log(`Test part 2 score is: ${calculateScore2(testData)}`);
console.log(`Part 2: ${calculateScore2(data)}`);