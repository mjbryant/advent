use std::collections::HashSet;
use std::env;
use std::fs::File;
use std::io::{BufRead, BufReader};

/**
 * Goal: starting at 0, sum numbers from the file (cycling over from the
 * beginning if needed) until a cumulative sum you've already seen repeats.
 */
fn main() {
    let args: Vec<String> = env::args().collect();
    let filename = match args.len() {
        1 => "input.txt",
        _ => &args[1],
    };

    let reader = BufReader::new(File::open(filename).expect("Failed to read file"));
    let numbers: Vec<i32> = reader.lines().map(|line_result| {
        let line = line_result.unwrap();
        line.parse::<i32>().unwrap()
    }).collect();

    let mut seen = HashSet::new();
    let endless_numbers = numbers.iter().cycle();
    let mut total = 0;

    for number in endless_numbers {
        total += number;
        if seen.contains(&total) {
            println!("2018.1.b: {:?}", total);
            return
        }
        seen.insert(total);
    }
}
