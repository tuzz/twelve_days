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
  };

  self.render = function () {
    context.clearRect(176, 0, canvas.width - 352, canvas.height);

    renderNetworkEdges();
    renderSnowflake();
    renderInputLayer();
    renderHiddenLayer();
    renderOutputLayer();
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

  var drawText = function (text, point, fontSize) {
    context.fillStyle = "black";
    context.font = "" + fontSize + "px Arial";
    context.textAlign = "center";
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
