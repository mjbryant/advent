use std::collections::HashSet;
use std::env;
use std::fs::File;
use std::io::Read;

fn should_react(a: &char, b: &char) -> bool {
    (a.is_ascii_uppercase() ^ b.is_ascii_uppercase()) &&
        (a.to_ascii_lowercase() == b.to_ascii_lowercase())
}

fn react_polymer(b: &mut Vec<u8>) {
    let mut i: usize = 1;
    while i < b.len() as usize {
        if i == 0 {
            i += 1;
        }
        if should_react(&(b[i] as char), &(b[i-1] as char)) {
            b.remove(i-1);
            b.remove(i-1);
            i -= 1;
        } else {
            i += 1;
        }
    }
}

fn remove_char(c: u8, b: Vec<u8>) -> Vec<u8> {
    b.iter().filter(|x| x.to_ascii_lowercase() != c).cloned().collect()
}

fn get_distinct_reagents(b: &Vec<u8>) -> HashSet<u8> {
    let mut distinct = HashSet::new();
    for c in b {
        distinct.insert(c.to_ascii_lowercase().clone());
    }
    distinct
}

/**
 * Goal: given a string of "reagents", two adjacent reagents react and cancel
 * each other out if they're the same character but a different case. React the
 * entire string until there are no more reactions. First try removing all of
 * a particular type of reagent (both upper and lower case, e.g. 'A' and 'a'),
 * and seeing what's the shortest total reacted polymer.
 */
fn main() {
    let args: Vec<String> = env::args().collect();
    let filename = match args.len() {
        1 => "input.txt",
        _ => &args[1],
    };
    let mut file = File::open(filename).expect("Failed to read file");
    let mut s = String::new();
    file.read_to_string(&mut s).expect("Failed to read file into String");
    s = String::from(s.trim());
    // Since the entire string is ASCII this should be fine, as each char is
    // going to fit in one byte.
    let b = s.into_bytes();
    println!("Started with a polymer of length {:?}", b.len());
    let distinct = get_distinct_reagents(&b);
    println!("{:?} distinct reagents found", distinct.len());
    let mut shortest = b.len();
    for c in distinct {
        let mut test_b = b.clone();
        test_b = remove_char(c, test_b);
        react_polymer(&mut test_b);
        if test_b.len() < shortest {
            shortest = test_b.len();
        }
    }
    println!("Ended with a polymer of length {:?}", shortest);
}
