var Snowflake = require("./snowflake");

var View = function (network) {
  var self = this;
  var canvas, context;
  var snowflake;

  var initialize = function () {
    canvas = document.getElementById("canvas");
    canvas.width = 1200;
    canvas.height = 800;

    context = canvas.getContext("2d");
    context.translate(0.5, 0.5);

    var x = canvas.width / 2;
    var y = canvas.height / 2 - 40;
    var width = 600;

    snowflake = new Snowflake({ x: x, y: y }, width, 2);

    renderImages();
    bindKeys();
  };

  self.render = function () {
    // Clear everything except the images.
    context.clearRect(176, 0, canvas.width - 353, canvas.height - 60);
    context.clearRect(0, canvas.height - 60, canvas.width, 60);

    renderNetworkEdges();
    renderSnowflake();
    renderInputLayer();
    renderHiddenLayer();
    renderOutputLayer();
    renderArrow("guess", network.guess, "orange", -30);
    renderArrow("answer", network.category, "green", 30);
    renderSong();
    renderTrained();
    renderStats();
  };

  var renderSnowflake = function () {
    var color = randomBlue();

    context.strokeStyle = color;
    context.lineWidth = snowflake.width / 100;

    var points = snowflake.points;

    var first = points[0];
    var last = points[points.length - 1];

    var previous = first;
    for (var i = 1; i < points.length; i += 1) {
      var point = points[i];

      drawLine(previous, point);
      previous = point;
    }

    drawLine(last, first);

    return color;
  };

  var renderNetworkEdges = function () {
    for (var i = 0; i < network.binary.length; i += 1) {
      var from = inputPoint(i);

      for (var j = 0; j < network.hidden.length; j += 1) {
        var to = snowflake.points[j];

        context.lineWidth = 1;
        context.strokeStyle = randomBlue();

        context.globalAlpha = 0.3;
        drawLine(from, to);
      }
    }

    for (var i = 0; i < network.hidden.length; i += 1) {
      var from = snowflake.points[i];

      for (var j = 0; j < network.output.length; j += 1) {
        var to = imagePoint(j, true);

        context.lineWidth = 1;
        context.strokeStyle = randomBlue();

        context.globalAlpha = 0.05;
        drawLine(from, to);
      }
    }

    context.globalAlpha = 1;
  };

  var renderHiddenLayer = function () {
    for (var i = 0; i < network.hidden.length; i += 1) {
      var neuron = network.hidden[i];
      var point = snowflake.points[i];

      drawNeuron(neuron, point);
    }
  };

  var renderInputLayer = function () {
    var previous = inputPoint(network.binary.length - 1);

    for (var i = 0; i < network.binary.length; i += 1) {
      var current = inputPoint(i);
      drawLine(previous, current);
      previous = current;
    }

    for (var i = 0; i < network.binary.length; i += 1) {
      var neuron = network.binary[i];
      var text = 2 ** (network.binary.length - i - 1);

      var neuronPoint = inputPoint(i);
      drawNeuron(neuron, neuronPoint);

      var textPoint = inputPoint(i, true);
      var fontSize = snowflake.width / 30;
      drawText(text, textPoint, fontSize);
    }

    var fontSize = snowflake.width / 10;
    drawText(network.decimal, snowflake.centroid, fontSize);
  };

  var renderImages = function () {
    for (var i = 0; i < network.output.length; i += 1) {
      var name = network.nameFor(i + 1);
      var path = "images/" + name + ".jpg";
      var point = imagePoint(i);

      drawImage(path, point);
    }
  };

  var renderOutputLayer = function () {
    for (var i = 0; i < network.output.length; i += 1) {
      var neuron = network.output[i];
      var point = imagePoint(i, true);

      drawNeuron(neuron, point, false);
    }
  };

  var renderArrow = function (text, decimal, color, offset) {
    var point = imagePoint(decimal - 1, true);

    if (point.x < canvas.width / 2) {
      point.x += 60;
      text = "← " + text;
    } else {
      point.x -= 60;
      text += " →";
    }

    point.y = point.y + offset;

    drawText(text, point, 24, color);
  };

  var renderSong = function () {
    var word = network.word;

    var x = canvas.width / 2;
    var y = canvas.height - 50;
    var space = word.length * 8 + 20;

    renderWordsBetween(-11, -1, { x: x - space, y: y }, "right");
    renderWordsBetween(1, 11, { x: x + space, y: y }, "left");
    drawText(word, { x: x, y: y - 3 }, 40, "blue", "times");
  };

  var renderWordsBetween = function(from, to, point, align) {
    var current = network.decimal;
    var words = [];
    var dots = true;

    for (var i = from; i <= to; i += 1) {
      var word = network.words[current + i];

      if (word) {
        words.push(word);
      } else {
        dots = false;
      }
    }

    if (align === "left" && dots) {
      words.push("...");
    } else if (dots) {
      words = ["..."].concat(words);
    }

    drawText(words.join(" "), point, 24, "black", "times", align);
  };

  var renderTrained = function () {
    var x = canvas.width / 2;
    var y = canvas.height - 15;

    var binary = network.binary.join("");
    var word = network.word;

    var text, color;
    if (network.trained) {
      text = "(the network was trained with " + binary + "=" + word +")";
      color = "gray";
    } else {
      text = "(the network has never seen " + binary + " before)";
      color = "purple";
    }

    drawText(text, { x: x, y: y }, 20, color);
  };

  var renderStats = function () {
    var train = "training accurancy: " + network.stats.train + "%";
    var test = "test accurancy: " + network.stats.test + "%";
    var total = "overall: " + network.stats.total + "%";

    drawText(train, { x: canvas.width - 300, y: 20 }, 14, "black", "Arial", "right");
    drawText(test, { x: canvas.width - 300, y: 40 }, 14, "black", "Arial", "right");
    drawText(total, { x: canvas.width - 300, y: 60 }, 14, "black", "Arial", "right");
  };

  var drawImage = function (path, point) {
    var image = new Image();

    image.onload = function () {
      context.drawImage(image, point.x, point.y, 175, 100);
      context.strokeStyle = "gray";
      context.strokeRect(point.x, point.y, 175, 100);
    }

    image.src = path;
  };

  var inputPoint = function (i, offset = false) {
    var centroid = snowflake.centroid;
    var radius = snowflake.width / 6;

    if (offset) {
      radius *= 1.3;
    }

    var ratio = i / network.binary.length;

    return {
      x: (centroid.x + Math.sin(ratio * 2 * Math.PI) * radius),
      y: (centroid.y + Math.cos(ratio * 2 * Math.PI) * radius)
    };
  };

  var imagePoint = function (i, offset = false) {
    if (i < network.output.length / 2) {
      x = offset ? 175 : 0;
      y = i * 100;
    } else {
      x = canvas.width - 176;
      y = (i - 7) * 100;
    }

    if (offset) {
      y += 50;
    }

    return { x: x, y: y };
  };

  var drawText = function (text, point, fontSize, color = "black", face = "Arial", align = "center") {
    context.fillStyle = color;
    context.font = "" + fontSize + "px " + face;
    context.textAlign = align;
    context.textBaseline = "middle";
    context.fillText(text, point.x, point.y);
  };

  var drawLine = function (from, to) {
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
    context.closePath();
  };

  var drawNeuron = function (neuron, point, enableBlur = true) {
    var radius = snowflake.width / 50;
    var color = activationColor(neuron);
    var blur = radius * 2;

    context.beginPath();
    context.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.shadowColor = "yellow";
    context.shadowBlur = enableBlur && neuron > 0.8 ? blur : 0;
    context.fill();
    context.lineWidth = 1;
    context.stroke();

    context.shadowBlur = 0;
  };

  var bindKeys = function () {
		document.onkeydown = function (event) {
			event = event || window.event;

      switch (event.keyCode) {
        case 37: // left arrow
          event.preventDefault();
          left();
          break;
        case 39: // right arrow
          event.preventDefault();
          right();
          break;
      }
		};
  };

  var left = function () {
    var i = network.decimal;
    if (i === 0) return;
    network.setDecimalInput(i - 1);
    self.render();
  };

  var right = function () {
    var i = network.decimal;
    if (i === network.words.length - 1) return;
    network.setDecimalInput(i + 1);
    self.render();
  };

  var randomBlue = function () {
    var hex = ["a", "b", "c", "d", "e", "f"];

    var green = Math.floor(Math.random() * 6) + 4;
    var blue = Math.floor(Math.random() * 6);

    var g = "" + green;
    var b = "" + hex[blue];

    return "#00" + g + g + b + b;
  };

  var activationColor = function (neuron) {
    var percent = neuron * 100;
    return "rgb(" + percent + "%," + percent + "%,50%)";
  };

  initialize();
};

module.exports = View;
