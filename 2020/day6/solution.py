import string
import sys

def read_file(filename='input.txt'):
  with open(filename) as f:
    contents = f.read().strip()
  raw_data = [
    [y.strip() for y in x.split('\n')] for x in contents.split('\n\n')
  ]
  return raw_data

# Part 1: how many unique questions were answered by each group, sum them together.
def count_unique_questions(group):
  unique = set()
  for letters in group:
    unique |= set(letters)
  return len(unique)

def count_union(groups):
  return sum(count_unique_questions(group) for group in groups)

# Part 2: how many questions were answered yes by ALL members of the group

def count_all_yes_answers(group):
  remaining_questions = set(string.ascii_lowercase)
  for letters in group:
    remaining_questions &= set(letters)
  return len(remaining_questions)

def count_intersection(groups):
  return sum(count_all_yes_answers(group) for group in groups)

if __name__ == '__main__':
  filename = sys.argv[1]
  groups = read_file(filename)
  print('Part 1: {}'.format(count_union(groups)))
  print('Part 2: {}'.format(count_intersection(groups)))
