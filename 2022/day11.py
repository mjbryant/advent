import math
import re
from functools import reduce

test_data = """
Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1
"""

# Starting items: <worry levels>
# Operation: how worry levels change after monkey inspects item
# Test: applied to each item and true/false steps taken

# On each turn, monkeys go in order. They:
# for each item in the order listed, monkey:
# - inspects (apply Operation)
# - gets bored (divide by 3 and rounded down)
# - applies test
# - maybe throws based on test

# Throw items go to the end of the list

# Run this for 20 rounds, and count the total # of times each monkey inspected
# an item. Multiply the inspection levels from the two most active monkeys

with open('data/input11.txt') as f:
    data = f.read()

class Monkey:
    def __init__(self, _id, items, operation, test, depreciate=True):
        self._id = _id
        self.items = items
        self.operation = operation
        self.test = test
        self.number_inspections = 0
        self.depreciate = depreciate

    def do_one(self):
        self.number_inspections += 1
        item = self.items.pop(0)
        # Inspect item: apply operation
        item = self.operation(item)
        # Get bored: depreciate item
        if self.depreciate:
            item = math.floor(item / 3)
        # Need to find a new way to keep values small. I think it involves
        # something to do with the modulo values from all the monkeys.
        item = item % self.divisor
        target = self.test(item)
        return (item, target)

    def set_divisor(self, divisor):
        self.divisor = divisor

def chunk_monkey(input):
    lines = input.strip().split('\n')
    monkey_chunks = []
    while ('' in lines):
        divider = lines.index('')
        monkey_chunk = lines[:divider]
        lines = lines[divider+1:]
        monkey_chunks.append(monkey_chunk)
    monkey_chunks.append(lines)
    return monkey_chunks

def perform(old, first, operand, second):
    if first == 'old':
        first_value = old
    else:
        first_value = int(first)
    if second == 'old':
        second_value = old
    else:
        second_value = int(second)
    if operand == '*':
        return first_value * second_value
    elif operand == '+':
        return first_value + second_value
    else:
        raise RuntimeError(f'Invalid operand during perform: {operand}')

def parse_operation(o):
    match = re.match(r'Operation: new = (\w+) ([\*\+]) (\w+)$', o)
    if match is None or len(match.groups()) != 3:
        raise RuntimeError(f'Invalid operation {o}')
    first, operand, second = match.groups()
    return lambda x: perform(x, first, operand, second)

def parse_test(lines):
    if len(lines) != 3:
        raise RuntimeError(f'Invalid test lines {lines}')
    test, true, false = [line.strip() for line in lines]
    divisible = int(re.match(r'^Test: divisible by (\w+)$', test).group(1))
    true_target = int(re.match(r'^If true: throw to monkey (\w+)$', true).group(1))
    false_target = int(re.match(r'^If false: throw to monkey (\w+)$', false).group(1))
    def throw(value):
        if value % divisible == 0:
            return true_target
        else:
            return false_target
    return throw, divisible

def parse_input(input, depreciate=True):
    chunks = chunk_monkey(input)
    monkeys = []
    divisors = []
    for chunk in chunks:
        if len(chunk) != 6:
            raise RuntimeError(f'Unexpected monkey chunk {chunk}')
        _id = int(chunk[0][-2])
        items = [int(x) for x in chunk[1][chunk[1].index(':') + 1:].strip().split(', ')]
        operation = parse_operation(chunk[2].strip())
        test, divisible = parse_test(chunk[3:])
        divisors.append(divisible)
        monkeys.append(Monkey(_id, items, operation, test, depreciate=depreciate))
    overall_divisor = reduce(lambda a, b: a * b, divisors)
    for monkey in monkeys:
        monkey.set_divisor(overall_divisor)
    return monkeys

def calculate_score_1(input):
    monkeys = parse_input(input)
    for _ in range(20): # 20 rounds
        for monkey in monkeys:
            for _ in range(len(monkey.items)): # items
                item, target = monkey.do_one()
                monkeys[target].items.append(item)
    monkeys.sort(key=lambda m: -m.number_inspections)
    return monkeys[0].number_inspections * monkeys[1].number_inspections

def calculate_score_2(input):
    monkeys = parse_input(input, depreciate=False)
    for i in range(10000): # 10000 rounds
        # if i % 100 == 0:
        #     print(f'At iteration {i}')
        #     for monkey in monkeys:
        #         print(f'Monkey {monkey._id}: item: {monkey.items[0]}')
        for monkey in monkeys:
            for _ in range(len(monkey.items)): # items
                item, target = monkey.do_one()
                monkeys[target].items.append(item)
    monkeys.sort(key=lambda m: -m.number_inspections)
    return monkeys[0].number_inspections * monkeys[1].number_inspections

print(f'Test score is {calculate_score_1(test_data)}')
print(f'Part 1: {calculate_score_1(data)}')
print(f'Test part 2 score is {calculate_score_2(test_data)}')
print(f'Part 2: {calculate_score_2(data)}')