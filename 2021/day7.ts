import { max, min, sum } from "https://deno.land/x/math@v1.1.0/mod.ts";

const data = Deno.readTextFileSync("data/day7.txt");

const testData = `16,1,2,0,4,2,7,1,2,14`;

const parseInput = (input: string): number[] => {
  return input.split(",").map((e) => parseInt(e));
}

// Find the number that minimizes the diff from all the other numbers.
const calculateScore1 = (input: string): number => {
  // The brute force way to do this is to go through the numbers from min(list)
  // to max(list) and find the smallest diff. The list is small enough that it's cheap
  const numbers = parseInput(input);
  const minValue = parseInt(min(numbers));
  const maxValue = parseInt(max(numbers));
  let minDiff = Number.MAX_SAFE_INTEGER;
  for (let i = minValue; i <= maxValue; i++) {
    const diff = parseInt(sum(numbers.map((n) => Math.abs(n - i))));
    if (diff < minDiff) {
      minDiff = diff;
    }
  }
  return minDiff;
}

const calculateScore2 = (input: string): number => {
  // The brute force way to do this is to go through the numbers from min(list)
  // to max(list) and find the smallest diff. The list is small enough that it's cheap
  const numbers = parseInput(input);
  const minValue = parseInt(min(numbers));
  const maxValue = parseInt(max(numbers));
  let minDiff = Number.MAX_SAFE_INTEGER;
  for (let i = minValue; i <= maxValue; i++) {
    const diff = parseInt(sum(numbers.map((n) => {
      const N = Math.abs(n - i) + 1;
      return (N * (N - 1) / 2);
    })));
    if (diff < minDiff) {
      minDiff = diff;
    }
  }
  return minDiff;
}

console.log(`Test score is: ${calculateScore1(testData)}`); // prints 5934
console.log(`Part 1: ${calculateScore1(data)}`);
console.log(`Test part 2 score is: ${calculateScore2(testData)}`);
console.log(`Part 2: ${calculateScore2(data)}`);