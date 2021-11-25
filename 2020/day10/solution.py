import sys
from collections import defaultdict
from copy import deepcopy

def setup(d):
  d.sort()
  d.insert(0, 0)
  d.append(d[-1] + 3)

# Part 1: find a chain of adapters that go from 0 to the highest
# one, then multiple the # of 1 jolt differences by the # of 3
# jolt differences to get the answer.
def count_differences(d):
  i = 1
  diffs = defaultdict(int)
  while i < len(d):
    diffs[d[i] - d[i-1]] += 1
    i += 1
  return diffs

# Part 2: find the number of valid arrangements of the adapters that
# connect the source (0) to the device (max(d) + 3). I think the way to
# do this is to find the maximal arrangement, try to delete each adapter
# and see if it's still valid. If it is, then recursively apply. Since
# they're always in ascending order and there are no duplicates this
# should work.

# This is too slow (or takes too much memory) for the large array. I think
# it's a divide-and-conquer thing where you can split the list in two,
# then the total # of arrangements is first_half * second_half.

def is_valid_arrangement(d):
  i = 1
  while i < len(d):
    if d[i] - d[i-1] > 3:
      return False
    i += 1
  return True

def find_valid_arrangements(d):
  full = deepcopy(tuple(d))
  to_check = set()
  to_check.add(full)
  valid_arrangements = set()
  valid_arrangements.add(full)

  while len(to_check) > 0:
    parent = to_check.pop()
    if len(parent) < 3:
      continue
    for i in range(1, len(parent) - 2):
      # If the ancestor of the candidate is valid, then the only way the candidate
      # could be _invalid_ is if the boundary around the removed entry is invalid,
      # so we only have to check this.
      if (parent[i+1] - parent[i-1]) <= 3:
        candidate = parent[:i] + parent[i+1:]
        valid_arrangements.add(candidate)
        to_check.add(candidate)
  return valid_arrangements

def part2(d):
  options = defaultdict(int)
  options[0] = 1
  for x in d:
    total = options[x - 1] + options[x - 2] + options[x - 3]
    options[x] = total
  return options[d[-1]]

if __name__ == '__main__':
  with open(sys.argv[1]) as f:
    joltages = [int(x.strip()) for x in f.readlines()]
  setup(joltages)
  diffs = count_differences(joltages)
  print('There are {} 1-diffs and {} 3-diffs. Product = {}'.format(
    diffs[1],
    diffs[3],
    diffs[1] * diffs[3],
  ))
  valid_arrangements = find_valid_arrangements(joltages)
  print('There are {} possible valid arrangements'.format(len(valid_arrangements)))
