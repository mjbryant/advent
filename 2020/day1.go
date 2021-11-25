package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

func check(e error) {
	if e != nil {
		panic(e)
	}
}

func read_input(filename string) []int {
	data, err := os.ReadFile(filename)
	check(err)
	lines := strings.Split(string(data), "\n")
	ints := make([]int, 0)
	for _, v := range lines {
		if v == "" {
			continue
		}
		converted, err := strconv.Atoi(v)
		check(err)
		ints = append(ints, converted)
	}
	return ints
}

func compute(ints []int) int {
	for i, v := range ints {
		for _, w := range ints[i:] {
			if v+w == 2020 {
				return v * w
			}
		}
	}
	panic("Could not find two numbers that sum to 2020")
}

func main() {
	ints := read_input("data/1_test.txt")
	x := compute(ints)
	fmt.Printf("Test answer is %d\n", x)
	ints = read_input("data/1.txt")
	x = compute(ints)
	fmt.Printf("Main answer is %d\n", x)
}
