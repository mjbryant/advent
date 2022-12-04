with open('input1.txt') as f:
  chunks = [x.split('\n') for x in f.read().split('\n\n')]

empty = chunks[-1].pop()
if empty != '':
  raise RuntimeError('Whoops')

elves = [[int(y) for y in x] for x in chunks]

top = [0, 0, 0]
for elf in elves:
  this_elf = sum(elf)
  if this_elf > top[-1]:
    top = sorted([top[0], top[1], this_elf], key=lambda x: -x)

print(f'Part 1: {top[0]}')
print(f'Part 2: {sum(top)}')
