var Snowflake = function (centroid, width, iterations = 3) {
  var self = this;

  var initialize = function () {
    var init = initialPoints();
    var points = [];

    points = points.concat(generate(init.topLeft, init.topRight));
    points = points.concat(generate(init.topRight, init.bottom));
    points = points.concat(generate(init.bottom, init.topLeft));

    self.points = unique(points);
  };

  var generate = function (a, b, iter = 0) {
    if (iter == iterations) return [a, b];

    var dx = b.x - a.x;
    var dy = b.y - a.y;
    var hypotenuse = Math.sqrt(dx * dx + dy * dy);
    var unit = hypotenuse / 3;
    var angle = Math.atan2(dy, dx);

    var nextToA = {
      x: a.x + dx / 3,
      y: a.y + dy / 3
    };

    var nextToB = {
      x: b.x - dx / 3,
      y: b.y - dy / 3
    };

    var middle = {
      x: nextToA.x + Math.cos(angle - Math.PI / 3) * unit,
      y: nextToA.y + Math.sin(angle - Math.PI / 3) * unit
    };

    var points = [];

    points = points.concat(generate(a, nextToA, iter + 1));
    points = points.concat(generate(nextToA, middle, iter + 1));
    points = points.concat(generate(middle, nextToB, iter + 1));
    points = points.concat(generate(nextToB, b, iter + 1));

    return points;
  };

  var initialPoints = function () {
    var height = width / 2 * Math.sqrt(3);

    return {
      topLeft: {
        x: centroid.x - width / 2,
        y: centroid.y - height * 1/3
      },
      topRight: {
        x: centroid.x + width / 2,
        y: centroid.y - height * 1/3
      },
      bottom: {
        x: centroid.x,
        y: centroid.y + height * 2/3
      }
    };
  };

  // We can scan in O(n) because the points are ordered.
  var unique = function (points) {
    var acc = [];
    var lastPoint;

    for (var i = 0; i < points.length; i += 1) {
      var point = points[i];

      if (point !== lastPoint) {
        acc.push(point);
        lastPoint = point;
      }
    }

    if (acc[0] === acc[acc.length - 1]) {
      acc.splice(-1, 1);
    }

    return acc;
  }

  initialize();
};

module.exports = Snowflake;
