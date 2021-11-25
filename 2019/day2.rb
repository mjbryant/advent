require './util'

def part_a(filename)
  opcodes = File.open(filename).read.split(",").map(&:to_i)
  opcodes[1] = 12
  opcodes[2] = 2
  new_opcodes = compute(opcodes)
  print_result(result: new_opcodes[0], day: 2, part: "a")
end

def part_b(filename)
  # What pair of inputs (replacement ints to positions 1 and 2) produce
  # the output (opcodes[0], after computation) of 19690720, then return
  # 100 * noun + verb. Both noun and verb are between 0 and 99
  opcodes = File.open(filename).read.split(",").map(&:to_i)
  (0..99).map do |noun|
    (0..99).map do |verb|
      candidate = opcodes.dup
      candidate[1] = noun
      candidate[2] = verb
      new_opcodes = compute(candidate)
      if new_opcodes[0] == 19690720
        print_result(result: (100 * noun + verb), day: 2, part: "b")
        return
      end
    end
  end
  raise StandardError.new("No noun/verb combination found")
end

def compute(opcodes)
  new_opcodes = opcodes.dup
  position = 0
  while new_opcodes[position] != 99
    a_index = new_opcodes[position + 1]
    b_index = new_opcodes[position + 2]
    c_index = new_opcodes[position + 3]
    if new_opcodes[position] == 1
      new_opcodes[c_index] = new_opcodes[a_index] + new_opcodes[b_index]
    elsif new_opcodes[position] == 2
      new_opcodes[c_index] = new_opcodes[a_index] * new_opcodes[b_index]
    else
      raise StandardError.new("Incorrect opcode at position #{position}: #{new_opcodes[position]}")
    end
    position += 4
  end
  return new_opcodes
end

def test
  assert_equal(compute([1,0,0,0,99]), [2,0,0,0,99])
  assert_equal(compute([2,3,0,3,99]), [2,3,0,6,99])
  assert_equal(compute([2,4,4,5,99,0]), [2,4,4,5,99,9801])
  assert_equal(compute([1,1,1,4,99,5,6,0,99]), [30,1,1,4,2,5,6,0,99])
  puts "All tests pass"
end

part_a("./data/day2.txt")
part_b("./data/day2.txt")
test