const data = Deno.readTextFileSync("data/input9.txt");

const testData = `
R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
`.trim();

const parseInput = (input: string): [string, number][] => {
  const lines = input.split("\n");
  return lines.map((l) => {
    const [direction, numberString] = l.split(" ");
    const number = parseInt(numberString);
    if (isNaN(number)) {
      throw new Error(`Invalid line: ${l}`)
    }
    return [direction, parseInt(numberString)];
  });
}

type Direction = 'R' | 'L' | 'U' | 'D';

type Point = [number, number];

const moveHead = (head: Point, direction: Direction): Point => {
  if (direction === 'R') {
    return [head[0] + 1, head[1]];
  } else if (direction === 'L') {
    return [head[0] - 1, head[1]];
  } else if (direction === 'U') {
    return [head[0], head[1] + 1];
  } else {
    return [head[0], head[1] - 1];
  }
}

const maybeMoveTail = (tail: Point, head: Point): Point => {
  const diffX = head[0] - tail[0];
  const diffY = head[1] - tail[1];
  if (Math.abs(diffX) < 2 && Math.abs(diffY) < 2) {
    return tail;
  } else if (Math.abs(diffX) == 2 && diffY == 0) {
    return [tail[0] + diffX / 2, tail[1]];
  } else if (diffX == 0 && Math.abs(diffY) == 2) {
    return [tail[0], tail[1] + diffY / 2];
  } else if (Math.abs(diffX) == 2 && Math.abs(diffY) == 1) {
    return [tail[0] + diffX / 2, tail[1] + diffY];
  } else if (Math.abs(diffY) == 2 && Math.abs(diffX) == 1) {
    return [tail[0] + diffX, tail[1] + diffY / 2];
  } else if (Math.abs(diffY) == 2 && Math.abs(diffX) == 2) {
    return [tail[0] + diffX / 2, tail[1] + diffY / 2];
  } else {
    throw new Error(`Should never get into this state: ${head}, ${tail}`);
  }
}

const calculateScore1 = (input: string): number => {
  const commands = parseInput(input);
  const visited = new Set<string>();
  let head: Point = [0, 0];
  let tail: Point = [0, 0];
  for (let [direction, number] of commands) {
    while (number > 0) {
      head = moveHead(head, direction as Direction);
      tail = maybeMoveTail(tail, head);
      // console.log(`Head: (${head[0]},${head[1]}); Tail: (${tail[0]},${tail[1]})`);
      visited.add(`${tail[0]},${tail[1]}`);
      number--;
    }
  }
  return visited.size;
}

const testData2 = `
R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20
`.trim();

const calculateScore2 = (input: string): number => {
  const commands = parseInput(input);
  const visited = new Set<string>();
  const knots: Point[] = [
    [0, 0], // head
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0], // tail
  ];
  for (let [direction, number] of commands) {
    while (number > 0) {
      knots[0] = moveHead(knots[0], direction as Direction);
      for (let i = 1; i < knots.length; i++) {
        knots[i] = maybeMoveTail(knots[i], knots[i - 1]);
      }
      visited.add(`${knots[knots.length - 1][0]},${knots[knots.length - 1][1]}`);
      number--;
    }
  }
  return visited.size;
}

console.log(`Test score is: ${calculateScore1(testData)}`); // prints 21
console.log(`Part 1: ${calculateScore1(data)}`);
console.log(`Test part 2 score is: ${calculateScore2(testData2)}`);
console.log(`Part 2: ${calculateScore2(data)}`);

