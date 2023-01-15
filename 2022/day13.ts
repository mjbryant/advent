import { sum } from "https://deno.land/x/math@v1.1.0/mod.ts";

const data = Deno.readTextFileSync("data/input13.txt");

const testData = `
[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]
`.trim();

type Packet = (number | Packet)[];

const parseInput = (input: string): Packet[] => {
  const pairs = input.split('\n\n')
    .map((pair) => pair.split('\n'));
  const parsed = pairs.map((p) => p.map((e) => eval(e))) as Packet[];
  return parsed;
}

type Result = -1 | 0 | 1;

const convert = (item: Packet): Packet => {
  if (typeof item === "number") {
    return [item];
  }
  return item;
}

const inCorrectOrder = (left: Packet, right: Packet): Result => {
  const leftStack = [];
  const rightStack = [];
  // At this point both left and right are guaranteed to be lists, so push all items
  // onto their respective stacks.
  for (const item of left as Packet[]) {
    leftStack.push(item);
  }
  for (const item of right as Packet[]) {
    rightStack.push(item);
  }
  while (true) {
    if (leftStack.length == 0 && rightStack.length != 0) {
      // Left is exhausted first
      return -1;
    } else if (rightStack.length == 0 && leftStack.length != 0) {
      // Right is exhausted first
      return 1;
    } else if (leftStack.length == 0 && rightStack.length == 0) {
      // The lists are exhausted at the same time. This should only ever happen
      // recursively. We break out and return "same". This covers the case of comparing
      // two equal integers.
      break;
    }
    // Now we're guaranteed to have at least one item in each packet, so pop them off
    // and compare them.
    const leftItem = leftStack.shift() as Packet;
    const rightItem = rightStack.shift() as Packet;
    if (typeof leftItem === "number" && typeof rightItem === "number") {
      if (leftItem < rightItem) {
        return -1;
      } else if (rightItem < leftItem) {
        return 1;
      }
      // They're both integers and they're the same. In this case we loop back up to
      // the beginning of the while loop and try to pop the next item off.
    } else {
      // They're different types. Make sure they're both lists and check them. If they're the same
      // keep going, if there's a definitive answer, return it.
      const result = inCorrectOrder(convert(leftItem), convert(rightItem));
      if (result != 0) {
        return result;
      }
    }
  }
  return 0;
}

// Rules for comparing left and right:
// If both are integers, lower integer comes first; same skips to next part
// If both are lists, compare first item of each list and so on using recusion.
//    If left list runs out of items first, they're in the right order.
// If one is an integer and one is a list, the integer becomes [<int>]
// What are the (1-indexed) indices of the pairs that are already in the right order?
const calculateScore1 = (input: string): number => {
  const packets = parseInput(input);
  const rightOrderIndices: number[] = [];
  for (let i = 0; i < packets.length; i++) {
    const [left, right] = packets[i];
    // At this point they're both guaranteed to be lists.
    const result = inCorrectOrder(left as Packet, right as Packet);
    if (result < 0) {
      rightOrderIndices.push(i + 1);
    } else if (result == 0) {
      throw new Error("This shouldn't happen!");
    }
  }
  return parseInt(sum(rightOrderIndices));
}

const calculateScore2 = (input: string): number => {
  let packets: Packet[] = [[[2]], [[6]]];
  const packetPairs = parseInput(input);
  for (const pair of packetPairs) {
    packets = packets.concat(pair)
  }
  const sortedPackets = packets.sort(inCorrectOrder);
  // Find first decoder packet, ignoring Javascript's stupid equality rules
  let i = 1;
  while (true) {
    if (JSON.stringify(sortedPackets[i - 1]) === JSON.stringify([[2]])) {
      break;
    }
    i++;
  }
  let j = 1;
  while (true) {
    if (JSON.stringify(sortedPackets[j - 1]) === JSON.stringify([[6]])) {
      break;
    }
    j++;
  }

  return i * j;
}

console.log(`Test score is: ${calculateScore1(testData)}`);
console.log(`Part 1: ${calculateScore1(data)}`);
console.log(`Test part 2 score is: ${calculateScore2(testData)}`);
console.log(`Part 2: ${calculateScore2(data)}`);