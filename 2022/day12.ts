const data = Deno.readTextFileSync("data/input12.txt");

const testData = `
Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi
`.trim();

type Edge = {
  src: string;
  dst: string;
};

type Node = {
  id: string;
  value: number;
  x: number;
  y: number;
  neighbors: string[]; // list of accessible neighbors
}

type Graph = {
  nodes: {[key: string]: Node};
  start: string;
  end: string;
};

const parseInput = (input: string): Graph => {
  const graph: Graph = {nodes: {}, start: "", end: ""};
  const lines: string[] = input.split("\n");
  let start = "";
  let end = "";
  for (let y = 0; y < lines.length; y++) {
    const values = lines[y].split("");
    for (let x = 0; x < values.length; x++) {
      let value: number = values[x].charCodeAt(0) - 97;
      if (values[x] === 'S') {
        start = `${x},${y}`;
        value = -1;
      } else if (values[x] === 'E') {
        end = `${x},${y}`;
        value = 26;
      }
      const node: Node = {
        id: `${x},${y}`,
        neighbors: [],
        value,
        x,
        y,
      }
      graph.nodes[node.id] = node;
    }
  }
  graph.start = start;
  graph.end = end;
  for (const node of Object.values(graph.nodes)) {
    // find neighbors and create edges if traversal is possible
    const left = graph.nodes[`${node.x - 1},${node.y}`];
    const right = graph.nodes[`${node.x + 1},${node.y}`];
    const up = graph.nodes[`${node.x},${node.y - 1}`];
    const down = graph.nodes[`${node.x},${node.y + 1}`];
    [left, right, up, down].forEach((neighbor) => {
      if (neighbor != undefined) {
        if ((node.value - neighbor.value > -2)) {
          node.neighbors.push(neighbor.id);
        }
      }
    });
  }
  return graph;
}

const printPath = (previous: {[key: string]: string}, end: string, start: string): void => {
  // Only works for the test input
  const map = [
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
  ]
  let current = end;
  while (current !== start) {
    const [xString, yString] = current.split(',');
    const x = parseInt(xString);
    const y = parseInt(yString);
    map[y][x] = 'o';
    console.log(current);
    for (const row of map) {
      console.log(row.join(''));
    }
    current = previous[current];
  }
}

const findShortestPath = (graph: Graph, start: string): number => {
  const distances: {[key: string]: number} = {};
  const previous: {[key: string]: string} = {};
  const queue = new Set<string>();

  for (const node of Object.values(graph.nodes)) {
    distances[node.id] = Number.MAX_SAFE_INTEGER;
    previous[node.id] = "";
    queue.add(node.id);
  }
  distances[start] = 0;

  while (queue.size > 0) {
    // Find the vertex in queue with the shortest distance. Can do this with a
    // smarter data structure if it's super slow in the big case.
    let minDistance = Number.MAX_SAFE_INTEGER;
    let candidate = "INVALID";
    let distance: number;
    for (const [_, node] of queue.entries()) {
      distance = distances[node] ;
      if (distance <= minDistance) {
        minDistance = distance;
        candidate = node;
      }
    }
    queue.delete(candidate);

    for (const neighbor of graph.nodes[candidate].neighbors) {
      if (!queue.has(neighbor)) {
        continue;
      }
      const alt = distances[candidate] + 1;
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        previous[neighbor] = candidate;
      }
    }

  }

  // At this point we have distances populated with the shortest distances
  // from each node to E. previous is populated with the node before each
  // node in the shortest path.
  // printPath(previous, graph.end, graph.start);
  return distances[graph.end];
}

const calculateScore1 = (input: string): number => {
  const graph = parseInput(input);
  const shortestPathLength = findShortestPath(graph, graph.start);
  return shortestPathLength;
}

const calculateScore2 = (input: string): number => {
  // Find the best 'a' in the whole graph. This is going to be hella slow, but that's fine.
  const graph = parseInput(input);
  const allAs = Object.values(graph.nodes).map((node) => {
    if (node.value == 0 || node.value == -1) {
      return node;
    }
    return null;
  }).filter((node) => node !== null);
  let minDistance = Number.MAX_SAFE_INTEGER;
  allAs.forEach((node) => {
    const shortestPathLength = findShortestPath(graph, node!.id);
    if (shortestPathLength < minDistance) {
      minDistance = shortestPathLength;
    }
  });
  return minDistance;
}

console.log(`Test score is: ${calculateScore1(testData)}`);
console.log(`Part 1: ${calculateScore1(data)}`);
console.log(`Test part 2 score is: ${calculateScore2(testData)}`);
console.log(`Part 2: ${calculateScore2(data)}`);