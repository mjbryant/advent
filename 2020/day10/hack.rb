
filename = ARGV.first
adapters = File.readlines(filename).map(&:to_i).sort
maximum_jolt = adapters.last + 3
adapters.push(maximum_jolt)

=begin
# For the example input, here is what is being calculated:

target:  options                   => total options
     1:  only 1 option (0 + 1)     => 1
     4:  only 1 option (1 + 3)     => 1
     5:  only 1 option (4 + 1)     => 1
     6:  either 4 + 2 or 5 + 1     => 2
     7:  6 + 1 or 5 + 2 or 4 + 3   => 2 (6) + 1 (5) + 1 (4)
    10:  only 1 option (7 + 3)     => 4
    11:  only 1 option (10 + 1)    => 4
    12:  either 10 + 2 or 11 + 1   => 4 (10) + 4 (11)
    15:  only 1 option 12 + 3      => 8
    16:  only 1 option 15 + 1      => 8
    19:  only 1 option 16 + 3      => 8
    22:  only 1 option 19 + 3      => 8
=end

  jolt_groups = adapters
    .each_with_index
    .map do |adapter, index|
      adapter - (index > 0 ? adapters[index - 1] : 0)
    end
    .group_by(&:itself)

  puts jolt_groups[1].length * jolt_groups[3].length

    # Track the number of options to get to a target jolt value
    # and default to 0. The first jolt value is 0, and can only
    # be reached in one way.
    options = Hash.new(0)
    options[0] = 1

    adapters.each do |target_jolts|
      options[target_jolts] = [1, 2, 3]
        .sum { |difference| options[target_jolts - difference] }
    end

    puts options[maximum_jolt]
