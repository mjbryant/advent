test_data = """
addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop
"""

with open('data/input10.txt') as f:
    data = f.read()

# Consider (cycle_number * value of X register) at 20, 60, 100, ..., 220
def calculate_score_1(input):
    lines = input.strip().split("\n")
    X = 1
    cycle = 1

    key_cycles = [20, 60, 100, 140, 180, 220]
    key_cycle_values = []

    def check_cycle():
        if cycle in key_cycles:
            key_cycle_values.append(X * cycle)

    for line in lines:
        if line == "noop":
            check_cycle()
            cycle += 1
        else:
            parts = line.split(" ")
            if len(parts) != 2:
                raise RuntimeError(f"Invalid line {line}")
            number = int(parts[1])
            check_cycle()
            cycle += 1
            check_cycle()
            cycle += 1
            X += number

    return sum(key_cycle_values)


def calculate_score_2(input):
    lines = input.strip().split("\n")
    X = 1
    cycle = 0
    pixel_values = []

    # the register value X is the middle of a sprite. If X or its neighbors is the same
    # as the cycle being drawn, the sprite is visible and we append "#"". Otherwise it's
    # not and we append ".".
    def check_cycle():
        if X == (cycle % 40) or (X - 1) == (cycle % 40) or (X + 1) == (cycle % 40):
            pixel_values.append("#")
        else:
            pixel_values.append(".")

    # import ipdb; ipdb.set_trace()
    for line in lines:
        if line == "noop":
            check_cycle()
            cycle += 1
        else:
            parts = line.split(" ")
            if len(parts) != 2:
                raise RuntimeError(f"Invalid line {line}")
            number = int(parts[1])
            check_cycle()
            cycle += 1
            check_cycle()
            cycle += 1
            X += number

    slices = [[0, 40], [40, 80], [80, 120], [120, 160], [160, 200], [200, 240]]
    for slice in slices:
        print("".join(pixel_values[slice[0]:slice[1]]))

    return None

print(f'Test score is {calculate_score_1(test_data)}')
print(f'Part 1: {calculate_score_1(data)}')
print(f'Test part 2 score is {calculate_score_2(test_data)}')
print(f'Part 2: {calculate_score_2(data)}')