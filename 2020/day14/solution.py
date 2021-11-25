import functools
import re
import sys
from collections import defaultdict

# Part 1: maintain a bitmask, set and updated by `mask`. Go through
# the mem sets and for mem[A] = B, try to set mem location A to
# mask(B), where `mask` is the application of the bitmask to the
# binary representation of value B. Memory values are overwritten
# as you go, and at the end the answer is the sum of all values in
# memory.

# To format a decimal integer as a binary number use format(i, '0Nb')
# where N is the final total length of the binary string you want.

# To apply the mask, do a bitwise-or with all the '1' values, then a
# bitwise-and with all the '0' values. For the first operation replace
# 'X' with '0' and for the second operation replace 'X' with '1'.

def read_file(filename):
  with open(filename) as f:
    return [parse(x.strip()) for x in f.readlines()]

def parse(x):
  if x.startswith('mask'):
    return ('mask', x.split(' = ')[1])
  elif x.startswith('mem'):
    f, value = x.split(' = ')
    location = int(re.match(r'mem\[(\d+)\]', f).groups()[0])
    return ('mem', location, int(value))
  else:
    raise ValueError('Parse error {}'.format(x))

def apply_mask(value, mask):
  or_mask = int(mask.replace('X', '0'), 2)
  and_mask = int(mask.replace('X', '1'), 2)
  return (value & and_mask) | or_mask

def get_memory_sum(commands):
  mask = commands[0][1]
  space = defaultdict(int)
  for command in commands:
    if command[0] == 'mask':
      mask = command[1]
    elif command[0] == 'mem':
      _, location, value = command
      space[location] = apply_mask(value, mask)
  return functools.reduce(lambda a, b: a + b, space.values())

# Part 2: Before writing, the bitmask modifies the memory address according to:
# - if 0, bit in mem address unchanged
# - if 1, bit → 1
# - if X, bit is "floating", which means it writes to both 0 and 1 versions of
#   the address

def get_floating_masks(mask):
  masks = []
  floating_masks = [mask]
  while len(floating_masks) > 0:
    m = floating_masks.pop()
    index = m.find('X')
    if index == -1:
      masks.append(m)
    else:
      floating_masks.extend([
        m.replace('X', '0', 1),
        m.replace('X', '1', 1),
      ])
  return masks

def get_masked_locations(value, mask):
  # Convert value to 36-length binary representation, then swap out the 1s and
  # X's from the mask, then pass the masked value through get_floating_masks to
  # get all possible combinations
  bin_value = format(value, '036b')
  masked_bin_value_list = []
  for i, x in enumerate(bin_value):
    if mask[i] == 'X':
      masked_bin_value_list.append('X')
    elif mask[i] == '0':
      masked_bin_value_list.append(x)
    elif mask[i] == '1':
      masked_bin_value_list.append('1')
    else:
      raise ValueError('what')
  masked_bin_value = ''.join(masked_bin_value_list)
  return [
    int(r, 2) for r in get_floating_masks(masked_bin_value)
  ]

def get_floating_memory_sum(commands):
  mask = commands[0][1]
  space = defaultdict(int)
  for command in commands:
    if command[0] == 'mask':
      mask = command[1]
    elif command[0] == 'mem':
      _, location, value = command
      for masked_location in get_masked_locations(location, mask):
        space[masked_location] = value
  return functools.reduce(lambda a, b: a + b, space.values())

if __name__ == '__main__':
  commands = read_file(sys.argv[1])
  s = get_memory_sum(commands)
  print('Sum of memory space is {}'.format(s))
  s = get_floating_memory_sum(commands)
  print('Sum of floating memory space is {}'.format(s))
