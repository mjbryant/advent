require './util'

def read_input(filename)
  lines = File.open(filename).readlines
  chosen_numbers = lines[0].split(',').map(&:to_i)
  position = 2
  boards = []
  while position < lines.size - 1
    boards << lines.slice(position..(position + 4)).dup.map do |row|
      row.split(' ').map(&:to_i)
    end
    position += 6
  end
  [chosen_numbers, boards]
end

def check(board, x, y)
  board[x].uniq == [true] || board.map {|row| row[y]}.uniq == [true]
end

def unmarked(board)
  # Sum of all unmarked numbers
  total = 0
  board.each do |row|
    row.each do |number|
      next if number == true
      total += number
    end
  end
  total
end

def compute_a(chosen_numbers, boards)
  winning_board = nil
  chosen_numbers.each do |chosen_number|
    # Start without an index to see how slow this is
    boards.each do |board|
      board.each_with_index do |row, x|
        row.each_with_index do |number, y|
          if chosen_number == number
            board[x][y] = true
          end
          if check(board, x, y)
            return unmarked(board) * chosen_number
          end
        end
      end
    end
  end
end

def part_a
  chosen_numbers, boards = read_input('data/day4.txt')
  print_result(result: compute_a(chosen_numbers, boards), day: 4, part: 'a')
end

def test
  chosen_numbers, boards = read_input('data/day4.test.txt')
  assert_equal(compute_a(chosen_numbers, boards), 4512)
end

test
part_a