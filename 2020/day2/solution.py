with open('input.txt') as f:
  lines = [x.strip() for x in f.readlines()]

def parse_range(s):
  first, last = s.split('-')
  return [int(first), int(last)]

def parse(line):
  parts = line.split(' ')
  allowable_range_str, letter_with_colon, password = parts
  letter = letter_with_colon.strip(':')
  allowable_range = parse_range(allowable_range_str)
  return {
    'allowable_range': allowable_range,
    'letter': letter,
    'password': password,
  }

def is_valid(p):
  letter_count = p['password'].count(p['letter'])
  if letter_count >= p['allowable_range'][0] and letter_count <= p['allowable_range'][1]:
    return 1
  return 0

valid_passwords = [is_valid(parse(line)) for line in lines]
print("There are {}/{} valid passwords".format(sum(valid_passwords), len(valid_passwords)))

def is_valid_new(p):
  # New policy is that a password is valid if exactly one of the positions in
  # allowable_range have the letter
  if (p['password'][p['allowable_range'][0] - 1] == p['letter']) ^ (p['password'][p['allowable_range'][1] - 1] == p['letter']):
    return 1
  return 0

new_valid_passwords = [is_valid_new(parse(line)) for line in lines]
print("According to the new policy, there are {}/{} valid passwords".format(sum(new_valid_passwords), len(new_valid_passwords)))
