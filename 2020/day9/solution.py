import sys

def read_file(filename):
  with open(filename) as f:
    numbers = [int(x.strip()) for x in f.readlines()]
  return numbers

# Part 1: find the first number in the list of numbers that's not the
# sum of any two of the previous <preamble> numbers.

# Check if ∃ two numbers in numbers that sum to x.
def find_valid_summation(numbers, x):
  for i, a in enumerate(numbers):
    for j, b in enumerate(numbers[i:]):
      if a + b == x:
        return True
  return False

def find_first_invalid_number(numbers, preamble):
  i = preamble
  while i < len(numbers) - 1:
    if not find_valid_summation(numbers[i - preamble:i], numbers[i]):
      return numbers[i]
    i += 1

# Part 2: find the first contiguous set of at least two numbers that sum
# to the invalid number.

# If sum([i, j]) > x then incr i, else incr j
def find_contiguous_set(numbers, x):
  i = 0
  j = 1
  while i < len(numbers) and j < len(numbers) - 1:
    if i == j:
      j += 1
      continue
    total = sum(numbers[i:j + 1])
    if total == x:
      contiguous_set = numbers[i:j + 1]
      return (min(contiguous_set), max(contiguous_set))
    elif total < x:
      j += 1
    else:
      i += 1
      j = i + 1

if __name__ == '__main__':
  numbers = read_file(sys.argv[1])
  preamble = int(sys.argv[2])
  first_invalid_number = find_first_invalid_number(numbers, preamble)
  print('First invalid number is {}'.format(first_invalid_number))
  a, b = find_contiguous_set(numbers, first_invalid_number)
  print('Sum of contiguous set is {}'.format(a + b))
