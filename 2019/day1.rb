def compute(x)
  (x / 3) - 2
end

def part_1(filename)
  # For each number, divide by three, round down, then subtract two. 
  # Sum them all together
  result = File.open(filename).readlines.map do |line|
    compute(line.to_i)
  end.sum
  puts "Part 1 result is #{result}"
end

def part_2(filename)
  result = File.open(filename).readlines.map do |line|
    current = compute(line.to_i)
    total = 0
    while current > 0
      total += current
      current = compute(current)
    end
    total
  end.sum
  puts "Part 2 result is #{result}"
end

part_1("day1.txt")
part_2("day1.txt")