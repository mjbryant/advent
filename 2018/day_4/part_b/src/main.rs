use std::collections::HashMap;
use std::env;
use std::fs::File;
use std::io::{BufRead, BufReader};

use chrono::{NaiveDateTime, Timelike};

#[derive(Debug, PartialEq)]
enum EventType {
    StartShift,
    WakeUp,
    FallAsleep,
}

#[derive(Debug)]
struct Event {
    guard: i32,
    event_type: EventType,
    datetime: NaiveDateTime,
}

fn get_guard_id(s: &str) -> i32 {
    let id_start = s.find('#').unwrap();
    let substr = &s[id_start..];
    let id_end = substr.find(' ').unwrap();
    let guard_id_substr = &substr[1..id_end];
    guard_id_substr.parse::<i32>().unwrap()
}

fn parse_events(string_iter: impl Iterator<Item=String>) -> Vec<Event> {
    string_iter.map(|s| {
        let end_dt_index = s.find(']').unwrap();
        let dt_substr = &s[0..end_dt_index + 1];
        let datetime = NaiveDateTime::parse_from_str(dt_substr, "[%Y-%m-%d %H:%M]").unwrap();
        let len = s.len();
        let event_type = match &s[len - 5..] {
            "es up" => EventType::WakeUp,
            "shift" => EventType::StartShift,
            "sleep" => EventType::FallAsleep,
            _ => panic!("Unexpected line item!"),
        };
        let guard: i32;
        if event_type == EventType::StartShift {
            guard = get_guard_id(&s);
        } else {
            guard = -1;
        }
        Event {
            guard,
            event_type,
            datetime,
        }
    }).collect()
}

fn get_sleep_times_by_guard(events: &[Event]) -> HashMap<i32, Vec<u32>> {
    let mut current_guard = events[0].guard;
    if current_guard == -1 {
        panic!("Events don't start with a guard starting their shift!");
    }
    // The minute they fell asleep
    let mut fell_asleep = 0;

    let mut guard_to_sleep_times = HashMap::new();
    for i in 1..events.len() {
        let event = &events[i];
        match event.event_type {
            EventType::FallAsleep => {
                fell_asleep = event.datetime.minute();
            },
            EventType::WakeUp => {
                let times: &mut[u32] = guard_to_sleep_times.entry(
                    current_guard.clone()
                ).or_insert(vec![0; 60]);
                for minute in fell_asleep..event.datetime.minute() {
                    times[minute as usize] += 1;
                }
            },
            EventType::StartShift => {
                current_guard = event.guard;
            },
        }
    }
    guard_to_sleep_times
}

fn get_most_slept_checksum(sleep_times_by_guard: &HashMap<i32, Vec<u32>>) -> i32 {
    // The most slept on any single minute, across all guards
    let mut max_sleep = 0;
    let mut max_sleep_minute = 0;
    let mut max_guard = 0;
    for (guard_id, minutes) in sleep_times_by_guard {
        for i in 0..minutes.len() {
            let sleep = minutes[i];
            if sleep > max_sleep {
                max_guard = *guard_id;
                max_sleep = sleep;
                max_sleep_minute = i;
            }
        }
    }
    max_guard * (max_sleep_minute as i32)
}

/**
 * Goal: given a list of events - begin_shift/wake_up/fall_asleep - sort them,
 * then find the guard that's asleep for the most minutes and which minute
 * (00 - 59) of the midnight hour on which he was most often asleep.
 *
 * Approach: given a list of records, sort them by datetime. Then go through
 * with a minimal state machine, populating an array of minutes that each
 * guard was asleep for. Then find the guard who was asleep the most (summing
 * their array) and their most sleepy minute (argmax of the array)
 */
fn main() {
    let args: Vec<String> = env::args().collect();
    let filename = match args.len() {
        1 => "input.txt",
        _ => &args[1],
    };
    let reader = BufReader::new(File::open(filename).expect("Failed to read file"));

    let mut events = parse_events(
        reader.lines().map(|line_result| line_result.unwrap())
    );
    // Use a comparator to be able to use references to the structs' keys
    events.sort_by(|e1, e2| e1.datetime.cmp(&e2.datetime));

    let sleep_times_by_guard = get_sleep_times_by_guard(&events);
    let cs = get_most_slept_checksum(&sleep_times_by_guard);
    println!("Checksum: {:?}", cs);
}
