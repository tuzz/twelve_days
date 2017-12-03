var Network = function () {
  var self = this;
  var data, stats;

  $.getJSON("network.json", function (networkData) {
    data = networkData.data;
    stats = networkData.stats;

    self.setDecimalInput(0);
  });

  self.setBinaryInput = function (binary) {
    return set(function (item) {
      return item.binary.toString() === binary.toString();
    });
  };

  self.setDecimalInput = function (decimal) {
    return set(function (item) {
      return indexToDecimal(item.index) === decimal;
    });
  };

  var set = function (condition) {
    for (var i = 0; i < data.length; i += 1) {
      var item = data[i];

      if (condition(item)) {
        self.word = item.word;
        self.decimal = indexToDecimal(item.index);
        self.binary = item.binary;
        self.category = item.category;
        self.categoryName = nameFor(item.category);
        self.guess = item.guess;
        self.guessName = nameFor(item.guess);
        self.hidden = item.hidden;
        self.output = item.output;
        self.trained = item.trained;

        return true;
      }
    }
  };

  // Octave is 1-indexed rather than 0-indexed.
  var indexToDecimal = function (index) {
    return index - 1;
  };

  // These should match the Ruby implementation.
  var nameFor = function (index) {
    return [
      "Partridge in a Pear Tree",
      "Turtle Dove",
      "French Hen",
      "Calling Bird",
      "Gold Ring",
      "Goose A-Laying",
      "Swan A-Swimming",
      "Maid A-Milking",
      "Lady Dancing",
      "Lord A-Leaping",
      "Piper Piping",
      "Drummer Drumming",
      "Numeric",
      "Other"
    ][indexToDecimal(index)];
  };
};
