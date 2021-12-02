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

def trigrams(x)
  x.zip(x.slice(1..,)).zip(x.slice(2..,)).map(&:flatten).to_a.slice(..-3)
end

def count_sliding_window_increases(measurements)
  count_increases(trigrams(measurements).map {|a| a.reduce(:+)})
end

def part_a
  measurements = File.open('data/day1.txt').readlines.map(&:to_i)
  print_result(result: count_increases(measurements), day: 1, part: 'a')
end

def part_b
  measurements = File.open('data/day1.txt').readlines.map(&:to_i)
  print_result(result: count_sliding_window_increases(measurements), day: 1, part: 'a')
end

def test
  measurements = [199, 200, 208, 210, 200, 207, 240, 269, 260, 263]
  assert_equal(7, count_increases(measurements))
  assert_equal(5, count_sliding_window_increases(measurements))
end

test
part_a
part_b