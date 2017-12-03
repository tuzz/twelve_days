var Network = function () {
  var self = this;
  var data, stats;

  var initialize = function () {
    var networkData = require("../bin/network.json");

    stats = networkData.stats;
    data = networkData.data;

    self.setDecimalInput(13);

    setWords();
  };

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

  // These should match the Ruby implementation.
  self.nameFor = function (index) {
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

  var set = function (condition) {
    for (var i = 0; i < data.length; i += 1) {
      var item = data[i];

      if (condition(item)) {
        self.word = item.word;
        self.decimal = indexToDecimal(item.index);
        self.binary = item.binary;
        self.category = item.category;
        self.categoryName = self.nameFor(item.category);
        self.guess = item.guess;
        self.guessName = self.nameFor(item.guess);
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

  var setWords = function () {
    var words = [];

    for (var i = 1; i < data.length; i += 1) {
      var item = data[i];
      words[item.index - 1] = item.word;
    }

    self.words = words;
  };

  initialize();
};

module.exports = Network;
