import sys
from functools import reduce

def read_map(filename):
  with open(filename) as f:
    lines = [x.strip() for x in f.readlines()]
  return lines

# Starting at the top left of m and going down three, right one, how many trees
# (places with a # in them) would you encounter before you got off the bottom
# of the map. Everytime you hit the right edge you start over at the left side,
# as if the map repeats to the right over and over.

# So the x coordinate just wraps around
def incr(x, y, m, x_slope, y_slope):
  return (
    (x + x_slope) % len(m[0]),
    y + y_slope
  )

def count_trees(m, x_slope, y_slope):
  trees = 0
  x, y = 0, 0
  x, y = incr(x, y, m, x_slope, y_slope)
  while y <= len(m) - 1:
    if m[y][x] == '#':
      trees += 1
    x, y = incr(x, y, m, x_slope, y_slope)
  print('There are {} trees using a slope of ({}, {})'.format(trees, x_slope, y_slope))
  return trees


def multiply_slopes(m):
  slopes = [(1, 1), (3, 1), (5, 1), (7, 1), (1, 2)]
  all_trees = []
  for x_slope, y_slope in slopes:
    all_trees.append(count_trees(m, x_slope, y_slope))
  print('Final answer is {}'.format(reduce(lambda x, y: x * y, all_trees)))


if __name__ == '__main__':
  filename = sys.argv[1]
  multiply_slopes(read_map(filename))
