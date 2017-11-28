class Writer
  def write
    song = Song.new.generate
    words = song.split(/\s+/)

    CSV.open("song.csv", "w") do |csv|
      words.each.with_index do |word, index|
        csv << [word, *binary(index), category(word)]
      end
    end
  end

  # 2^9 = 512 which is enough for the 425 words in the song.
  def binary(index)
    index.to_s(2).rjust(9, "0").chars
  end

  # These are the categories for the output neurons of the network.
  def category(word)
    case word
    when "partridge", "pear", "tree"
      1
    when "turtle", "doves"
      2
    when "french", "hens"
      3
    when "calling", "birds"
      4
    when "gold", "rings"
      5
    when "geese", "a-laying"
      6
    when "swans", "a-swimming"
      7
    when "maids", "a-milking"
      8
    when "ladies", "dancing"
      9
    when "lords", "a-leaping"
      10
    when "pipers", "piping"
      11
    when "drummers", "drumming"
      12
    when "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
      "eleven", "twelve", "first", "second", "third", "fourth", "fifth",
      "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"
      13
    else
      14
    end
  end
end
