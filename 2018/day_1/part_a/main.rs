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
    let mut total = 0;
    for line_result in reader.lines() {
        // Need to do this in a separate line from as_str to make line live longer
        let line = line_result.unwrap();
        // Ignore empty lines
        if line.len() > 0 {
            let amount = line.parse::<i32>().unwrap();
            total += amount;
        }
    }
    println!("Final sum: {:?}", total);
}
