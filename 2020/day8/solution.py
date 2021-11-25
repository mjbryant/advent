import sys
from collections import namedtuple
from copy import deepcopy

Instruction = namedtuple('Instruction', ('name', 'amount'))

def parse(line):
  instr, amount = line.split(' ')
  return Instruction(instr, int(amount))

def read_file(filename):
  with open(filename) as f:
    return [parse(line.strip()) for line in f.readlines()]

# Part 1: find the value of the accumulator when the first loop in
# the instruction cycle is hit.

def detect_loop(instructions):
  i = 0
  acc = 0
  visited = set()
  while True:
    instr = instructions[i]
    if i in visited:
      return (acc, i)
    visited.add(i)
    if instr.name == 'nop':
      i += 1
    elif instr.name == 'acc':
      acc += instr.amount
      i += 1
    else: # jmp
      i += instr.amount

# Part 2: by changing one jmp to nop or nop to jmp, the program will complete
# (attempt to execute at i = len(instructions)).

class LoopDetected(Exception): pass

def detect_finishes(instructions):
  i = 0
  acc = 0
  visited = set()
  while True:
    if i in visited:
      raise LoopDetected()
    if i == len(instructions):
      return acc
    instr = instructions[i]
    visited.add(i)
    if instr.name == 'nop':
      i += 1
    elif instr.name == 'acc':
      acc += instr.amount
      i += 1
    else: # jmp
      i += instr.amount

def detect_swap_and_finish(instructions):
  for i, instr in enumerate(instructions):
    if instr.name == 'jmp':
      new_instr = Instruction('nop', instr.amount)
    elif instr.name == 'nop':
      new_instr = Instruction('jmp', instr.amount)
    else:
      continue
    new_instructions = deepcopy(instructions)
    new_instructions[i] = new_instr
    try:
      acc = detect_finishes(new_instructions)
      return (acc, i)
    except LoopDetected:
      pass

if __name__ == '__main__':
  data = read_file(sys.argv[1])
  acc, i = detect_loop(data)
  print('Loop detected at position {}. Accumulator = {}'.format(i, acc))
  acc, i = detect_swap_and_finish(data)
  print('Loop broken by changing {} at position {}. Accumulator = {}'.format(data[i], i, acc))
