all: run

run:
	rustc -g main.rs
	RUST_BACKTRACE=1 ./main

test:
	rustc -g main.rs
	RUST_BACKTRACE=1 ./main test.txt
