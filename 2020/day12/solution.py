import sys
from collections import namedtuple

Command = namedtuple('Command', ['action', 'value'])

VALID_COMMANDS = ('N', 'S', 'E', 'W', 'L', 'R', 'F')
DIRECTIONS = ('N', 'E', 'S', 'W')

def parse(x):
  action = x[0]
  if action not in VALID_COMMANDS:
    raise ValueError('Cannot parse {}'.format(x))
  value = int(x[1:])
  if action in ('L', 'R') and value % 90 != 0:
    raise ValueError('Cannot rotate by anything other than 90° increments: {}'.format(x))
  return Command(action, value)

def read_file(filename):
  with open(filename) as f:
    return [parse(x.strip()) for x in f.readlines()]

# Part 1: move the ship according to the instructions then calculate
# manhattan distance from (0, 0)

def incr(action, x, y, value):
  if action == 'N':
    y += value
  elif action == 'E':
    x += value
  elif action == 'S':
    y -= value
  elif action == 'W':
    x -= value
  return (x, y)

def rotate(direction, value, clockwise):
  shift = int((value % 360) / 90)
  if not clockwise:
    shift = -shift
  current_index = DIRECTIONS.index(direction)
  new_index = (current_index + shift) % len(DIRECTIONS)
  return DIRECTIONS[new_index]

def move(commands):
  x, y = 0, 0
  direction = 'E'
  for command in commands:
    if command.action in ('N', 'E', 'S', 'W'):
      x, y = incr(command.action, x, y, command.value)
    elif command.action == 'L':
      direction = rotate(direction, command.value, clockwise=False)
    elif command.action == 'R':
      direction = rotate(direction, command.value, clockwise=True)
    else:
      x, y = incr(direction, x, y, command.value)
  return x, y

# Part 2: the instructions move a waypoint instead of the ship. Only F
# instructions move the ship; the others move the waypoint.

def rotate_waypoint(x, y, value, clockwise):
  # Counterclockwise rotations:
  # 90 = (x, y) -> (-y, x)
  # 270 = (x, y) -> (y, -x)
  if (value % 360) == 0:
    return x, y
  elif (value % 180) == 0:
    return -x, -y
  v = value
  if clockwise:
    v = value + 180
  v %= 360
  if v == 90:
    return -y, x
  elif v == 270:
    return y, -x
  else:
    raise ValueError('Somehow')

def move_waypoint(commands):
  x, y = 0, 0
  wx, wy = 10, 1
  for command in commands:
    if command.action in ('N', 'E', 'S', 'W'):
      wx, wy = incr(command.action, wx, wy, command.value)
    elif command.action == 'L':
      wx, wy = rotate_waypoint(wx, wy, command.value, clockwise=False)
    elif command.action == 'R':
      wx, wy = rotate_waypoint(wx, wy, command.value, clockwise=True)
    elif command.action == 'F':
      x += (command.value * wx)
      y += (command.value * wy)
    print('Ship is at {}, {} (after {}; waypoint {}, {})'.format(
      x, y, command, wx, wy
    ))
  return x, y

if __name__ == '__main__':
  commands = read_file(sys.argv[1])
  x, y = move(commands)
  print('Part 1: Final location is ({}, {}). Manhattan distance from origin is {}'.format(
    x, y, abs(x) + abs(y)
  ))
  x, y = move_waypoint(commands)
  print('Part 2: Final location is ({}, {}). Manhattan distance from origin is {}'.format(
    x, y, abs(x) + abs(y)
  ))
