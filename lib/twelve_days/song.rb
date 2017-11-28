class Song
  GIFTS = [
    "a partridge in a pear tree",
    "two turtle doves",
    "three french hens",
    "four calling birds",
    "five gold rings",
    "six geese a-laying",
    "seven swans a-swimming",
    "eight maids a-milking",
    "nine ladies dancing",
    "ten lords a-leaping",
    "eleven pipers piping",
    "twelve drummers drumming",
  ]

  DAYS = %w(
    first second third fourth fifth sixth
    seventh eighth ninth tenth eleventh twelfth
  )

  def generate
    12.times.map { |i| verse(i) }.join("\n")
  end

  def verse(i)
    lines = GIFTS[0..i]
    lines[0] = "and #{lines[0]}" unless i.zero?
    lines.reverse!
    lines.unshift("on the #{DAYS[i]} day of christmas my true love gave to me")
    lines.join("\n")
  end
end
