import sys

with open('input.txt') as f:
  numbers = [int(x) for x in f.readlines()]


for i, a in enumerate(numbers):
  for j, b in enumerate(numbers[i:]):
    if a + b == 2020:
      print("The numbers are {} and {}. They multiply to {}".format(a, b, a * b))


for i, a in enumerate(numbers):
  for j, b in enumerate(numbers[i:]):
    for k, c in enumerate(numbers[j:]):
      if a + b + c == 2020:
        print("The numbers are {}, {}, and {}. They multiply to {}".format(a, b, c, a * b * c))
        sys.exit(0)
