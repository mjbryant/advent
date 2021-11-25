import ipdb
import sys
from collections import namedtuple

Rule = namedtuple('Rule', ('container', 'contents'))

NO_OTHER_BAGS = object()

def parse(line):
  parts = line.split(' contain ')
  if len(parts) < 2:
    raise Exception('Cannot parse line {}'.format(line))
  container = parts[0].rsplit(' ', 1)[0]
  contents = [parse_part(part) for part in parts[1].split(', ')]
  return Rule(container, contents)

def parse_part(part):
  if part == 'no other bags.':
    return NO_OTHER_BAGS
  parts = part.split(' ')
  number = int(parts.pop(0))
  suffix = parts.pop()
  if suffix not in ('bag', 'bag.', 'bags', 'bags.'):
    raise Exception('Suffix {} not proper'.format(suffix))
  return (number, ' '.join(parts))

def read_file(filename):
  with open(filename) as f:
    lines = [x.strip() for x in f.readlines()]
  return [parse(line) for line in lines]

def get_rules_by_bag(rules):
  rules_by_bag = {}
  for rule in rules:
    if rule.container in rules_by_bag:
      raise ValueError('Duplicate bag! {}'.format(rule.container))
    rules_by_bag[rule.container] = rule.contents
  return rules_by_bag

def find_containing_bags(bag, rules):
  # Return all bags that can contain this bag directly
  containers = set()
  for rule in rules:
    if rule.contents == [NO_OTHER_BAGS]:
      continue
    for c in rule.contents:
      if c[1] == bag:
        containers.add(rule.container)
  return containers

# Part 1: If you wanted to carry a 'shiny gold' bag, how many different bag colors
# would be valid for the outermost bag? E.g. you could put it directly into a bright
# white bag or a muted yellow bag. Then find which bags can contain a bright white
# or a muted yellow, and recurse up.

def find_outermost_bags(bags, checked, rules):
  # Put the bag you want to check in a stack. While the stack isn't empty
  # pop an item off the stack and, if you haven't yet searched that bag, find
  # its possible containers and put them in the stack.
  while len(bags) > 0:
    bag = bags.pop()
    if bag in checked:
      continue
    containers = find_containing_bags(bag, rules)
    checked.add(bag)
    for container in containers:
      if container not in checked:
        bags.add(container)

# Part 2: According to the rules, how many total bags must the shiny gold bag contain?
# I think this is simpler, you just follow the tree down.

def count_total_bags(bag, rules_by_bag):
  total = 0
  rules = rules_by_bag[bag]
  if rules == [NO_OTHER_BAGS]:
    return total
  for rule in rules:
    number, enclosed_bag = rule
    total += number
    total += number * count_total_bags(enclosed_bag, rules_by_bag)
  return total

if __name__ == '__main__':
  rules = read_file(sys.argv[1])
  bag = 'shiny gold'
  outermost_bags = set()
  find_outermost_bags(set([bag]), outermost_bags, rules)
  outermost_bags.remove(bag)
  outermost_bags = sorted(list(outermost_bags))
  print('Part 1: there are {} outer-most bags for {}: {}'.format(len(outermost_bags), bag, outermost_bags))

  rules_by_bag = get_rules_by_bag(rules)
  total = count_total_bags(bag, rules_by_bag)
  print('Part 2: there are {} total bags that must be in a {} bag'.format(total, bag))

