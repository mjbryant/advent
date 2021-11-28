def assert_equal(a, b)
  if a != b
    raise StandardError.new("#{a} != #{b}")
  end
end

def assert(x)
  assert_equal(x, true)
end

def refute(x)
  assert_equal(x, false)
end

def print_result(result:, day:, part:)
  validate(day: day, part: part)
  puts "#{day}.#{part}: #{result}"
end

private def validate(day:, part:)
  if day < 1 || day > 25
    raise new StandardError("Invalid day: #{day}")
  end
  if !["a", "b"].include?(part)
    raise new StandardError("Invalid part: #{part}")
  end
end