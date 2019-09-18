use std::env;
use std::fs::File;
use std::io::{BufRead, BufReader};

#[derive(Debug)]
struct Rectangle {
    id: u32,
    x: usize,
    y: usize,
    width: usize,
    height: usize,
}

impl Rectangle {
    pub fn from_input(input: &str) -> Self {
        let mut words = input.split_whitespace();
        let rect_id = words.next().unwrap().trim_start_matches('#').parse::<u32>().unwrap();

        let x_y = words.nth(1).unwrap();
        let x_y_split: Vec<&str> = x_y.split(',').collect();
        let x = x_y_split[0].parse::<usize>().unwrap();
        let y = x_y_split[1].trim_end_matches(':').parse::<usize>().unwrap();

        let w_h = words.next().unwrap();
        let w_h_split: Vec<&str> = w_h.split('x').collect();
        let w = w_h_split[0].parse::<usize>().unwrap();
        let h = w_h_split[1].parse::<usize>().unwrap();

        Self {
            id: rect_id,
            x: x,
            y: y,
            width: w,
            height: h,
        }
    }
}

fn make_empty_grid(rects: &[Rectangle]) -> Vec<Vec<u32>> {
    let mut width = 0;
    let mut height = 0;
    for rect in rects {
        if rect.x + rect.width > width {
            width = rect.x + rect.width;
        }
        if rect.y + rect.height > height {
            height = rect.y + rect.height;
        }
    }
    vec![vec![0; width]; height]
}

fn populate_grid(grid: &mut[Vec<u32>], rects: &[Rectangle]) {
    for rect in rects {
        let mut i = rect.y;
        while i < (rect.y + rect.height) {
            let mut j = rect.x;
            while j < (rect.x + rect.width) {
                grid[i][j] += 1;
                j += 1;
            }
            i += 1;
        }
    }
}

fn count_overlapping(grid: &[Vec<u32>]) -> u32 {
    let mut total = 0;
    for row in grid {
        for cell in row {
            if cell > &1 {
                total += 1;
            }
        }
    }
    total
}

fn print_grid(grid: &[Vec<u32>]) {
    for row in grid {
        println!("{:?}", row);
    }
}

/**
 * Goal: given a list of rectangles in the format `X,Y: WxH`, find the total
 * number of square inches that overlap between at least two rectangles.
 * The easiest way I can think of to do this (and probably the least clever),
 * is to just keep a big grid of integers representing the entire space. For
 * every rect you then increment each of the cells in its area.
 */
fn main() {
    let args: Vec<String> = env::args().collect();
    let filename = match args.len() {
        1 => "input.txt",
        _ => &args[1],
    };

    // Read in the file and create the Rectangle structs
    let reader = BufReader::new(File::open(filename).expect("Failed to read file"));
    let rects: Vec<Rectangle> = reader.lines().map(|line_result| {
        let line = line_result.unwrap();
        Rectangle::from_input(&line)
    }).collect();

    // Create the encompassing grid and populate it from the rectangles
    let mut grid: Vec<Vec<u32>> = make_empty_grid(rects.as_slice());
    populate_grid(&mut grid, rects.as_slice());

    // Count the total number of overlapping squares
    let overlapping = count_overlapping(&grid);
    println!("There are {:?} overlapping squares", overlapping);
}
