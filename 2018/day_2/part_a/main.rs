use std::collections::HashMap;
use std::env;
use std::fs::File;
use std::io::{BufRead, BufReader};

// TODO this could have some more shared code.
fn has_exactly_two(s: &str) -> bool {
    let mut char_to_count = HashMap::new();
    for c in s.chars() {
        let counter = char_to_count.entry(c).or_insert(0);
        *counter += 1;
    }
    for count in char_to_count.values() {
        if *count == 2 {
            return true
        }
    }
    false
}

fn has_exactly_three(s: &str) -> bool {
    let mut char_to_count = HashMap::new();
    for c in s.chars() {
        let counter = char_to_count.entry(c).or_insert(0);
        *counter += 1;
    }
    for count in char_to_count.values() {
        if *count == 3 {
            return true
        }
    }
    false
}

/**
 * Goal: count the number of lines that have exactly two of any letter, then
 * also count the number of lines that have exactly three of any letter and
 * multiply these together to get the checksum.
 */
fn main() {
    let args: Vec<String> = env::args().collect();
    let filename = match args.len() {
        1 => "input.txt",
        _ => &args[1],
    };
    let reader = BufReader::new(File::open(filename).expect("Failed to read file"));
    let lines: Vec<String> = reader.lines().map(|line_result| line_result.unwrap()).collect();

    let mut total_2 = 0;
    let mut total_3 = 0;
    for line in lines {
        if has_exactly_two(&line) {
            total_2 += 1;
        }
        if has_exactly_three(&line) {
            total_3 += 1;
        }
    }
    println!("Checksum: {:?}", total_2 * total_3);
}
