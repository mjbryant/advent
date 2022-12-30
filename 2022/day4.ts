const data = Deno.readTextFileSync("data/input4.txt");

const testData = `
2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8
`;

// How many pairs fully contain the other?
const calculateScore1 = (input: string): number => {
  const lines = input.split("\n").filter((e) => e !== "");
  let count = 0;
  for (const line of lines) {
    const [first, second] = line.split(",");
    const [firstStart, firstEnd] = first.split("-").map((e) => parseInt(e));
    const [secondStart, secondEnd] = second.split("-").map((e) => parseInt(e));
    if (
      (firstStart >= secondStart && firstEnd <= secondEnd) ||
      (secondStart >= firstStart && secondEnd <= firstEnd)
    ) {
      count++;
    }
  }
  return count;
}

// How many pairs overlap at all?
const calculateScore2 = (input: string): number => {
  const lines = input.split("\n").filter((e) => e !== "");
  let count = 0;
  for (const line of lines) {
    const [first, second] = line.split(",");
    const [firstStart, firstEnd] = first.split("-").map((e) => parseInt(e));
    const [secondStart, secondEnd] = second.split("-").map((e) => parseInt(e));
    if (
      (firstStart >= secondStart && firstStart <= secondEnd) ||
      (secondStart >= firstStart && secondStart <= firstEnd) ||
      (firstEnd >= secondStart && firstEnd <= secondEnd) ||
      (secondEnd >= firstStart && secondEnd <= firstEnd)
    ) {
      count++;
    }
  }
  return count;
}

console.log(`Test score is: ${calculateScore1(testData)}`); // prints 15
console.log(`Part 1: ${calculateScore1(data)}`);
console.log(`Test part 2 score is: ${calculateScore2(testData)}`);
console.log(`Part 2: ${calculateScore2(data)}`);