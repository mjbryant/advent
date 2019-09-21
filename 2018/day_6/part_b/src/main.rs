use std::collections::{HashSet, HashMap};
use std::env;
use std::fs::File;
use std::io::{BufRead, BufReader};

#[derive(Debug)]
struct Point {
    x: i32,
    y: i32,
}

impl Point {
    pub fn translate(&mut self, x: i32, y: i32) {
        self.x += x;
        self.y += y;
    }
}

fn parse_points(string_iter: impl Iterator<Item=String>) -> Vec<Point> {
    string_iter.map(|s| {
        let xy: Vec<&str> = s.split(", ").collect();
        let x = xy[0].parse::<i32>().unwrap();
        let y = xy[1].parse::<i32>().unwrap();
        Point { x, y }
    }).collect()
}

// The grid is a NxM 2d coordinate space, where each cell holds a u32, which
// represents the index of points for the closest point. If there are two or
// more equidistant points, (or we haven't populated the grid yet), then -1
// is used.
fn make_grid(points: &mut Vec<Point>) -> Vec<Vec<i32>> {
    let mut min_x = 1000000;
    let mut max_x = 0;
    let mut min_y = 1000000;
    let mut max_y = 0;
    for i in 0..points.len() {
        let point = &points[i];
        if point.x > max_x {
            max_x = point.x.clone();
        }
        if point.x < min_x {
            min_x = point.x.clone();
        }
        if point.y > max_y {
            max_y = point.y.clone();
        }
        if point.y < min_y {
            min_y = point.y.clone();
        }
    }
    let width = max_x - min_x;
    let height = max_y - min_y;
    let total_width = (width * 3) + 1;
    let total_height = (height * 3) + 1;
    let x_padding = width - min_x;
    let y_padding = height - min_y;

    for i in 0..points.len() {
        let point = &mut points[i];
        point.translate(x_padding, y_padding);
    }

    let mut grid = vec![vec![-1; total_width as usize]; total_height as usize];

    for i in 0..points.len() {
        let point = &points[i];
        grid[point.y as usize][point.x as usize] = i as i32;
    }

    grid
}

fn distance(a: &Point, b: &Point) -> i32 {
    (a.x - b.x).abs() + (a.y - b.y).abs()
}

fn print_grid(grid: &Vec<Vec<i32>>) {
    for row in grid {
        for col in row {
            print!("{:02} ", col);
        }
        print!("\n");
    }
}

fn get_total_distance(target: Point, points: &Vec<Point>) -> i32 {
    let mut total = 0;
    for i in 0..points.len() {
        let point = &points[i];
        total += distance(&target, point);
    }
    total
}

fn count_all_close_cells(grid: &Vec<Vec<i32>>, points: &Vec<Point>) -> i32 {
    let mut cells_under_threshold = 0;
    for y in 0..grid.len() {
        for x in 0..grid[y].len() {
            if get_total_distance(
                Point { x: x as i32, y: y as i32 },
                points,
            ) < 10000 {
                cells_under_threshold += 1;
            }
        }
    }
    cells_under_threshold
}

/**
 * Goal: find the total number of cells that have the sum of all their distances
 * to all points less than 10000.
 *
 * Approach: count all cells that meet the criteria.
 */
fn main() {
    let args: Vec<String> = env::args().collect();
    let filename = match args.len() {
        1 => "input.txt",
        _ => &args[1],
    };
    let reader = BufReader::new(File::open(filename).expect("Failed to read file"));
    let mut points = parse_points(
        reader.lines().map(|line_result| line_result.unwrap())
    );
    let mut grid = make_grid(&mut points);
    let area = count_all_close_cells(&mut grid, &points);
    println!("There are {:?} cells under the threshold", area);
}
