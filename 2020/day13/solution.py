import math
import sys

def read_file(filename):
  with open(filename) as f:
    earliest_departure_s, schedule_s = [x.strip() for x in f.readlines()]
  earliest_departure = int(earliest_departure_s)
  schedule = [
    int(x) for x in schedule_s.split(',')
    if x != 'x'
  ]
  return earliest_departure, schedule

# Part 1: buses all depart at time 0, then depart at multiples of their
# ID number after that. So bus ID 5 departs at 0, 5, 10, 15, etc. The
# earliest_departure is the earliest you could possibly depart, so you
# must find the bus that departs as soon after earliest_departure as
# possible. There are probably much better ways to do this, but the simplest
# might be to do integer division, then add the ID, then subtract.

def find_earliest_bus(earliest_departure, schedule):
  m = float('inf')
  best_id = None
  for i in schedule:
    next_departure = ((earliest_departure // i) * i) + i
    diff = next_departure - earliest_departure
    if diff < m:
      m = diff
      best_id = i
  return m, best_id

# Part 2:
'''
Given two buses a and b, first need to find a number m (and probably more of these)
such that ((a * m) + 1) % b == 0. So a number m that one more than a * m is a multiple
of b. Solve for m?

Since I can now get the first valid start time for bus B departing N minutes after
bus A, I can maybe use this with a bit of brute force? Probably not. I can find the
first one and the second one. You know that the start time that satisfies both of
these will be a multiple of both of them? Doesn't look like it.

This is because M is the first valid start time, but 2M is not necessarily the second
valid start time. What is the second valid start time? The second valid start time is
clearly a multiple of M. Wait. Is it? It's clearly a multiple of A and N more than it
is a multiple of B.
'''

# This extended Euclid's algorithm solves for the number that'll help solve
# am congruent to y (mod z)
def egcd(a, b):
	if a == 0:
		return (b, 0, 1)
	else:
		g, x, y = egcd(b % a, a)
		return (g, y - (b // a) * x, x)

def get_valid_start_time(a, b, n):
	# Get the first valid start time (all multiples of this start time are also valid)
	# such that bus b leaves n minutes after bus a
	_, a_inverse, _ = egcd(a, b)
	return a * (((-n % b) * a_inverse) % b)

def lcm(a, b):
  return abs(a*b) // math.gcd(a, b)

if __name__ == '__main__':
  earliest_departure, schedule = read_file(sys.argv[1])
  diff, best_id = find_earliest_bus(earliest_departure, schedule)
  print('Part 1: Best bus is {}; Diff is {}; Product is {}'.format(diff, best_id, diff * best_id))
