require './util'

def compute(x)
  (x / 3) - 2
end

def part_a(filename)
  # For each number, divide by three, round down, then subtract two. 
  # Sum them all together
  result = File.open(filename).readlines.map do |line|
    compute(line.to_i)
  end.sum
  print_result(result: result, day: 1, part: "a")
end

def part_b(filename)
  result = File.open(filename).readlines.map do |line|
    current = compute(line.to_i)
    total = 0
    while current > 0
      total += current
      current = compute(current)
    end
    total
  end.sum
  print_result(result: result, day: 1, part: "b")
end

part_a("./data/day1.txt")
part_b("./data/day1.txt")