var View = function (network, snowflake) {
  var self = this;
  var canvas, context;

  var initialize = function () {
    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    context = canvas.getContext("2d");
    context.translate(0.5, 0.5);
  };

  self.render = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);

    renderSnowflake();
    renderNetwork();
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

  var renderNetwork = function () {
    for (var i = 0; i < network.hidden.length; i += 1) {
      var neuron = network.hidden[i];
      var point = snowflake.points[i];

      drawNeuron(neuron, point);
    }
  };

  var drawLine = function (from, to) {
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
    context.closePath();
  };

  var drawNeuron = function (neuron, point) {
    var radius = snowflake.width / 50;
    var color = activationColor(neuron);
    var blur = radius * 2;

    context.beginPath();
    context.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.shadowColor = "yellow";
    context.shadowBlur = neuron > 0.8 ? blur : 0;
    context.fill();
    context.lineWidth = 1;
    context.stroke();
  };

  var randomBlue = function () {
    var hex = ["a", "b", "c", "d", "e", "f"]

    var green1 = Math.floor(Math.random() * 6);
    var green2 = Math.floor(Math.random() * 6);

    var blue1 = Math.floor(Math.random() * 6);
    var blue2 = Math.floor(Math.random() * 6);

    var green = "" + green1 + green2;
    var blue = "" + hex[blue1] + hex[blue2];

    return "#00" + green + blue;
  };

  var activationColor = function (neuron) {
    var percent = neuron * 100;
    return "rgb(" + percent + "%," + percent + "%,50%)";
  };

  initialize();
};

module.exports = View;
