import sys
from copy import deepcopy

def read_file(filename):
  with open(filename) as f:
    rows = [list(x.strip()) for x in f.readlines()]
  return [[rows]]

# Part 1: simulate six cycles of the following rules:
# - if 2 or 3 of an active cube's neighbors are active, stay active.
#   otherwise, become inactive
# - if 3 of an inactive cube's neighbors are active, become active.
#   otherwise, stay active.
# Start with a 3D space but with only one z-index. All cubes outside
# of the specified space are considered inactive. Each step I'll have
# to x, y, and z dimensions by 1 in each direction. So 3x3x1 becomes
# 5x5x3, becomes 7x7x5, etc.

def get_dims(m):
  return (len(m[0][0][0]), len(m[0][0]), len(m[0]), len(m))

def neighbors(x, y, z, w):
  # Given an (x, y, z) coordinate, find all neighbors
  for nx in (x - 1, x, x + 1):
    for ny in (y - 1, y, y + 1):
      for nz in (z - 1, z, z + 1):
        for nw in (w - 1, w, w + 1):
          if not (nx == x and ny == y and nz == z and nw == w):
            yield (nx, ny, nz, nw)

def count_active_neighbors(m, x, y, z, w):
  # Don't try to access cells out of bounds of the finite representation
  # of the graph. These are inactive by default.
  return sum([
    m[nw][nz][ny][nx] == '#' for nx, ny, nz, nw in neighbors(x, y, z, w)
    if (
      nx >= 0 and ny >= 0 and nz >= 0 and nw >= 0
      and nw < len(m) and nz < len(m[0]) and ny < len(m[0][0]) and nx < len(m[0][0][0])
    )
  ])

def add_w_layer(m):
  upper_w_layer = [
    [
      ['.' for _ in range(len(m[0][0][0]))]
      for _ in range(len(m[0][0]))
    ]
    for _ in range(len(m[0]))
  ]
  lower_w_layer = deepcopy(upper_w_layer)
  m.insert(0, upper_w_layer)
  m.append(lower_w_layer)

def add_xyz_layers(m):
  for w_layer in m:
    for z_layer in w_layer:
      for y_layer in z_layer:
        y_layer.insert(0, '.')
        y_layer.append('.')
      z_layer.insert(0, ['.' for _ in range(len(z_layer[0]))])
      z_layer.append(['.' for _ in range(len(z_layer[0]))])
    w_layer.insert(0, [
      ['.' for _ in range(len(w_layer[0][0]))]
      for _ in range(len(w_layer[0]))
    ])
    w_layer.append([
      ['.' for _ in range(len(w_layer[0][0]))]
      for _ in range(len(w_layer[0]))
    ])

def step(old_m):
  # Preemptively expand the space with all inactive cubes. I could def do this
  # in one call, but shrug.
  add_w_layer(old_m)
  add_xyz_layers(old_m)
  m = deepcopy(old_m)
  for w in range(len(m)):
    for z in range(len(m[0])):
      for y in range(len(m[0][0])):
        for x in range(len(m[0][0][0])):
          active_neighbors = count_active_neighbors(old_m, x, y, z, w)
          current = old_m[w][z][y][x]
          if (
            current == '#' and active_neighbors in (2, 3)
            or current == '.' and active_neighbors == 3
          ):
            m[w][z][y][x] = '#'
          else:
            m[w][z][y][x] = '.'
  return m

def print_space(m):
  for z_index, z in enumerate(m):
    print('z={}'.format(z_index))
    for y in z:
      print(''.join(y))
    print()

def iterate(m, n=6):
  for _ in range(n):
    m = step(m)
  return m

def count_active(m):
  total = 0
  for w in m:
    for z in w:
      for y in z:
        for x in y:
          if x == '#':
            total += 1
  return total

if __name__ == '__main__':
  m = read_file(sys.argv[1])
  m = iterate(m)
  print('Total of {} active cubes'.format(count_active(m)))
