require 'set'
require './util'

def part_a
  print_result(result: compute_a('data/day5.txt'), day: 5, part: 'a')
end

def compute_a(file)
  # Given the list of lines, consider ONLY horizonal and vertical lines,
  # and find all the points where at least two lines overlap. The simplest
  # way to do this is probably just to brute force it with a huge hash map.
  seen = Set.new
  doubles = Set.new
  File.open(file).readlines.each do |line|
    p1, p2 = line.strip.split(' -> ')
    p1x, p1y = p1.split(',').map(&:to_i)
    p2x, p2y = p2.split(',').map(&:to_i)
    # Consider only horizontal and vertical lines
    next if p1x != p2x and p1y != p2y
    doubles.add([p1x, p1y]) if seen.include?([p1x, p1y])
    doubles.add([p2x, p2y]) if seen.include?([p2x, p2y])
    seen.add([p1x, p1y])
    seen.add([p2x, p2y])
    if (p1x.abs - p2x.abs).abs > 1
      # Ruby is so ugly sometimes, but I guess this is my fault
      if p1y != p2y
        raise StandardError.new('WHAT')
      end
      x_start = [p1x, p2x].min + 1
      x_end = [p1x, p2x].max - 1
      (x_start..x_end).each do |x|
        doubles.add([x, p1y]) if seen.include?([x, p1y])
        seen.add([x, p1y])
      end
    # This is elsif because only one of these is true for horiz/vert
    elsif (p1y.abs - p2y.abs).abs > 1
      if p1x != p2x
        raise StandardError.new('HOW')
      end
      y_start = [p1y, p2y].min + 1
      y_end = [p1y, p2y].max - 1
      (y_start..y_end).each do |y|
        doubles.add([p1x, y]) if seen.include?([p1x, y])
        seen.add([p1x, y])
      end
    end
  end
  doubles.size
end

def part_b
end

def test
  assert_equal(compute_a('data/day5.test.txt'), 5)
end

test
part_a
part_b