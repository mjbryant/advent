import re
import sys

DIGIT = re.compile(r'\d')

TESTS = [
  ('1 + 2 * 3 + 4 * 5 + 6', 71),
  ('1 + (2 * 3) + (4 * (5 + 6))', 51),
  ('2 * 3 + (4 * 5)', 26),
  ('5 + (8 * 3 + 9 + 3 * 4 * 3)', 437),
  ('5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))', 12240),
  ('((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2', 13632),
]

TESTS_2 = [
  ('1 + (2 * 3) + (4 * (5 + 6))', 51),
  ('2 * 3 + (4 * 5)', 46),
  ('5 + (8 * 3 + 9 + 3 * 4 * 3)', 1445),
  ('5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))', 669060),
  ('((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2', 23340),
]

# Part 1: evaluate the expressions using new rules:
# + and * are equivalently ordered; evaluate from left to right,
# still giving precedence to parentheses. I think we can do this
# by using a stack for parsing and keeping a bit of additional state.

def op(left, right, operator):
  if operator == '+':
    return left + right
  elif operator == '*':
    return left * right
  else:
    raise ValueError('Parsing error')

def process(stack):
  right = stack.pop()
  operator = stack.pop()
  left = stack.pop()
  stack.append(op(left, right, operator))

def append_value(stack, value):
  if len(stack) > 0 and stack[-1] in ('+', '*'):
    stack.append(value)
    process(stack)
  else:
    stack.append(value)

def process_parentheses(i, s):
  # Find the matching parentheses to the one at i and evaluate the contents.
  # Return the processed value and the index of the right matching parens.
  j = i + 1
  depth = 0
  while j < len(s):
    if s[j] == ')':
      if depth == 0:
        return (j, evaluate(s[i+1:j]))
      else:
        depth -= 1
    elif s[j] == '(':
      depth += 1
    j += 1

def process_parentheses_2(i, s):
  # Find the matching parentheses to the one at i and evaluate the contents.
  # Return the processed value and the index of the right matching parens.
  j = i + 1
  depth = 0
  while j < len(s):
    if s[j] == ')':
      if depth == 0:
        return (j, evaluate_part_2(s[i+1:j]))
      else:
        depth -= 1
    elif s[j] == '(':
      depth += 1
    j += 1

def evaluate(s):
  stack = []
  i = 0
  # There are no two-digit integers!
  while i < len(s):
    c = s[i]
    # Either a digit or an open parens are values. Add a value to the stack,
    # then if it's the second value pop the first one off.
    if DIGIT.match(c):
      append_value(stack, int(c))
    elif c == '(':
      i, value = process_parentheses(i, s)
      append_value(stack, value)
    elif c in ('+', '*'):
      stack.append(c)
    i += 1
  assert(len(stack) == 1)
  return stack.pop()

def append_value_2(stack, value):
  if len(stack) > 0 and stack[-1] == '+':
    stack.append(value)
    process(stack)
  else:
    # This puts '*' on the stack as well
    stack.append(value)

def evaluate_part_2(s):
  stack = []
  i = 0
  # There are no two-digit integers!
  while i < len(s):
    c = s[i]
    # Either a digit or an open parens are values. Add a value to the stack,
    # then if it's the second value pop the first one off if * but if + then
    # keep it on the stack
    if DIGIT.match(c):
      append_value_2(stack, int(c))
    elif c == '(':
      i, value = process_parentheses_2(i, s)
      append_value_2(stack, value)
    elif c in ('+', '*'):
      stack.append(c)
    i += 1
  # At this point we have multiplication operations left on the stack. Pop
  # them off and do them until finished.
  while len(stack) > 1:
    process(stack)
  assert(len(stack) == 1)
  return stack.pop()

# Part 2: addition evaluated before multiplication

if __name__ == '__main__':
  with open(sys.argv[1]) as f:
    lines = [x.strip() for x in f.readlines()]
  sums = [evaluate(x) for x in lines]
  print('Part 1: total sum is {}'.format(sum(sums)))
  sums = [evaluate_part_2(x) for x in lines]
  print('Part 2: total sum is {}'.format(sum(sums)))
