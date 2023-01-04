const data = Deno.readTextFileSync("data/input8.txt");

const testData = `
30373
25512
65332
33549
35390
`.trim();

const parseInput = (input: string): number[][] => {
  const lines = input.trim().split("\n");
  return lines.map((l) => l.split("").map((e) => parseInt(e)));
}

const calculateScore1 = (input: string): number => {
  const grid = parseInput(input);
  const visible = new Set<string>();
  let maxHeight: number;
  let height: number;
  visible.add("0,0");
  for (let i = 1; i < grid.length; i++) {
    // check from left
    visible.add(`0,${i}`);
    maxHeight = grid[i][0];
    for (let j = 1; j < grid[i].length; j++) {
      height = grid[i][j];
      if (height > maxHeight)  {
        visible.add(`${j},${i}`);
        maxHeight = height;
      } else if (height == maxHeight) {
        continue;
      } else {
        continue;
      }
    }
    // check from right
    const farRight = grid[i].length - 1;
    visible.add(`${farRight},${i}`)
    maxHeight = grid[i][farRight];
    for (let j = farRight; j > 0; j--) {
      height = grid[i][j];
      if (height > maxHeight)  {
        visible.add(`${j},${i}`);
        maxHeight = height;
      } else if (height == maxHeight) {
        continue;
      } else {
        continue;
      }
    }
  }
  for (let j = 1; j < grid[0].length; j++) {
    // check from top
    visible.add(`${j},0`);
    maxHeight = grid[0][j];
    for (let i = 1; i < grid.length; i++) {
      height = grid[i][j];
      if (height > maxHeight)  {
        visible.add(`${j},${i}`);
        maxHeight = height;
      } else if (height == maxHeight) {
        continue;
      } else {
        continue;
      }
    }
    // check from bottom
    const bottom = grid.length - 1;
    visible.add(`${j},${bottom}`);
    maxHeight = grid[bottom][j];
    for (let i = bottom; i > 0; i--) {
      height = grid[i][j];
      if (height > maxHeight)  {
        visible.add(`${j},${i}`);
        maxHeight = height;
      } else if (height == maxHeight) {
        continue;
      } else {
        continue;
      }
    }
  }
  return visible.size;
}

const computeViewingDistance = (x: number, y: number, grid: number[][]): number => {
  // This is kind of ignoring the edge trees. None of these will be the answer anyways.
  // Look left
  let viewingDistance = 1;
  const myHeight = grid[y][x];
  let visibleLeft = 0;
  for (let i = x - 1; i >= 0; i--) {
    visibleLeft += 1;
    if (grid[y][i] >= myHeight) {
      break;
    }
  }
  // Look right
  let visibleRight = 0;
  for (let i = x + 1; i < grid[0].length; i++) {
    visibleRight += 1;
    if (grid[y][i] >= myHeight) {
      break;
    }
  }
  // Look up
  let visibleUp = 0;
  for (let j = y - 1; j >= 0; j--) {
    visibleUp += 1;
    if (grid[j][x] >= myHeight) {
      break;
    }
  }
  // Look down
  let visibleDown = 0;
  for (let j = y + 1; j < grid.length; j++) {
    visibleDown += 1;
    if (grid[j][x] >= myHeight) {
      break;
    }
  }
  const score = visibleLeft * visibleRight * visibleDown * visibleUp;
  // console.log(`${x},${y} has left: ${visibleLeft}; right: ${visibleRight}; up: ${visibleUp}; down: ${visibleDown}. Score: ${score}`);
  return score;
}

// Find the tree that can see the most trees around it. Each tree
// can see left, right, up, and down until it hits a tree at or
// above its height.
const calculateScore2 = (input: string): number => {
  const grid = parseInput(input);
  let maxViewingDistance = 1;
  let _maxCoordinates = "";
  let viewingDistance: number;
  for (let x = 0; x < grid[0].length; x++) {
    for (let y = 0; y < grid.length; y++) {
      viewingDistance = computeViewingDistance(x, y, grid);
      if (viewingDistance > maxViewingDistance) {
        maxViewingDistance = viewingDistance;
        _maxCoordinates = `${x},${y}`;
      }
    }
  }
  return maxViewingDistance;
}

console.log(`Test score is: ${calculateScore1(testData)}`); // prints 21
console.log(`Part 1: ${calculateScore1(data)}`);
console.log(`Test part 2 score is: ${calculateScore2(testData)}`);
console.log(`Part 2: ${calculateScore2(data)}`);
