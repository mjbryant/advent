import sys
from copy import deepcopy

BOLD = '\033[1m'
RED = '\033[31m'
GREEN = '\033[92m'
END = '\033[0m'

def read_input(filename):
  with open(filename) as f:
    lines = [list(x.strip()) for x in f.readlines()]
  return lines

def print_map(m, highlight=None, color=RED):
  for i, row in enumerate(m):
    if highlight is not None and highlight[0] == i:
      col = highlight[1]
      r = deepcopy(row)
      r[col] = '{}{}{}{}'.format(color, BOLD, row[col], END)
      print(''.join(r))
    else:
      print(''.join(row))
  print()

# Part 1: given a map of seats, each round apply the following rules
# in parallel:
# - each L with no adjacent # becomes #
# - each # with four or more adjacent # becomes L

# Apply changes from above rules and return whether there was any change.
# The tricky part here is keeping the copy. Maybe it's not that tricky.
# I'm sure there are some nice optimizations but I don't think we'll need them.

def get_neighbors(row, column, m):
  max_row = len(m) - 1
  max_column = len(m[0]) - 1
  neighbors = []
  # Yikes
  for a in [row - 1, row, row + 1]:
    for b in [column - 1, column, column + 1]:
      if (
        (a == row and b == column)
        or a < 0
        or b < 0
        or a > max_row
        or b > max_column
      ):
        continue
      neighbors.append((a, b))
  return neighbors

def num_adjacent_occupied_seats(row, column, m, debug):
  occupied = 0
  for a, b in get_neighbors(row, column, m):
    if m[a][b] == '#':
      occupied += 1
  return occupied

def num_visible_occupied_seats(row, column, m, debug):
  # For each seat go out in the direct until you find a seat;
  # that's the one you consider.
  occupied = 0
  max_row = len(m) - 1
  max_column = len(m[0]) - 1
  i, j = row, column
  if debug:
    print_map(m, (i, j), GREEN)
  for row_incr in [-1, 0, 1]:
    for column_incr in [-1, 0, 1]:
      if row_incr == 0 and column_incr == 0:
        continue
      i, j = row + row_incr, column + column_incr
      while i >= 0 and i <= max_row and j >= 0 and j <= max_column:
        if debug:
          print_map(m, (i, j))
        seat = m[i][j]
        if seat == '#':
          occupied += 1
          break
        elif seat == 'L':
          break
        i, j = i + row_incr, j + column_incr
  return occupied

def step(m, fn=num_adjacent_occupied_seats, threshold=4, debug=False):
  new = deepcopy(m)
  changed = 0
  num_rows = len(m)
  num_columns = len(m[0])
  if debug:
    import ipdb; ipdb.set_trace()
  for row in range(num_rows):
    for column in range(num_columns):
      seat = m[row][column]
      if seat == '.':
        continue
      adjacent_occupied = fn(row, column, m, debug)
      if seat == 'L' and adjacent_occupied == 0:
        changed += 1
        new[row][column] = '#'
      elif seat == '#' and adjacent_occupied >= threshold:
        changed += 1
        new[row][column] = 'L'
      else:
        new[row][column] = seat
  return new, changed

def iterate(m, fn=num_adjacent_occupied_seats, threshold=4):
  changed = 1
  steps = 0
  while changed > 0:
    m, changed = step(m, fn, threshold)
    steps += 1
  s = 0
  for row in m:
    for cell in row:
      if cell == '#':
        s += 1
  return s

# Part 2: instead of just adjacent seats, consider the first seat they can see
# in every direction.

if __name__ == '__main__':
  filename = sys.argv[1]
  m = read_input(filename)
  part1 = iterate(m)
  print('Part 1 total is {}'.format(part1))
  part2 = iterate(m, num_visible_occupied_seats, 5)
  print('Part 2 total is {}'.format(part2))
