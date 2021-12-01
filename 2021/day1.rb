require './util'

def count_increases(measurements)
  previous = Float::INFINITY
  increases = 0
  measurements.each do |m|
    increases += 1 if m > previous
    previous = m
  end
  increases
end

def part_a
  measurements = File.open('data/day1.txt').readlines.map(&:to_i)
  print_result(result: count_increases(measurements), day: 1, part: 'a')
end

def test
  measurements = [199, 200, 208, 210, 200, 207, 240, 269, 260, 263]
  assert_equal(7, count_increases(measurements))
end

test
part_a