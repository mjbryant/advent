require './util'

# Password rules:
# - six digit number
# - within the range 178416-676461
# - two adjacent digits are the same (e.g. 122345)
# - going from left to right the digits never decrease

# The easiest way to do this is just to write a meets_criteria
# method and then brute force it. I'm guessing this is going to
# screw me on the second part, but let's see.

def part_a
  result = 0
  (178416..676461).each do |num|
    if meets_criteria(num)
      result += 1
    end
  end
  print_result(result: result, day: 4, part: "a")
end

def meets_criteria(number)
  s = number.to_s.split('').map(&:to_i)
  return false if s.size != 6
  has_double = false
  (1..5).each do |pos|
    return false if s[pos] < s[pos - 1]
    if s[pos] == s[pos - 1]
      has_double = true
    end
  end
  has_double
end

def test
  assert(meets_criteria(111111))
  refute(meets_criteria(223450))
  refute(meets_criteria(123789))
  assert(meets_criteria(111123))
  assert(meets_criteria(133567))
end

test
part_a