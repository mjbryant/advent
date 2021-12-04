require './util'

def compute_a(input)
  # gamma is the binary number created by finding the most common bit value
  # in each bit position, in decimal form
  # epsilon is the same, but with the least common bit
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
  gamma = counts.map {|count| count > (input.size / 2) ? "1" : "0"}.join.to_i(2)
  epsilon = counts.map {|count| count < (input.size / 2) ? "1" : "0"}.join.to_i(2)
  gamma * epsilon
end

def part_a
  input = File.open("data/day3.txt").readlines
  print_result(result: compute_a(input), day: 3, part: "a")
end

def compute_b(input)

end

def part_b
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
end

test
part_a
part_b