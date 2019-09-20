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

fn get_closest_point(target: Point, points: &Vec<Point>) -> i32 {
    let mut min_distance = 10000;
    let mut num_at_min_distance = 0;
    let mut min_point: i32 = -1;
    for i in 0..points.len() {
        let point = &points[i];
        let d = distance(&target, point);
        if d == min_distance {
            num_at_min_distance += 1;
        } else if d < min_distance {
            min_distance = d;
            num_at_min_distance = 1;
            min_point = i.clone() as i32;
        }
    }
    if num_at_min_distance > 1 {
        -1
    } else {
        min_point
    }
}

// For each cell in the entire grid, find the closest point and fill it in.
// If there are two or more equidistant points keep it as -1.
fn populate_grid(grid: &mut Vec<Vec<i32>>, points: &Vec<Point>) {
    for row_num in 0..grid.len() {
        for col_num in 0..grid[row_num].len() {
            let closest_point = get_closest_point(
                Point { x: col_num as i32, y: row_num as i32 },
                points,
            );
            grid[row_num][col_num] = closest_point;
        }
    }
}

fn print_grid(grid: &Vec<Vec<i32>>) {
    for row in grid {
        for col in row {
            print!("{:02} ", col);
        }
        print!("\n");
    }
}

fn get_largest_finite_area(grid: &Vec<Vec<i32>>) -> i32 {
    let mut infinite_areas = HashSet::new();
    // Save the point indices of the infinite areas so we don't count those
    for col in &grid[0] {
        infinite_areas.insert(col.clone());
    }
    for col in &grid[grid.len() - 1] {
        infinite_areas.insert(col.clone());
    }
    for row in grid {
        infinite_areas.insert(row[0].clone());
        infinite_areas.insert(row[row.len() - 1].clone());
    }
    let mut areas = HashMap::new();
    for row in grid {
        for col in row {
            let value = col.clone();
            if !infinite_areas.contains(&value) {
                let val = areas.entry(value).or_insert(0);
                *val += 1;
            }
        }
    }
    let mut largest_area = 0;
    for area in areas.values() {
        if area > &largest_area {
            largest_area = *area;
        }
    }
    largest_area
}

/**
 * Goal: find the largest non-infinite Voronoi area of a set of points. The
 * simplest (though very inefficient) way of doing this is just to create a
 * grid that's way larger than the necessary space and fill in all squares with
 * their nearest point. Then count them up, excluding any points whose area goes
 * to the edge of the space.
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
    populate_grid(&mut grid, &points);
    let largest_area = get_largest_finite_area(&grid);
    println!("The largest finite area is: {:?}", largest_area);
}
