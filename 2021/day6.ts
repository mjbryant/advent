const data = Deno.readTextFileSync("data/day6.txt");

const testData = `3,4,3,1,2`;

const parseInput = (input: string): number[] => {
  return input.split(",").map((e) => parseInt(e));
}

const calculateScore1 = (input: string): number => {
  let allFish = parseInput(input);
  for (let i = 0; i < 80; i++) {
    const existingFish = [];
    const newFish = [];
    for (let fish of allFish) {
      fish--;
      if (fish >= 0) {
        existingFish.push(fish);
      } else {
        existingFish.push(6);
        newFish.push(8);
      }
    }
    allFish = existingFish.concat(newFish);
  }
  return allFish.length;
}

const initializeFishMap = () => {
  const fishMap: {[key: number]: number} = {};
  for (let i = 0; i < 9; i++) {
    fishMap[i] = 0;
  }
  return fishMap;
}

const calculateScore2 = (input: string): number => {
  // This doesn't work because the array gets too long. We don't need the entire
  // array, though, we can just save the # of each fish.
  const allFish = parseInput(input);
  let fishMap = initializeFishMap();
  for (const fish of allFish) {
    fishMap[fish]++;
  }
  for (let i = 0; i < 256; i++) {
    const newFishMap = initializeFishMap();
    // Do all operations on the old fish map, then swap them out at the end.
    // 0 is special because they become 6's and 8's. Everything else is normal
    for (let age = 1; age < 9; age++) {
      const numFishAtAge = fishMap[age];
      newFishMap[age - 1] = numFishAtAge;
    }
    const numNewFish = fishMap[0];
    newFishMap[8] += numNewFish;
    newFishMap[6] += numNewFish;
    fishMap = newFishMap;
  }
  let numberOfFish = 0;
  for (const number of Object.values(fishMap)) {
    numberOfFish += number;
  }
  return numberOfFish;
}


console.log(`Test score is: ${calculateScore1(testData)}`); // prints 5934
console.log(`Part 1: ${calculateScore1(data)}`);
console.log(`Test part 2 score is: ${calculateScore2(testData)}`);
console.log(`Part 2: ${calculateScore2(data)}`);
