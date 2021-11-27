require './util'

DISTANCE = lambda do |point, steps_a, steps_b|
  point[0].abs + point[1].abs
end

NUM_STEPS = lambda do |point, steps_a, steps_b|
  steps_a + steps_b
end

def part_a(filename)
  lines = File.open(filename).readlines
  if lines.size != 2
    raise StandardError.new("Invalid file")
  end
  result = compute(lines[0], lines[1], DISTANCE)
  print_result(result: result, day: 3, part: "a")
end

def part_b(filename)
  lines = File.open(filename).readlines
  if lines.size != 2
    raise StandardError.new("Invalid file")
  end
  result = compute(lines[0], lines[1], NUM_STEPS)
  print_result(result: result, day: 3, part: "b")
end

def get_covered_points(line)
  points = {}
  pos = [0, 0]
  steps = 0
  line.split(",").each do |move|
    direction = move[0]
    amount = move[1..,].to_i
    if !["R", "U", "L", "D"].include?(direction) || !(amount > 0)
      raise StandardError.new("Invalid move command: #{move}")
    end
    incr_fn = case direction
      when "R"
        lambda {|pos| [pos[0] + 1, pos[1]]}
      when "U"
        lambda {|pos| [pos[0], pos[1] + 1]}
      when "L"
        lambda {|pos| [pos[0] - 1, pos[1]]}
      when "D"
        lambda {|pos| [pos[0], pos[1] - 1]}
    end
    while amount > 0
      points[pos] = steps
      pos = incr_fn.call(pos)
      amount -= 1
      steps += 1
    end
  end
  return points
end

def compute(line1, line2, fn)
  # Each line is a string containing the path the wire takes. Figure out
  # the point closest to the starting point where the wires cross (not
  # including the starting point itself). The brute force way of doing
  # this would be to just maintain a list for each wire of the points
  # that they go through, then find all the shared ones and return the
  # one with the smallest sum, but this is going to be terribly inefficient.
  # But who cares about efficiency anyways? Geometry is hard.
  line1_points = get_covered_points(line1)
  line2_points = get_covered_points(line2)
  minimum = Float::INFINITY
  closest_point = nil
  line1_points.each do |point, steps_1|
    next if point == [0, 0]
    if line2_points.include?(point)
      steps_2 = line2_points[point]
      d = fn.call(point, steps_1, steps_2)
      if d < minimum
        minimum = d
        closest_point = point.dup
      end
    end
  end
  minimum
end

def test
  assert_equal(
    compute(
      "R8,U5,L5,D3",
      "U7,R6,D4,L4",
      DISTANCE
    ),
    6
  )
  assert_equal(
    compute(
      "R8,U5,L5,D3",
      "U7,R6,D4,L4",
      NUM_STEPS
    ),
    30
  )
  assert_equal(
    compute(
      "R75,D30,R83,U83,L12,D49,R71,U7,L72",
      "U62,R66,U55,R34,D71,R55,D58,R83",
      DISTANCE
    ),
    159
  )
  assert_equal(
    compute(
      "R75,D30,R83,U83,L12,D49,R71,U7,L72",
      "U62,R66,U55,R34,D71,R55,D58,R83",
      NUM_STEPS
    ),
    610
  )
  assert_equal(
    compute(
      "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51",
      "U98,R91,D20,R16,D67,R40,U7,R15,U6,R7",
      DISTANCE
    ),
    135
  )
  assert_equal(
    compute(
      "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51",
      "U98,R91,D20,R16,D67,R40,U7,R15,U6,R7",
      NUM_STEPS
    ),
    410
  )
end

part_a("./data/day3.txt")
part_b("./data/day3.txt")
test