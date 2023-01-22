const data = Deno.readTextFileSync("data/day8.txt");

const testData = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`;

const parseInput = (input: string): [string[], string[]][] => {
  const lines = input.split("\n").map((l) => l.split(" | "));
  return lines.map((line) => {
    const [digitsString, outputString] = line;
    let digits = digitsString.trim().split(" ");
    let output = outputString.trim().split(" ");
    digits = digits.map((d) => d.split('').sort().join(''));
    output = output.map((d) => d.split('').sort().join(''));
    return [digits, output];
  })
}

const calculateScore1 = (input: string): number => {
  const lines = parseInput(input);
  // 1 = 2 segments; 4 = 4 segments; 7 = 3 segments; 8 = 7 segments
  let number = 0;
  for (const line of lines) {
    const [_, output] = line;
    for (const s of output) {
      if (s.length == 2 || s.length == 4 || s.length == 3 || s.length == 7) {
        number++;
      }
    }
  }
  return number;
}

// Returns the letters in a that are not in b
const diff = (a: string, b: string): string[] => {
  const sA = new Set(a);  
  const sB = new Set(b);
  const inA = [];
  for (const d of sA) {
    if (!sB.has(d)) {
      inA.push(d);
    }
  }
  return inA;
}

const overlap = (a: string, b: string): string[] => {
  const sA = new Set(a);
  const sB = new Set(b);
  const o = [];
  for (const d of sA) {
    if (sB.has(d)) {
      o.push(d);
    }
  }
  return o;
}

const remove = (l: string[], v: string) => {
  const index = l.indexOf(v);
  return l.splice(index, 1);
}

// Segments from top to bottom are 1, 2, 3, 4, 5, 6, 7
// 0 = [1, 2, 3, 5, 6, 7]     * covered by [0]
// 1 = [3, 6]                 * unique
// 2 = [1, 3, 4, 5, 7]        * covered by [2]
// 3 = [1, 3, 4, 6, 7]        * covered by [3]
// 4 = [2, 3, 4, 6]           * unique
// 5 = [1, 2, 4, 6, 7]        * covered by [5]
// 6 = [1, 2, 4, 5, 6, 7]     * covered by [6]
// 7 = [1, 3, 6]              * unique
// 8 = [1, 2, 3, 4, 5, 6, 7]  * unique
// 9 = [1, 2, 3, 4, 6, 7]     * covered by [9]

// [6] If length=6 and doesn't contain both digits from [1]
// Can figure out letter for 1 by [7] - [1]
// Can figure out letter for 3 by [8] - [6]
// Can figure out letter for 6 by [7] - letter for 3 - letter for 1
// [5] If length=5 and doesn't contain 3
// Can figure out letter for 5 by [6] - [5]
// [3] If length=5 and contains 1, 3, 6
// [2] If length=5 and not identified yet
// [9] If length=6 and x - [8] = 5
// [0] last remaining
const calculateScore2 = (input: string): number => {
  const lines = parseInput(input);
  let total = 0;
  for (const line of lines) {
    const [digits, output] = line;

    const one = digits.filter((d) => d.length == 2)[0];
    remove(digits, one);
    const four = digits.filter((d) => d.length == 4)[0];
    remove(digits, four);
    const seven = digits.filter((d) => d.length == 3)[0];
    remove(digits, seven);
    const eight = digits.filter((d) => d.length == 7)[0];
    remove(digits, eight);

    const maybeSix = digits.filter((d) => {
      return (d.length == 6 && overlap(d, one).length != 2);
    });
    if (maybeSix.length != 1) {
      throw new Error("Should only be one six candidate");
    }
    const six = maybeSix[0];
    remove(digits, six);

    const letterForOneArray = diff(seven, one);
    if (letterForOneArray.length != 1) {
      throw new Error("Seven and one should have a diff of one");
    }
    const letterForOne = letterForOneArray[0];

    const letterForThreeArray = diff(eight, six);
    if (letterForThreeArray.length != 1) {
      throw new Error("Eight and six should have a diff of one");
    }
    const letterForThree = letterForThreeArray[0];

    const letterForSixArray = diff(seven, letterForThree + letterForOne);
    if (letterForSixArray.length != 1) {
      throw new Error("Seven minus [1 + 3] should be one item");
    }
    const letterForSix = letterForSixArray[0];

    const maybeFive = digits.filter((d) => {
      return (d.length == 5 && d.indexOf(letterForThree) == -1);
    });
    if (maybeFive.length != 1) {
      throw new Error("Should only be one five candidate");
    }
    const five = maybeFive[0];
    remove(digits, five);

    const letterForFiveArray = diff(six, five);
    if (letterForFiveArray.length != 1) {
      throw new Error("Six and five should have a diff of one");
    }
    const letterForFive = letterForFiveArray[0];

    const three = digits.filter((d) => {
      return (d.length == 5 && d.indexOf(letterForOne) >= 0 && d.indexOf(letterForThree) >= 0 && d.indexOf(letterForSix) >= 0);
    })[0];
    remove(digits, three);

    const maybeTwo = digits.filter((d) => d.length == 5);
    if (maybeTwo.length != 1) {
      throw new Error("Should only be a single digit of length 5 left");
    }
    const two = maybeTwo[0];
    remove(digits, two);

    const maybeNine = digits.filter((d) => {
      const diffFromEight = diff(eight, d);
      return (d.length == 6 && diffFromEight.length == 1 && diffFromEight[0] === letterForFive);
    });
    if (maybeNine.length != 1) {
      throw new Error("Should be one candidate for nine");
    }
    const nine = maybeNine[0];
    remove(digits, nine);

    if (digits.length != 1) {
      throw new Error("Should be a single digit left");
    }
    const zero = digits[0];
    
    // Now that we have all the numbers identified we go through the output and
    // create a number and sum them all.
    const outputDigits = [];
    // OMG so elegant
    for (const outputDigit of output) {
      if (outputDigit === one) {
        outputDigits.push("1");
      } else if (outputDigit === two) {
        outputDigits.push("2");
      } else if (outputDigit === three) {
        outputDigits.push("3");
      } else if (outputDigit === four) {
        outputDigits.push("4");
      } else if (outputDigit === five) {
        outputDigits.push("5");
      } else if (outputDigit === six) {
        outputDigits.push("6");
      } else if (outputDigit === seven) {
        outputDigits.push("7");
      } else if (outputDigit === eight) {
        outputDigits.push("8");
      } else if (outputDigit === nine) {
        outputDigits.push("9");
      } else if (outputDigit === zero) {
        outputDigits.push("0");
      } else {
        throw new Error("What");
      }
    }
    total += parseInt(outputDigits.join(""));
  }
  return total;
}

console.log(`Test score is: ${calculateScore1(testData)}`); // prints 5934
console.log(`Part 1: ${calculateScore1(data)}`);
console.log(`Test part 2 score is: ${calculateScore2(testData)}`);
console.log(`Part 2: ${calculateScore2(data)}`);

