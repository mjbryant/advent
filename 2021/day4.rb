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
  board[x].uniq == ['T'] || board.map {|row| row[y]}.uniq == ['T']
end

def unmarked(board)
  # Sum of all unmarked numbers
  total = 0
  board.each do |row|
    row.each do |number|
      next if number == 'T'
      total += number
    end
  end
  total
end

def compute_a(chosen_numbers, boards)
  chosen_numbers.each do |chosen_number|
    # Start without an index to see how slow this is
    boards.each do |board|
      board.each_with_index do |row, x|
        row.each_with_index do |number, y|
          if chosen_number == number
            board[x][y] = 'T'
          end
          if check(board, x, y)
            return unmarked(board) * chosen_number
          end
        end
      end
    end
  end
end

def compute_b(chosen_numbers, boards)
  board_order = []
  last_chosen_number = nil
  chosen_numbers.each do |chosen_number|
    boards.each_with_index do |board, board_index|
      next if board_order.include?(board_index)
      board.each_with_index do |row, x|
        row.each_with_index do |number, y|
          next if number == 'T'
          if chosen_number == number
            board[x][y] = 'T'
          end
          if check(board, x, y)
            board_order << board_index
            break
          end
        end
        break if board_order.include?(board_index)
      end
    end
    last_chosen_number = chosen_number
    break if board_order.size == boards.size
  end
  last_board = boards[board_order.last]
  unmarked(last_board) * last_chosen_number
end

def print_board(board)
  board.each {|row| puts row.map {|number| '%2.2s' % number}.join(' ')}
  puts ''
end

def copy_boards(boards)
  boards.map do |board|
    board.map {|row| row.dup}
  end
end

def part_a
  chosen_numbers, boards = read_input('data/day4.txt')
  print_result(result: compute_a(chosen_numbers, copy_boards(boards)), day: 4, part: 'a')
end

def part_b
  chosen_numbers, boards = read_input('data/day4.txt')
  print_result(result: compute_b(chosen_numbers, copy_boards(boards)), day: 4, part: 'b')
end

def test
  chosen_numbers, boards = read_input('data/day4.test.txt')
  assert_equal(compute_a(chosen_numbers, copy_boards(boards)), 4512)
  assert_equal(compute_b(chosen_numbers, copy_boards(boards)), 1924)
end

test
part_a
part_b