import functools
import sys
from collections import namedtuple
from copy import deepcopy

Rule = namedtuple('Rule', ('name', 'low', 'high'))

def read_file(filename):
  with open(filename) as f:
    rules, my_ticket, tickets = [
      x.strip() for x in f.read().strip().split('\n\n')
    ]
  t_values = tickets.split('\n')[1:]
  return (
    parse_rules(rules),
    parse_ticket(my_ticket.split('\n')[1].strip()),
    [parse_ticket(t) for t in t_values],
  )

def parse_rules(rules_s):
  rules = []
  for s in rules_s.split('\n'):
    name, rest = s.split(': ')
    low_s, high_s = rest.split(' or ')
    low = [int(x) for x in low_s.split('-')]
    high = [int(x) for x in high_s.split('-')]
    assert(len(low) == 2)
    assert(len(high) == 2)
    assert low[1] < high[0]
    assert(low[0] < low[1])
    assert(high[0] < high[1])
    rules.append(Rule(name, low, high))
  return rules

def parse_ticket(t):
  return [int(x) for x in t.split(',')]

# Part 1: sum all values from nearby tickets that don't match any rule.

def find_matching_rules(rules, v):
  return set([
    rule.name for rule in rules
    if rule.low[0] <= v <= rule.low[1] or rule.high[0] <= v <= rule.high[1]
  ])

def find_invalid_values(rules, tickets):
  invalid_values = []
  for t in tickets:
    for v in t:
      if len(find_matching_rules(rules, v)) == 0:
        invalid_values.append(v)
  return invalid_values

def discard_invalid_tickets(rules, tickets):
  return [
    t for t in tickets
    if all([
      len(find_matching_rules(rules, v)) > 0 for v in t
    ])
  ]

def find_field_order(rules, tickets):
  # A matrix where rows are tickets and each cell holds the rules that match
  # the field on that ticket.
  m = [
    [find_matching_rules(rules, v) for v in t]
    for t in tickets
  ]
  remaining_rules = set(rule.name for rule in rules)
  iteration = 0
  # Do we have to go through this multiple times? Yes.
  while len(remaining_rules) != 0:
    iteration += 1
    print('Iteration {}; Remaining {}'.format(iteration, len(remaining_rules)))
    for column in range(len(m[0])):
      if len(m[0][column]) == 1:
        continue
      matching_rules = deepcopy(remaining_rules)
      # Find all rules that satisfy all tickets
      for row in m:
        matching_rules &= row[column]
      # Then go back through and remove impossible rules
      for row in m:
        non_matching_rules = row[column] - matching_rules
        for r in non_matching_rules:
          row[column].remove(r)
      # If only one possible rule could match all the tickets for this column
      # then assign it and remove it from the pool. But this isn't enough to
      # break deadlocks; the other property that could cause us to know which
      # rule works here is that one of the matching rules isn't present in
      # any other column.
      if len(matching_rules) == 1:
        remaining_rules -= matching_rules
      else:
        for matching_rule in matching_rules:
          matches_any_other_column = False
          for other_column in range(len(m[0])):
            if other_column == column:
              continue
            for row in m:
              if matching_rule in row[other_column]:
                matches_any_other_column = True
                break
            if matches_any_other_column:
              break
          if not matches_any_other_column:
            # Make this the only rule for this column and remove it from the list
            for row in m:
              row[column] = {matching_rule}
            remaining_rules -= set([matching_rule])
            break
  return m

# Part 2: discard the invalid tickets and find the order of the fields
# that allows the valid tickets to satisfy the rules. I think I can do
# this by finding all matching rules for each field, then picking the
# rules that satisfy every ticket.

if __name__ == '__main__':
  rules, my_ticket, tickets = read_file(sys.argv[1])
  invalid_values = find_invalid_values(rules, tickets)
  s = functools.reduce(lambda a, b: a + b, invalid_values)
  print('Sum of invalid values is {}'.format(s))
  valid_tickets = discard_invalid_tickets(rules, tickets)
  all_field_order = find_field_order(rules, valid_tickets + [my_ticket])
  # Any row of this matrix should have the field order
  order = all_field_order[0]
  product = 1
  for i, field_set in enumerate(order):
    assert(len(field_set) == 1)
    field = field_set.pop()
    if field.startswith('departure'):
      product *= my_ticket[i]
  print('Final product is {}'.format(product))

