import sys
# Binary space partitioning

# Partition the range (a, b) into either its upper or lower half
def partition(a, b, letter):
  midpoint = a + int((b - a + 1) / 2)
  if letter in ('F', 'L'):
    return (a, midpoint - 1)
  else:
    return (midpoint, b)

def get_seat_id(s):
  # Take a boarding pass, e.g. BFFFBBFRRR, and use the first 7
  # letters to partition 128 (or 0-127) down to a single row.
  a, b = 0, 127
  for letter in s[:7]:
    a, b = partition(a, b, letter)
  assert(a == b)
  row = a

  a, b = 0, 7
  for letter in s[7:]:
    a, b = partition(a, b, letter)
  assert(a == b)
  column = a

  return (row * 8) + column

def get_missing_seat_id(seats):
  ids = sorted([get_seat_id(seat) for seat in seats])
  for i, seat in enumerate(ids):
    if ids[i + 1] != seat + 1:
      print('Missing seat ID is {}'.format(seat + 1))
      return

if __name__ == '__main__':
  filename = sys.argv[1]
  with open(filename) as f:
    seats = [x.strip() for x in f.readlines()]
  # Part 1: find the max seat ID
  # print(max(get_seat_id(seat) for seat in seats))
  # Part 2: find the missing seat ID
  get_missing_seat_id(seats)
