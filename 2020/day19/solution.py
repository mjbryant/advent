import sys

# Part 1: find the number of messages that completely match rule 0.
# It's like a composable grammar

def parse_rules(s):
  rules_s = [x.strip().split(': ') for x in s.split('\n')]
  rules = [Rule(number, contents) for number, contents in rules_s]
  return {rule.number: rule for rule in rules}

def parse_messages(s):
  return [x.strip() for x in s.split('\n')]

def read_file(filename):
  with open(filename) as f:
    rules_block, messages_block = f.read().split('\n\n')
  return parse_rules(rules_block), parse_messages(messages_block)

# You have to check all branches of the rules tree to see if it matches.
# Maybe we can just construct all possible strings... is that feasible?
# It's only for rule 0 so maybe it's doable.

class Rule:
  def __init__(self, number, contents):
    self.number = int(number)
    self.parse_contents(contents)

  def parse_contents(self, contents):
    self.string = None
    self.rules = None
    if contents.startswith('"'):
      self.string = contents[1:-1]
      # They're all length 1 which makes this easier
      if len(self.string) != 1:
        raise ValueError('Unexpected!')
    else:
      rules_s = contents.split(' | ')
      self.rules = [[int(x) for x in y.split(' ')] for y in rules_s]

def make_strings(rule_number, rules):
  rule = rules[rule_number]
  if rule.string is not None:
    return [rule.string]
  else:
    assert(rule.rules is not None)
    # If there's a branch this'll split into two candidates
    return [''.join(make_strings(
