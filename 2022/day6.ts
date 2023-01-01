const data = Deno.readTextFileSync("data/input6.txt");

const testData = "bvwbjplbgvbhsrlpgdmjqwftvncz";

// Find the first place that four non-repeating characters occurs
const calculateScore = (input: string, bufferLength: number): number => {
  const buffer = [];
  let unique;
  for (let i = 0; i < input.length; i++) {
    if (buffer.length < bufferLength) {
      buffer.push(input[i]);
      continue;
    }
    buffer.shift();
    buffer.push(input[i]);
    unique = new Set(buffer);
    if (unique.size == bufferLength) {
      return i + 1;
    }
  }
  return NaN;
}

const calculateScore1 = (input: string): number => {
  return calculateScore(input, 4);
}

const calculateScore2 = (input: string): number => {
  return calculateScore(input, 14);
}

const testCases = [
  {s: "bvwbjplbgvbhsrlpgdmjqwftvncz", expected: 5},
  {s: "nppdvjthqldpwncqszvftbrmjlhg", expected: 6},
  {s: "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", expected: 10},
  {s: "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw", expected: 11},
];

for (const test of testCases) {
  const {s, expected} = test;
  if (calculateScore1(s) !== expected) {
    throw new Error(`Failed test case: ${s}`);
  }
}

const testCases2 = [
  {s: "mjqjpqmgbljsphdztnvjfqwrcgsmlb", expected: 19},
  {s: "bvwbjplbgvbhsrlpgdmjqwftvncz", expected: 23},
  {s: "nppdvjthqldpwncqszvftbrmjlhg", expected: 23},
  {s: "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", expected: 29},
  {s: "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw", expected: 26}
];

for (const test of testCases2) {
  const {s, expected} = test;
  if (calculateScore2(s) !== expected) {
    throw new Error(`Failed test case: ${s}`);
  }
}

console.log(`Test score is: ${calculateScore1(testData)}`);
console.log(`Part 1: ${calculateScore1(data)}`);
console.log(`Test part 2 score is: ${calculateScore2(testData)}`);
console.log(`Part 2: ${calculateScore2(data)}`);