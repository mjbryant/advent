use std::env;
use std::fs::File;
use std::io::{BufRead, BufReader};

fn get_shared_chars(a: &str, b: &str) -> String {
    let mut chars_b = b.chars();
    let mut shared = String::new();
    for a_char in a.chars() {
        let b_char = chars_b.next().unwrap();
        if a_char == b_char {
            shared.push(a_char);
        }
    }
    return shared;
}

/**
 * Goal: find the two IDs from the file that differ by exactly one character in
 * the same position. We can just write an O(n^2) algorithm to do this easily.
 */
fn main() {
    let args: Vec<String> = env::args().collect();
    let filename = match args.len() {
        1 => "input.txt",
        _ => &args[1],
    };
    let reader = BufReader::new(File::open(filename).expect("Failed to read file"));
    let lines: Vec<String> = reader.lines().map(|line_result| line_result.unwrap()).collect();

    for i in 0..lines.len() {
        for j in i..lines.len() {
            let shared_chars = get_shared_chars(&lines[i], &lines[j]);
            if shared_chars.len() == (lines[i].len() - 1) {
                println!("Overlapping chars: {:?}", shared_chars);
                return
            }
        }
    }
}
