import sys
from copy import deepcopy

# Part 1: Read all the numbers in the list. After the list is done,
# consider the last number spoken. If it was the first time it was
# spoken then 0. If the number has been spoken before, then speak
# the difference between the last time it was spoken and the previous
# turn.

def read_file(filename):
  with open(filename) as f:
    numbers = [int(x) for x in f.read().strip().split(',')]
  return numbers

def find_number(initial_numbers, n=2020):
  i = 0
  cache = {}
  last_spoken = None
  assert(len(initial_numbers) == len(set(initial_numbers)))

  for i, a in enumerate(initial_numbers):
    cache[a] = [i + 1]
    last_spoken = a
    i += 1

  while i < n:
    c = cache[last_spoken]
    if len(c) == 1:
      new_number = 0
    else:
      new_number = c[1] - c[0]
    old_cache_value = cache.get(new_number)
    if old_cache_value is None:
      new_cache_value = [i + 1]
    else:
      new_cache_value = [old_cache_value[-1], i + 1]
    cache[new_number] = new_cache_value
    last_spoken = new_number
    i += 1

  return last_spoken

if __name__ == '__main__':
  numbers = read_file(sys.argv[1])
  if len(sys.argv) > 2:
    m = int(sys.argv[2])
  else:
    m = 2020
  n = find_number(numbers, m)
  print('The {}th number spoken is {}'.format(m, n))
  n = find_number(numbers, 30000000)
  print('The 30000000th number spoken is {}'.format(n))
