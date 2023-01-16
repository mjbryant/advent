const data = Deno.readTextFileSync("data/input14.txt");

const testData = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

type Point = {
  x: number;
  y: number;
};

const parseInput = (input: string): Point[][] => {
  const lines = input.split("\n");
  const rockFormations: Point[][] = [];
  for (const line of lines) {
    const points: Point[] = [];
    for (const rawPoint of line.split(" -> ")) {
      const [x, y] = rawPoint.split(",").map((n) => parseInt(n));
      points.push({ x, y });
    }
    rockFormations.push(points);
  }
  return rockFormations;
};

const findBounds = (
  formations: Point[][],
): Bounds => {
  let minX = Number.MAX_SAFE_INTEGER;
  let maxX = 0;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxY = 0;
  for (const formation of formations) {
    for (const point of formation) {
      const { x, y } = point;
      if (x > maxX) {
        maxX = x;
      }
      if (x < minX) {
        minX = x;
      }
      if (y > maxY) {
        maxY = y;
      }
      if (y < minY) {
        minY = y;
      }
    }
  }
  return { minX, maxX, minY: 0, maxY };
};

type cell = "#" | "o" | "." | "+";

type Bounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

const traverse = (prevPoint: Point, point: Point): Point[] => {
  const minX = Math.min(prevPoint.x, point.x);
  const maxX = Math.max(prevPoint.x, point.x);
  const minY = Math.min(prevPoint.y, point.y);
  const maxY = Math.max(prevPoint.y, point.y);
  const points: Point[] = [];
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      points.push({ x, y });
    }
  }
  return points;
};

class Grid {
  grid: cell[][];
  bounds: Bounds;

  constructor(numColumns: number, numRows: number, bounds: Bounds) {
    this.bounds = bounds;
    this.grid = [];
    for (let i = 0; i < numRows; i++) {
      const row: cell[] = [];
      for (let j = 0; j < numColumns; j++) {
        row.push(".");
      }
      this.grid.push(row);
    }
  }

  addFormations(formations: Point[][]) {
    for (const formation of formations) {
      let prevPoint = formation[0];
      for (const point of formation.slice(1)) {
        for (const interimPoint of traverse(prevPoint, point)) {
          this
            .grid[interimPoint.y - this.bounds.minY][
              interimPoint.x - this.bounds.minX
            ] = "#";
        }
        prevPoint = point;
      }
    }
    // And add the +
    const entryPoint = { x: 500 - this.bounds.minX, y: 0 };
    this.grid[entryPoint.y][entryPoint.x] = "+";
  }

  valueAt(point: Point): cell {
    return this.grid[point.y][point.x];
  }

  // Add a block of sand at 500,0, then progress time until the block comes
  // to rest. Return false if the sand falls off the grid.
  addSand(): boolean {
    // In the test this will be (6,0)
    let location = { x: 500 - this.bounds.minX, y: 0 };
    // This means that the sand is entirely stuck at the top.
    if (this.valueAt(location) === "o") {
      return false;
    }
    while (true) {
      // We're at the bottom
      if (location.y == this.bounds.maxY) {
        return false;
      }
      if (this.valueAt({ x: location.x, y: location.y + 1 }) === ".") {
        // It's empty, so move it down
        location = { x: location.x, y: location.y + 1 };
      } else {
        if (location.x == 0) {
          // Then we're done, return false
          return false;
        }
        if (this.valueAt({ x: location.x - 1, y: location.y + 1 }) === ".") {
          // Move diagonal left
          location = { x: location.x - 1, y: location.y + 1 };
        } else if (
          this.valueAt({ x: location.x + 1, y: location.y + 1 }) === "."
        ) {
          // Move diagonal right
          location = { x: location.x + 1, y: location.y + 1 };
        } else {
          // Blocked, but not falling off the side. Mark the place where it's rested
          // and return true;
          this.grid[location.y][location.x] = "o";
          return true;
        }
      }
    }
  }

  print() {
    for (const row of this.grid) {
      console.log(row.join(""));
    }
  }
}

const calculateScore1 = (input: string): number => {
  const formations = parseInput(input);
  const bounds = findBounds(formations);
  const { minX, maxX, minY, maxY } = bounds;
  const numColumns = maxX - minX + 1;
  const numRows = maxY - minY + 1;
  const grid = new Grid(numColumns, numRows, bounds);
  grid.addFormations(formations);
  // grid.print();
  let grains = 0;
  while (grid.addSand()) {
    // console.log(`Step ${grains}`);
    // grid.print();
    // Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 200);
    grains++;
  }
  return grains;
};

const calculateScore2 = (input: string): number => {
  // We now need to model the floor at maxY + 2 and infinitely in each X direction.
  // The sand will at most fill in a pyramid, so we need to extend the grid maxY/2
  // (I think, give or take a bit) on either side of (500, 0), and then add the floor.
  // We can do this by just adding the floor formation and then adding the blockage
  // condition.
  const formations = parseInput(input);
  let bounds = findBounds(formations);
  const floorY = bounds.maxY + 2;
  const floor: Point[] = [
    {
      x: 500 - bounds.maxY - 2,
      y: floorY,
    },
    {
      x: 500 + bounds.maxY + 2,
      y: floorY,
    },
  ];
  formations.push(floor);

  bounds = findBounds(formations);
  const { minX, maxX, minY, maxY } = bounds;
  const numColumns = maxX - minX + 1;
  const numRows = maxY - minY + 1;
  const grid = new Grid(numColumns, numRows, bounds);

  grid.addFormations(formations);
  // grid.print();
  let grains = 0;
  while (grid.addSand()) {
    // console.log(`Step ${grains}`);
    // grid.print();
    // Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 200);
    grains++;
  }
  return grains;
};

console.log(`Test score is: ${calculateScore1(testData)}`);
console.log(`Part 1: ${calculateScore1(data)}`);
console.log(`Test part 2 score is: ${calculateScore2(testData)}`);
console.log(`Part 2: ${calculateScore2(data)}`);
