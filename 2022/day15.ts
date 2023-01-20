const data = Deno.readTextFileSync("data/input15.txt");

const testData = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`;

type Point = {
  x: number;
  y: number;
};

// Computes Manhattan distance between a and b
const distance = (a: Point, b: Point): number => {
  return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y));
};

class Sensor {
  location: Point;
  closestBeacon: Point;
  radius: number;

  constructor(location: Point, closestBeacon: Point) {
    this.location = location;
    this.closestBeacon = closestBeacon;
    this.radius = distance(location, closestBeacon);
  }
}

const SENSOR_RE =
  /^Sensor at x=([-]?[0-9]+), y=([-]?[0-9]+): closest beacon is at x=([-]?[0-9]+), y=([-]?[0-9]+)$/;

const parseInput = (input: string): Sensor[] => {
  const lines = input.split("\n");
  const sensors = lines.map((line) => {
    const match = line.match(SENSOR_RE);
    if (match == null) {
      throw new Error(`Expected regex match. Line: ${line}`);
    }
    const [sensorX, sensorY, beaconX, beaconY] = match.slice(1).map((s) =>
      parseInt(s)
    );
    return new Sensor({ x: sensorX, y: sensorY }, { x: beaconX, y: beaconY });
  });
  return sensors;
};

const getCoverage = (sensor: Sensor, y: number): [number, number] | null => {
  if (
    (sensor.location.y - sensor.radius) <= y &&
    y <= (sensor.location.y + sensor.radius)
  ) {
    const diffY = Math.abs(sensor.location.y - y);
    // The total width of the overlapping row. It goes from Y - (width - 1) / 2
    // to the left and Y + (width - 1) / 2 to the right.
    const overlapWidth = sensor.radius * 2 + 1 - (diffY * 2);
    return [
      sensor.location.y - ((overlapWidth - 1) / 2),
      sensor.location.y + ((overlapWidth - 1) / 2),
    ];
  }
  // If they don't overlap, return null
  return null;
};

// Could have a Sensor class that has a location and a distance
// to the nearest beacon. The distance is an effective circle that
// forms the coverage of the sensor. We can then loop through all
// sensors with a given Y coordinate to figure out their coverage
// of that band.
const calculateScore1 = (input: string, y: number): number => {
  const sensors = parseInput(input);
  const coverageRanges = sensors.map((s) => getCoverage(s, y));
  const combinedRanges = [];
  for (const r of coverageRanges) {
    if (r == null) {
      continue;
    }
    const [start, end] = r;
    // Search through the combinedRanges
  }
  // Then sum the ranges
  return NaN;
};

const calculateScore2 = (input: string): number => {
  return NaN;
};

console.log(`Test score is: ${calculateScore1(testData, 10)}`);
// console.log(`Part 1: ${calculateScore1(data, 2000000)}`);
// console.log(`Test part 2 score is: ${calculateScore2(testData)}`);
// console.log(`Part 2: ${calculateScore2(data)}`);
