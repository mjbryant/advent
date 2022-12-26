// A = rock; B = paper; C = scissors
// X = rock; Y = paper; Z = scissors
// rock = 1; paper = 2; scissors = 3
// lose = 0; draw = 3; win = 6
// First column: opponent; second column: you
const games = Deno.readTextFileSync("data/input2.txt").split("\n");