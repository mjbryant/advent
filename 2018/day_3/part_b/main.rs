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

fn print_grid(grid: &[Vec<u32>]) {
    for row in grid {
        println!("{:?}", row);
    }
}

fn get_isolated_rect(grid: &[Vec<u32>], rects: &[Rectangle]) -> u32 {
    for rect in rects {
        let mut i = rect.y;
        let mut isolated = true;
        while i < (rect.y + rect.height) {
            let mut j = rect.x;
            while j < (rect.x + rect.width) {
                if grid[i][j] != 1 {
                    isolated = false;
                }
                j += 1;
            }
            i += 1;
        }
        if isolated {
            return rect.id.clone();
        }
    }
    return 0;
}

/**
 * Goal: given a list of rectangles in the format `X,Y: WxH`, find the one
 * rectangle that doesn't overlap with any other rectangles. The simplest way
 * I can think of to do this is to create the big grid, then go through each
 * rectangle, find it in the grid, and see if all its squares have 1's
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
    populate_grid(&mut grid, &rects);

    let rect_id = get_isolated_rect(&grid, &rects);
    println!("The rect without any overlap is {:?}", rect_id);
}
