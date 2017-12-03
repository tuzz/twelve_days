(function () {
  var Network = require("./network");
  var View = require("./view");

  var network = new Network();
  var view = new View(network);

  setInterval(function () {
    view.rotate();
    view.render();
  }, 1000 / 60);
})();
