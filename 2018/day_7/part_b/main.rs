use std::collections::{HashMap, HashSet};
use std::env;
use std::fs::File;
use std::io::{BufRead, BufReader};

type Nodes = HashMap<char, Node>;

#[derive(Debug)]
struct Node {
    id: char,
    children: Vec<char>,
    parents: Vec<char>,
}

impl Node {
    pub fn new(id: char) -> Self {
        Self {
            id,
            children: vec![],
            parents: vec![],
        }
    }

    pub fn add_child(&mut self, n: char) {
        self.children.push(n);
    }

    pub fn add_parent(&mut self, n: char) {
        self.parents.push(n);
    }
}

// Get all the nodes, but don't populate child/parent lists yet
fn get_nodes(lines: &[String]) -> Nodes {
    let mut seen = HashSet::new();
    for line in lines {
        let b = line.as_bytes();
        let first = b[5];
        let last = b[b.len() - 12];
        seen.insert(first.clone() as char);
        seen.insert(last.clone() as char);
    }
    let mut nodes = Nodes::new();
    for c in seen.iter() {
        nodes.insert(*c, Node::new(*c));
    }
    nodes
}

fn make_graph(nodes: &mut Nodes, lines: &[String]) {
    for line in lines {
        let b = line.as_bytes();
        let parent = (b[5] as char).clone();
        let child = (b[b.len() - 12] as char).clone();
        let parent_node = nodes.get_mut(&parent).unwrap();
        parent_node.add_child(child);
        let child_node = nodes.get_mut(&child).unwrap();
        child_node.add_parent(parent);
    }
}

/*
 * Now there are five workers that can work on steps simultaneously, and each
 * step takes 60s + Z(c), where Z is the position of the letter (A=1, B=2).
 * Steps still need to happen in order.
 */
fn get_order(nodes: &Nodes) -> String {
    let mut to_execute: Vec<char> = vec![];
    let mut executed: HashSet<char> = HashSet::new();
    // Duplication of the data in `executed`, but whatever
    let mut execution_order: String = String::new();
    // Add all initially executable nodes
    for node in nodes.values() {
        if node.parents.len() == 0 {
            to_execute.push(node.id.clone());
        }
    }
    while to_execute.len() > 0 {
        to_execute.sort();
        let next_node_id = to_execute.remove(0);
        executed.insert(next_node_id);
        execution_order.push(next_node_id);
        let next_node = nodes.get(&next_node_id).unwrap();
        for child_id in &next_node.children {
            let child = nodes.get(&child_id).unwrap();
            if child.parents.iter().all(|&parent_id| {
                executed.contains(&parent_id)
            }) {
                to_execute.push(*child_id);
            }
        }
    }
    execution_order
}

/**
 * Goal: given the parent/child relationships from the input, find the resolution
 * order. At each iteration, of all available tasks, the alphabetically first
 * ones must go first.
 */
fn main() {
    let args: Vec<String> = env::args().collect();
    let filename = match args.len() {
        1 => "input.txt",
        _ => &args[1],
    };
    let reader = BufReader::new(File::open(filename).expect("Failed to read file"));
    let mut lines: Vec<String> = vec![];
    for line_result in reader.lines() {
        let line = line_result.unwrap();
        lines.push(line);
    }
    // A map from node id (e.g. 'A') -> Node struct
    let mut nodes = get_nodes(&lines);
    make_graph(&mut nodes, &lines);
    let order = get_order(&nodes);
    println!("Execution order: {:?}", order);
}
