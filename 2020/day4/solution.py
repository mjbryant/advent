import re
import sys

def parse(r):
  fields = {}
  for s in r.split(' '):
    name, value = s.split(':')
    fields[name] = value
  return fields


def read_file(filename='input.txt'):
  with open(filename) as f:
    contents = f.read()
  raw_data = [
    x.replace('\n', ' ').strip() for x in contents.split('\n\n')
  ]
  return [parse(r) for r in raw_data]

REQUIRED_FIELDS = set([
  'byr',
  'iyr',
  'eyr',
  'hgt',
  'hcl',
  'ecl',
  'pid',
])

def all_fields_present(p, required_fields=REQUIRED_FIELDS):
  key_intersection = set(p.keys()) & REQUIRED_FIELDS
  return len(key_intersection) == len(REQUIRED_FIELDS)

def birth_year_valid(v):
  b = int(v)
  if 1920 <= b <= 2002:
    return True
  return False

def issue_year_valid(v):
  b = int(v)
  if 2010 <= b <= 2020:
    return True
  return False

def expiration_year_valid(v):
  b = int(v)
  if 2020 <= b <= 2030:
    return True
  return False

def height_valid(v):
  if v.endswith('cm'):
    i = int(v.strip('cm'))
    if 150 <= i <= 193:
      return True
    return False
  elif v.endswith('in'):
    i = int(v.strip('in'))
    if 59 <= i <= 76:
      return True
    return False
  else:
    return False

def hair_color_valid(v):
  return re.match('^#[0-9a-f]{6}$', v) is not None

def eye_color_valid(v):
  return v in (
    'amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth',
  )

def passport_id_valid(v):
  return re.match('^[0-9]{9}$', v) is not None

FIELD_TO_VALIDATOR = {
  'byr': birth_year_valid,
  'iyr': issue_year_valid,
  'eyr': expiration_year_valid,
  'hgt': height_valid,
  'hcl': hair_color_valid,
  'ecl': eye_color_valid,
  'pid': passport_id_valid,
}

# Problem: some passports that should be marked as invalid my algorithm
# is marking as valid

def is_valid(p):
  if not all_fields_present(p):
    return False
  for field, value in p.items():
    validator = FIELD_TO_VALIDATOR.get(field)
    if validator is None:
      continue
    field_valid = validator(value)
    if not field_valid:
      return False
  return True

def count_valid_passports(data):
  valid = 0
  for p in data:
    v = is_valid(p)
    if v:
      valid += 1
  return valid

if __name__ == '__main__':
  data = read_file(sys.argv[1])
  valid = count_valid_passports(data)
  print('There are {}/{} valid passports'.format(valid, len(data)))
