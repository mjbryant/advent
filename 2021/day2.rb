require './util'

def compute_a(input)
  x = 0
  z = 0
  input.each do |command|
    direction, distance = command.split(' ')
    distance = distance.to_i
    case direction
    when 'forward'
      x += distance
    when 'down'
      z += distance
    when 'up'
      z -= distance
    else
      raise StandardError.new("Invalid command: #{command}")
    end
  end
  x * z
end

def compute_b(input)
  # down Y increases aim by Y
  # up Y decreases aim by Y
  # forward Y increases x by Y AND increases z by (aim * Y)
  aim = 0
  x = 0
  z = 0
  input.each do |command|
    direction, distance = command.split(' ')
    distance = distance.to_i
    case direction
    when 'forward'
      x += distance
      z += (aim * distance)
    when 'down'
      aim += distance
    when 'up'
      aim -= distance
    else
      raise StandardError.new("Invalid command: #{command}")
    end
  end
  x * z
end

def part_a
  input = File.open('data/day2.txt').readlines
  print_result(result: compute_a(input), day: 2, part: 'a')
end

def part_b
  input = File.open('data/day2.txt').readlines
  print_result(result: compute_b(input), day: 2, part: 'b')
end

def test
  input = [
    "forward 5",
    "down 5",
    "forward 8",
    "up 3",
    "down 8",
    "forward 2",
  ]
  assert_equal(compute_a(input), 150)
  assert_equal(compute_b(input), 900)
end

test
part_a
part_b