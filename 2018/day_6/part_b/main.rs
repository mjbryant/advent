use std::env;
use std::fs::File;
use std::io::{BufRead, BufReader};

fn main() {
    let args: Vec<String> = env::args().collect();
    let filename = match args.len() {
        1 => "input.txt",
        _ => &args[1],
    };
    let reader = BufReader::new(File::open(filename).expect("Failed to read file"));
}
