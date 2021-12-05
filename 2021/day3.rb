require './util'

def get_counts(input)
  string_length = input.first.strip.size
  counts = [0] * string_length
  input.each do |binary_string|
    binary_string = binary_string.strip
    next if binary_string.nil? || binary_string == ""
    if binary_string.size != string_length
      raise StandardError.new(
        "Not all strings are the same length. "\
        "First size: #{string_length}. This size: #{binary_string.size}"
      )
    end
    (0..string_length - 1).each do |index|
      counts[index] += binary_string[index].to_i
    end
  end
  counts
end

def compute_a(input)
  # gamma is the binary number created by finding the most common bit value
  # in each bit position, in decimal form
  # epsilon is the same, but with the least common bit
  counts = get_counts(input)
  gamma = counts.map {|count| count > (input.size / 2) ? "1" : "0"}.join.to_i(2)
  epsilon = counts.map {|count| count < (input.size / 2) ? "1" : "0"}.join.to_i(2)
  gamma * epsilon
end

def part_a
  input = File.open("data/day3.txt").readlines
  print_result(result: compute_a(input), day: 3, part: "a")
end

def compute_b(input)
  # start with the leftmost bit and discard numbers according to "bit criteria",
  # then continue with the next leftmost bit until there's only one number left.
  # oxygen: bit criteria is most common value, 1 breaks ties
  # co2_scrubber: least common value, 0 breaks ties
  oxygen = reduce_strings(input, tiebreak: '1', gt: '1', lt: '0')
  co2_scrubber = reduce_strings(input, tiebreak: '0', gt: '0', lt: '1')
  oxygen * co2_scrubber
end

def reduce_strings(input, tiebreak:, gt:, lt:)
  mod_input = input.dup
  bit_position = 0
  while mod_input.size > 1
    counts = get_counts(mod_input)
    threshold = (mod_input.size / 2.to_f)
    selector_value = if counts[bit_position] == threshold
      tiebreak
    elsif counts[bit_position] > threshold
      gt
    else
      lt
    end
    mod_input = mod_input.filter {|x| x[bit_position] == selector_value}
    bit_position += 1
  end
  if mod_input.size != 1
    raise StandardError.new("Incorrect reduction: #{mod_input}")
  end
  mod_input.first.to_i(2)
end

def part_b
  input = File.open("data/day3.txt").readlines
  print_result(result: compute_b(input), day: 3, part: "b")
end

def test
  input = [
    "00100",
    "11110",
    "10110",
    "10111",
    "10101",
    "01111",
    "00111",
    "11100",
    "10000",
    "11001",
    "00010",
    "01010",
  ]
  assert_equal(compute_a(input), 198)
  assert_equal(compute_b(input), 230)
end

test
part_a
part_b