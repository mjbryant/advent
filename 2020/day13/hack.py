data = open('input.txt', 'r').read().split('\n')
data = data[1].split(',')
B = [(int(data[k]), k) for k in range(len(data)) if data[k] != 'x']

lcm = 1
time = 0    
for i in range(len(B)-1):
	bus_id = B[i+1][0]
	idx = B[i+1][1]
	lcm *= B[i][0]
	while (time + idx) % bus_id != 0:
		time += lcm
print(time)
